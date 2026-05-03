"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useProject from "@/hooks/use-project";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import Image from "next/image";
import { askQuestion, SimilarFiles } from "./actions";
import { readStreamableValue } from "ai/rsc";
import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "next-themes";
import { CodeReferences } from "./code-references";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const AskQuestionCard = () => {
  const { project } = useProject();
  const [question, setQuestion] = useState("");
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filesReferenced, setFilesReferenced] = useState<SimilarFiles[]>([]);
  const [result, setResult] = useState("");
  const saveResponse = api.project.saveResponse.useMutation();

  const { theme } = useTheme();

  const resetDialog = () => {
    setResult("");
    setFilesReferenced([]);
    setDialogIsOpen(false);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    resetDialog();
    e.preventDefault();

    if (!project?.id) return;
    setIsLoading(true);

    const { output, filesReferenced } = await askQuestion(question, project.id);
    setDialogIsOpen(true);
    setFilesReferenced(filesReferenced);

    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        setResult((res) => res + delta);
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
        <DialogContent data-color-mode={theme}>
          <DialogHeader>
            <DialogTitle>
              <Image src="/logo.png" alt="Athena" width={40} height={40} />
            </DialogTitle>
            <Button
              variant={"outline"}
              disabled={saveResponse.isPending}
              onClick={() =>
                saveResponse.mutate(
                  {
                    projectId: project!.id,
                    question,
                    response: result,
                    filesReferenced,
                  },
                  {
                    onSuccess: () => {
                      toast.success("Response Saved!");
                    },
                    onError: () => {
                      toast.error("Failed to save response!");
                    },
                  },
                )
              }
            >
              Save Response
            </Button>
          </DialogHeader>
          <div className="flex h-[85vh] w-[85vw] flex-col">
            <MDEditor.Markdown
              source={result}
              className="flex grow flex-col overflow-auto rounded-md p-2"
            />
            <div className="h-4" />

            {/* <CodeReferences filesReferenced={filesReferenced} /> */}
            <div className="flex w-full gap-4">
              <Button
                disabled={saveResponse.isPending}
                className="grow"
                onClick={() =>
                  saveResponse.mutate(
                    {
                      projectId: project!.id,
                      question,
                      response: result,
                      filesReferenced,
                    },
                    {
                      onSuccess: () => {
                        toast.success("Response Saved!");
                      },
                      onError: () => {
                        toast.error("Failed to save response!");
                      },
                    },
                  )
                }
              >
                Save Response
              </Button>
              <Button
                variant={"outline"}
                type="button"
                className="grow"
                onClick={resetDialog}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Card>
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <Textarea
              placeholder="Which file should I edit to change the home page?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="h-4" />
            <Button type="submit" disabled={isLoading || question === ""}>
              Ask Athena!
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
