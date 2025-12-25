#!/usr/bin/env bun

import type { StatuslineConfig } from "../statusline.config";
import { defaultConfig } from "../statusline.config";
import { getContextData } from "./lib/context";
import {
	colors,
	formatBranch,
	formatCost,
	formatDuration,
	formatPath,
	formatProgressBar,
	formatResetTime,
	formatSession,
} from "./lib/formatters";
import { getGitStatus } from "./lib/git";
import { saveSession } from "./lib/spend";
import type { HookInput } from "./lib/types";
import { getUsageLimits } from "./lib/usage-limits";

function buildFirstLine(
	branch: string,
	dirPath: string,
	modelName: string,
	showSonnetModel: boolean,
	separator: string,
	numberOfLines: 1 | 2 | 3,
): string {
	const isSonnet = modelName.toLowerCase().includes("sonnet");
	const sep = `${colors.GRAY} ${separator} ${colors.LIGHT_GRAY}`;

	// Mode 3 lignes : chemin + git (pas de model)
	if (numberOfLines === 3) {
		if (branch) {
			return `${colors.LIGHT_GRAY}${dirPath}${sep}${branch}${colors.RESET}`;
		}
		return `${colors.LIGHT_GRAY}${dirPath}${colors.RESET}`;
	}

	// Mode 1 ou 2 lignes : comportement original
	if (isSonnet && !showSonnetModel) {
		return `${colors.LIGHT_GRAY}${branch} ${sep} ${dirPath}${colors.RESET}`;
	}

	return `${colors.LIGHT_GRAY}${branch} ${sep} ${dirPath} ${sep} ${modelName}${colors.RESET}`;
}

function buildSecondLine(
	sessionCost: string,
	_sessionDuration: string,
	tokensUsed: number,
	tokensMax: number,
	contextPercentage: number,
	fiveHourUtilization: number | null,
	fiveHourReset: string | null,
	sessionConfig: StatuslineConfig["session"],
	limitsConfig: StatuslineConfig["limits"],
	separator: string,
	numberOfLines: 1 | 2 | 3,
): string {
	let line = formatSession(
		sessionCost,
		tokensUsed,
		tokensMax,
		contextPercentage,
		sessionConfig,
	);

	// Mode 3 lignes : ne pas ajouter les limites sur la ligne 2
	if (numberOfLines === 3) {
		line += colors.RESET;
		return line;
	}

	// Mode 1 ou 2 lignes : ajouter les limites sur la même ligne
	if (fiveHourUtilization !== null && fiveHourReset) {
		const resetTime = formatResetTime(fiveHourReset);
		const sep = `${colors.GRAY}${separator}`;

		if (limitsConfig.showProgressBar) {
			const bar = formatProgressBar(
				fiveHourUtilization,
				limitsConfig.progressBarLength,
				limitsConfig.color,
			);
			line += ` ${sep} ${colors.GRAY}Session:${colors.LIGHT_GRAY} ${bar} ${colors.LIGHT_GRAY}${fiveHourUtilization}${colors.GRAY}% ${colors.GRAY}(${resetTime} restant)`;
		} else {
			line += ` ${sep} ${colors.GRAY}Session:${colors.LIGHT_GRAY} ${fiveHourUtilization}${colors.GRAY}% ${colors.GRAY}(${resetTime} restant)`;
		}
	}

	line += colors.RESET;

	return line;
}

function buildThirdLine(
	fiveHourUtilization: number | null,
	fiveHourReset: string | null,
	limitsConfig: StatuslineConfig["limits"],
): string {
	if (fiveHourUtilization === null || !fiveHourReset) {
		return "";
	}

	const resetTime = formatResetTime(fiveHourReset);
	let line = "";

	if (limitsConfig.showProgressBar) {
		const bar = formatProgressBar(
			fiveHourUtilization,
			limitsConfig.progressBarLength,
			limitsConfig.color,
		);
		line = `${colors.GRAY}Session:${colors.LIGHT_GRAY} ${bar} ${colors.LIGHT_GRAY}${fiveHourUtilization}${colors.GRAY}% ${colors.GRAY}(${resetTime} restant)${colors.RESET}`;
	} else {
		line = `${colors.GRAY}Session:${colors.LIGHT_GRAY} ${fiveHourUtilization}${colors.GRAY}% ${colors.GRAY}(${resetTime} restant)${colors.RESET}`;
	}

	return line;
}

async function main() {
	try {
		const input: HookInput = await Bun.stdin.json();

		await saveSession(input);

		const git = await getGitStatus();
		const branch = formatBranch(git, defaultConfig.git);
		const dirPath = formatPath(
			input.workspace.current_dir,
			defaultConfig.pathDisplayMode,
		);

		const contextData = await getContextData({
			transcriptPath: input.transcript_path,
			maxContextTokens: defaultConfig.context.maxContextTokens,
			autocompactBufferTokens: defaultConfig.context.autocompactBufferTokens,
			useUsableContextOnly: defaultConfig.context.useUsableContextOnly,
			overheadTokens: defaultConfig.context.overheadTokens,
		});
		const usageLimits = await getUsageLimits();

		const sessionCost = formatCost(input.cost.total_cost_usd);
		const sessionDuration = formatDuration(input.cost.total_duration_ms);

		const firstLine = buildFirstLine(
			branch,
			dirPath,
			input.model.display_name,
			defaultConfig.showSonnetModel,
			defaultConfig.separator,
			defaultConfig.numberOfLines,
		);
		const secondLine = buildSecondLine(
			sessionCost,
			sessionDuration,
			contextData.tokens,
			defaultConfig.context.maxContextTokens,
			contextData.percentage,
			usageLimits.five_hour?.utilization ?? null,
			usageLimits.five_hour?.resets_at ?? null,
			defaultConfig.session,
			defaultConfig.limits,
			defaultConfig.separator,
			defaultConfig.numberOfLines,
		);
		const thirdLine = buildThirdLine(
			usageLimits.five_hour?.utilization ?? null,
			usageLimits.five_hour?.resets_at ?? null,
			defaultConfig.limits,
		);

		if (defaultConfig.numberOfLines === 1) {
			// Mode 1 ligne : tout sur une seule ligne
			const sep = ` ${colors.GRAY}${defaultConfig.separator}${colors.LIGHT_GRAY} `;
			console.log(`${firstLine}${sep}${secondLine}`);
			console.log(""); // Empty second line for spacing
		} else if (defaultConfig.numberOfLines === 2) {
			// Mode 2 lignes : chemin+git sur ligne 1, session+limites sur ligne 2
			console.log(firstLine);
			console.log(secondLine);
		} else {
			// Mode 3 lignes : chemin sur ligne 1, session sur ligne 2, limites sur ligne 3
			console.log(firstLine);
			console.log(secondLine);
			console.log(thirdLine);
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.log(
			`${colors.RED}Error:${colors.LIGHT_GRAY} ${errorMessage}${colors.RESET}`,
		);
		console.log(`${colors.GRAY}Check statusline configuration${colors.RESET}`);
	}
}

main();
