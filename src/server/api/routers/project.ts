import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure.input(
    z.object({
      projectName: z.string(),
      githubUrl: z.string(),
      githubToken: z.string().optional(),
    })
  ).mutation(async ({ctx, input}) => {
    const project = await ctx.db.project.create({
      data: {
        name: input.projectName,
        githubUrl: input.githubUrl,
        users: {
          create: {
            userId: ctx.user.userId!,
          }
        }
      }
    })

    return project
  })
})