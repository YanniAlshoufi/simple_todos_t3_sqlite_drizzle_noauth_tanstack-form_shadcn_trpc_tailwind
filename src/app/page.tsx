"use client";

import { Card } from "~/components/ui/card";
import { api } from "~/trpc/react";
import { AddTodo } from "./_components/AddTodo";
import { Todo } from "./_components/Todo";

export default function Home() {
  const todosQuery = api.todos.getAll.useQuery();

  if (todosQuery.error) {
    console.error("error", todosQuery.error);
    return (
      <h1 className="text-3xl">
        We&apos;re sincerely sorry, something went wrong!!
      </h1>
    );
  }

  const todos = todosQuery.data;

  return (
    <div className="flex flex-col items-center gap-2 pt-50">
      <h1 className="text-3xl">Todos</h1>

      <Card className="px-9 py-6">
        {todosQuery.isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {todos!.length === 0 ? "There are no todos." : ""}
            <ol>
              {todos!.map((todo) => (
                <Todo todo={todo} key={todo.id} />
              ))}
            </ol>
          </>
        )}

        <AddTodo />
      </Card>
    </div>
  );
}
