"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useProject from "@/hooks/use-project";
import React, { useState } from "react";

const AskQuestionCard = () => {
  const { selectedProjectId } = useProject();
  const [question, setQuestion] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.alert(question);
  };

  return (
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
          <Button type="submit">Ask Athena!</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AskQuestionCard;
