import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { insertLead, getLeads } from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  leads: router({
    submit: publicProcedure
      .input(
        z.object({
          nome: z.string().min(2, "Nome é obrigatório"),
          email: z.string().email("E-mail inválido"),
          telefone: z.string().min(8, "Telefone inválido"),
          empresa: z.string().optional().default(""),
          cargo: z.string().optional().default(""),
        })
      )
      .mutation(async ({ input }) => {
        const result = await insertLead({
          nome: input.nome,
          email: input.email,
          telefone: input.telefone,
          empresa: input.empresa || null,
          cargo: input.cargo || null,
        });
        return result;
      }),

    list: protectedProcedure.query(async () => {
      return getLeads();
    }),
  }),
});

export type AppRouter = typeof appRouter;
