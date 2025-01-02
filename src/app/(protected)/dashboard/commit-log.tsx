"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useUser } from "@clerk/nextjs";
import { AvatarImage } from "@radix-ui/react-avatar";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

const CommitLog = () => {
  const { selectedProjectId: projectId, project } = useProject();
  const { data: commits } = api.project.getCommits.useQuery({ projectId });
  const { user } = useUser();

  return (
    <div>
      <ul className="space-y-6">
        {commits?.map((commit, i) => (
          <li key={commit.id} className="relative flex gap-x-4">
            <div
              className={cn(
                i === commits.length - 1 ? "h-6" : "-bottom-6",
                "absolute left-0 top-0 flex w-6 justify-center",
              )}
            >
              <div className="w-px translate-x-1 bg-primary"></div>
            </div>

            <Avatar className="mt-4">
              <AvatarImage
                src={commit.commitAuthorAvatar}
                alt="Author Avatar"
              />
              <AvatarFallback>
                {user?.firstName?.[0] ??
                  user?.emailAddresses[0]?.emailAddress[0]}
              </AvatarFallback>
            </Avatar>
            <Card className="flex-auto rounded-md p-3">
              <div className="flex justify-between gap-x-4">
                <Link
                  target="_blank"
                  href={`${project?.githubUrl}/commit/${commit.commitHash}`}
                  className="py-0.5 text-xs leading-5 dark:text-gray-200/75"
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {commit.commitAuthorName}
                  </span>{" "}
                  <span className="inline-flex items-center">
                    commited
                    <ExternalLink className="ml-1 size-4" />
                  </span>
                </Link>
              </div>
              <span className="font-semibold">{commit.commitMessage}</span>
              <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 dark:text-gray-200/75">
                {commit.summary}
              </pre>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommitLog;
