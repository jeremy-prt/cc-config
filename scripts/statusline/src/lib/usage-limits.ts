import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { execSync } from "node:child_process";

export interface UsageLimits {
	five_hour: {
		utilization: number;
		resets_at: string | null;
	} | null;
	seven_day: {
		utilization: number;
		resets_at: string | null;
	} | null;
}

interface CachedUsageLimits {
	data: UsageLimits;
	timestamp: number;
}

const CACHE_DURATION_MS = 60 * 1000; // 1 minute

function getCacheFilePath(): string {
	// Utiliser __dirname pour Node.js au lieu de import.meta.dir (Bun)
	const projectRoot = join(__dirname, "..", "..");
	return join(projectRoot, "data", "usage-limits-cache.json");
}

interface Credentials {
	claudeAiOauth: {
		accessToken: string;
		refreshToken: string;
		expiresAt: number;
		scopes: string[];
		subscriptionType: string;
	};
}

export async function getCredentials(): Promise<string | null> {
	try {
		// Cette commande ne fonctionne que sur macOS
		// Sur Windows, retourner null (la statusline affichera sans les limites)
		if (process.platform !== "darwin") {
			return null;
		}

		const result = execSync(
			'security find-generic-password -s "Claude Code-credentials" -w',
			{ encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] },
		);
		const creds: Credentials = JSON.parse(result.trim());
		return creds.claudeAiOauth.accessToken;
	} catch {
		return null;
	}
}

export async function fetchUsageLimits(
	token: string,
): Promise<UsageLimits | null> {
	try {
		const response = await fetch("https://api.anthropic.com/api/oauth/usage", {
			method: "GET",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
				"User-Agent": "claude-code/2.0.31",
				Authorization: `Bearer ${token}`,
				"anthropic-beta": "oauth-2025-04-20",
				"Accept-Encoding": "gzip, compress, deflate, br",
			},
		});

		if (!response.ok) {
			return null;
		}

		const data = await response.json();

		return {
			five_hour: data.five_hour || null,
			seven_day: data.seven_day || null,
		};
	} catch {
		return null;
	}
}

async function loadCache(): Promise<CachedUsageLimits | null> {
	try {
		const cacheFile = getCacheFilePath();
		if (!existsSync(cacheFile)) {
			return null;
		}

		const content = await readFile(cacheFile, "utf-8");
		const cached: CachedUsageLimits = JSON.parse(content);

		// Check if cache is still valid (< 1 minute old)
		const now = Date.now();
		if (now - cached.timestamp < CACHE_DURATION_MS) {
			return cached;
		}

		return null;
	} catch {
		return null;
	}
}

async function saveCache(data: UsageLimits): Promise<void> {
	try {
		const cacheFile = getCacheFilePath();
		const cached: CachedUsageLimits = {
			data,
			timestamp: Date.now(),
		};

		await writeFile(cacheFile, JSON.stringify(cached, null, 2));
	} catch {
		// Fail silently
	}
}

export async function getUsageLimits(): Promise<UsageLimits> {
	try {
		// Try to load from cache first
		const cached = await loadCache();
		if (cached) {
			return cached.data;
		}

		// Cache miss or expired - fetch from API
		const token = await getCredentials();

		if (!token) {
			return { five_hour: null, seven_day: null };
		}

		const limits = await fetchUsageLimits(token);

		if (!limits) {
			return { five_hour: null, seven_day: null };
		}

		// Save to cache
		await saveCache(limits);

		return limits;
	} catch {
		return { five_hour: null, seven_day: null };
	}
}
