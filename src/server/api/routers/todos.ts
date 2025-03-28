import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { todos } from "~/server/db/schema";

export const todosRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const todos = await ctx.db.query.todos.findMany();
    return todos;
  }),

  create: publicProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newTodoInList = await ctx.db
        .insert(todos)
        .values({
          text: input.text,
          checked: false,
          sorting: Date.now(),
        })
        .returning();

      return newTodoInList[0];
    }),

  updateTodo: publicProcedure
    .input(
      z.object({
        id: z.number(),
        text: z.string().nullish(),
        checked: z.boolean().nullish(),
        sorting: z.number().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.db.query.todos.findFirst({
        where: eq(todos.id, input.id),
      });

      if (!todo) {
        return { error: "Sorry, there is no todo with the requested ID!" };
      }

      if (input.text !== null && input.text !== undefined) {
        todo.text = input.text;
      }

      if (input.checked !== null && input.checked !== undefined) {
        todo.checked = input.checked;
      }

      if (input.sorting !== null && input.sorting !== undefined) {
        todo.sorting = input.sorting;
      }

      const res = await ctx.db
        .update(todos)
        .set(todo)
        .where(eq(todos.id, input.id))
        .returning();

      return res[0];
    }),
  deleteTodo: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const countDeleted = (
        await ctx.db.delete(todos).where(eq(todos.id, input.id))
      ).rowsAffected;

      if (countDeleted > 1) {
        console.warn("Somehow, more than one row was deleted!");
      }

      if (countDeleted < 1) {
        return { error: "Row could not be deleted!" };
      }

      return "OK";
    }),
});
