"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

type Props = {
  filesReferenced: {
    fileName: string;
    sourceCode: string;
    summary: string;
  }[];
};

export const CodeReferences = ({ filesReferenced }: Props) => {
  const [fileTab, setFileTab] = useState(filesReferenced[0]?.fileName);
  if (filesReferenced.length === 0) return null;

  return (
    <div className="max-w-[70vw]">
      <Tabs value={fileTab} onValueChange={setFileTab}>
        <div className="flex gap-2 overflow-scroll rounded-md bg-gray-200 p-1 dark:bg-gray-700">
          {filesReferenced.map((file) => (
            <button
              key={file.fileName}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted",
                {
                  "bg-primary text-primary-foreground":
                    fileTab === file.fileName,
                },
              )}
              onClick={() => setFileTab(file.fileName)}
            >
              {file.fileName}
            </button>
          ))}
        </div>
        {filesReferenced.map((file) => (
          <TabsContent
            key={file.fileName}
            value={file.fileName}
            className="max-h-[40vh] max-w-7xl overflow-scroll rounded-md"
          >
            <SyntaxHighlighter language="typescript" style={materialDark}>
              {file.sourceCode}
            </SyntaxHighlighter>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
