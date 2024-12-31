"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

type FormInput = {
  projectName: string;
  repoUrl: string;
  githubToken?: string;
};

const formSchema = z.object({
  projectName: z.string().min(2).max(30),

  repoUrl: z
    .string()
    .url({ message: "Invalid URL format" })
    .refine((url) => url.includes("github.com"), {
      message: "Repo URL must be from GitHub.",
    }),

  githubToken: z.string().optional(),
});

const CreatePage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      repoUrl: "",
      githubToken: "",
    },
  });

  const onSubmit = (data: FormInput) => {
    window.alert(JSON.stringify(data));
    return true;
  };

  return (
    <div className="flex h-full items-center justify-center gap-12">
      <img
        src="/undraw_github.svg"
        alt="person coding"
        className="h-56 w-auto"
      />
      <div>
        <div>
          <h1 className="text-2xl font-semibold">
            Link your GitHub Repository
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the URL of your repository to link it to Athena
          </p>
        </div>
        <div className="h-4" />
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Project Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="repoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Repo Url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="githubToken"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="GitHub Token" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional, for private repos.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Create Project
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
