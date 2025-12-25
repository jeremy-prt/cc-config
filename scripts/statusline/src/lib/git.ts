import { execSync } from "node:child_process";

export interface GitStatus {
	branch: string;
	hasChanges: boolean;
	staged: {
		added: number;
		deleted: number;
		files: number;
	};
	unstaged: {
		added: number;
		deleted: number;
		files: number;
	};
}

function exec(command: string, cwd?: string): { stdout: string; exitCode: number } {
	try {
		const stdout = execSync(command, {
			encoding: "utf-8",
			stdio: ["pipe", "pipe", "pipe"],
			cwd: cwd || process.cwd(),
		});
		return { stdout, exitCode: 0 };
	} catch (error: any) {
		return {
			stdout: error.stdout?.toString() || "",
			exitCode: error.status || 1,
		};
	}
}

export async function getGitStatus(cwd?: string): Promise<GitStatus> {
	try {
		const isGitRepo = exec("git rev-parse --git-dir", cwd);
		if (isGitRepo.exitCode !== 0) {
			return {
				branch: "no-git",
				hasChanges: false,
				staged: { added: 0, deleted: 0, files: 0 },
				unstaged: { added: 0, deleted: 0, files: 0 },
			};
		}

		const branchResult = exec("git branch --show-current", cwd);
		const branch = branchResult.stdout.trim() || "detached";

		const diffCheck = exec("git diff-index --quiet HEAD --", cwd);
		const cachedCheck = exec("git diff-index --quiet --cached HEAD --", cwd);

		if (diffCheck.exitCode !== 0 || cachedCheck.exitCode !== 0) {
			const unstagedDiff = exec("git diff --numstat", cwd).stdout;
			const stagedDiff = exec("git diff --cached --numstat", cwd).stdout;
			const stagedFilesResult = exec("git diff --cached --name-only", cwd).stdout;
			const unstagedFilesResult = exec("git diff --name-only", cwd).stdout;

			const parseStats = (diff: string) => {
				let added = 0;
				let deleted = 0;
				for (const line of diff.split("\n")) {
					if (!line.trim()) continue;
					const [a, d] = line
						.split("\t")
						.map((n) => Number.parseInt(n, 10) || 0);
					added += a;
					deleted += d;
				}
				return { added, deleted };
			};

			const unstagedStats = parseStats(unstagedDiff);
			const stagedStats = parseStats(stagedDiff);

			const stagedFilesCount = stagedFilesResult
				.split("\n")
				.filter((f) => f.trim()).length;
			const unstagedFilesCount = unstagedFilesResult
				.split("\n")
				.filter((f) => f.trim()).length;

			return {
				branch,
				hasChanges: true,
				staged: {
					added: stagedStats.added,
					deleted: stagedStats.deleted,
					files: stagedFilesCount,
				},
				unstaged: {
					added: unstagedStats.added,
					deleted: unstagedStats.deleted,
					files: unstagedFilesCount,
				},
			};
		}

		return {
			branch,
			hasChanges: false,
			staged: { added: 0, deleted: 0, files: 0 },
			unstaged: { added: 0, deleted: 0, files: 0 },
		};
	} catch {
		return {
			branch: "no-git",
			hasChanges: false,
			staged: { added: 0, deleted: 0, files: 0 },
			unstaged: { added: 0, deleted: 0, files: 0 },
		};
	}
}
