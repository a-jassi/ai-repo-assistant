import { db } from "@/server/db";
import { Octokit } from "octokit";
import axios from "axios";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const githubUrl = "https://github.com/a-jassi/ai-repo-assistant";

type Response = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

export const getCommitHashes = async (
  githubUrl: string,
): Promise<Response[]> => {
  const [owner, repo] = githubUrl.split("/").slice(-2);
  if (!owner || !repo || !githubUrl.startsWith("https://github.com/")) {
    throw new Error("Invalid GitHub URL");
  }

  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });

  const sortedCommits = data.sort(
    (a: any, b: any) =>
      new Date(b.commit.author.date).getTime() -
      new Date(a.commit.author.date).getTime(),
  );

  return sortedCommits.slice(0, 10).map((commit: any) => ({
    commitHash: commit.sha as string,
    commitMessage: commit.commit?.message ?? "",
    commitAuthorName: commit.commit?.author?.name ?? "",
    commitAuthorAvatar: commit.commit?.author?.avatar_url ?? "",
    commitDate: commit.commit?.author.date ?? "",
  }));
};

const fetchProjectGithubUrl = async (projectId: string) => {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: {
      githubUrl: true,
    },
  });

  if (!project?.githubUrl) {
    throw new Error("Project has no GitHub URL");
  }

  return {
    project,
    githubUrl: project?.githubUrl,
  };
};

const filterUnprocessedCommits = async (
  projectId: string,
  commitHashes: Response[],
) => {
  const processedCommits = await db.commit.findMany({
    where: { projectId },
  });

  const processedCommitHashes = new Set(
    processedCommits.map((commit) => commit.commitHash),
  );

  const unprocessedCommits = commitHashes.filter(
    (commit) => !processedCommitHashes.has(commit.commitHash),
  );

  return unprocessedCommits;
};

const summarizeCommit = async (githubUrl: string, commitHash: string) => {
  const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
    headers,
  });
};

export const pollCommits = async (projectId: string) => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl);
  const unprocessedCommits = await filterUnprocessedCommits(
    projectId,
    commitHashes,
  );
};
