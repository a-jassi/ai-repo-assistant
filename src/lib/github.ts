import { db } from "@/server/db";
import { Octokit } from "octokit";
import axios from "axios";
import { aiSummarizeCommit } from "./gemini";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

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

  return project.githubUrl;
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
    headers: {
      Accept: "application/vnd.github.v3.diff",
    },
  });

  return await aiSummarizeCommit(data);
};

export const pollCommits = async (projectId: string) => {
  const githubUrl = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl);
  const unprocessedCommits = await filterUnprocessedCommits(
    projectId,
    commitHashes,
  );

  const summaryResponses = await Promise.allSettled(
    unprocessedCommits.map((commit) => {
      return summarizeCommit(githubUrl, commit.commitHash);
    }),
  );

  const summaries = summaryResponses.map((response) => {
    if (response.status === "fulfilled") {
      return response.value;
    }

    return "";
  });

  const commits = await db.commit.createMany({
    data: summaries.map((summary, i) => {
      return {
        projectId,
        commitHash: unprocessedCommits[i]!.commitHash,
        commitMessage: unprocessedCommits[i]!.commitMessage,
        commitAuthorName: unprocessedCommits[i]!.commitAuthorName,
        commitAuthorAvatar: unprocessedCommits[i]!.commitAuthorAvatar,
        commitDate: unprocessedCommits[i]!.commitDate,
        summary,
      };
    }),
  });

  return commits;
};
