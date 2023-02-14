import stream from "stream";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const resultsRouter = createTRPCRouter({  
  getAll: publicProcedure.mutation(({ ctx }) => {
    return ctx.prisma.result.findMany();
  }),
  
  publish: publicProcedure
  .input(z.object({
    gender: z.string(),
    m_1_1: z.number(),
    m_1_2: z.number(),
    m_1_3: z.number(),
    m_1_4: z.number(),
    m_1_5: z.number(),
    m_1_6: z.number(),
    m_1_7: z.number(),
    m_1_8: z.number(),
    m_1_9: z.number(),
    m_1_10: z.number(),
    m_2_1: z.number(),
    m_2_2: z.number(),
    m_2_3: z.number(),
    m_2_4: z.number(),
    m_2_5: z.number(),
    m_2_6: z.number(),
    m_2_7: z.number(),
    m_2_8: z.number(),
    m_2_9: z.number(),
    m_2_10: z.number(),
    m_2_11: z.number(),
    m_2_12: z.number(),
    m_2_13: z.number(),
    m_3_1: z.number(),
    m_3_2: z.number(),
    m_3_3: z.number(),
    m_3_4: z.number(),
    m_3_5: z.number(),
    m_4_1: z.number(),
    m_4_2: z.number(),
    m_4_3: z.number(),
    m_4_4: z.number(),
    m_4_5: z.number(),
    m_4_6: z.number(),
    m_4_7: z.number(),
    m_5_1: z.number(),
    m_5_2: z.number(),
    m_5_3: z.number(),
  }))
  .mutation(async ({input, ctx}) => {
    const response = await ctx.prisma.result.create({
      data: input
    })
    console.log(response)
    return {
      result: "Success"
    }
  })
  
});



