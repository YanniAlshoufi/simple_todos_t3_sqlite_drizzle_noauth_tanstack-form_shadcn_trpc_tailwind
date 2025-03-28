"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function Todo(props: {
  todo: {
    id: number;
    text: string;
    checked: boolean;
    sorting: number;
    createdAt: Date;
    updatedAt: Date | null;
  };
}) {
  const [checked, setChecked] = useState(props.todo.checked);
  const [isDeleting, setIsDeleting] = useState(false);

  const utils = api.useUtils();

  const updateMutation = api.todos.updateTodo.useMutation({
    onSuccess: async () => {
      await utils.todos.invalidate();
    },
  });

  const deleteMutation = api.todos.deleteTodo.useMutation({
    onSuccess: async () => {
      await utils.todos.invalidate();
    },
  });

  return (
    <li>
      <form
        className="flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setIsDeleting(true);
          await deleteMutation.mutateAsync({ id: props.todo.id });
          setIsDeleting(false);
        }}
      >
        <input
          id={`input-todo-${props.todo.id}`}
          type="checkbox"
          checked={checked}
          onChange={async () => {
            setChecked(!checked);
            await updateMutation.mutateAsync({
              id: props.todo.id,
              checked: !checked,
            });
          }}
        />
        <label
          htmlFor={`input-todo-${props.todo.id}`}
          className={`flex gap-2 [:has(span:hover)]:text-red-500 [:has(span:hover)]:italic [:has(span:hover)]:line-through ${isDeleting ? "text-red-500 italic line-through" : ""}`}
        >
          {props.todo.text}
          <button type="submit">
            <span
              className={`icon-[mingcute--delete-fill] hover:icon-[mingcute--close-fill] ${isDeleting ? "icon-[mingcute--close-fill]" : ""} cursor-pointer`}
            ></span>
          </button>
        </label>
        {isDeleting ? "(being deleted...)" : ""}
      </form>
    </li>
  );
}
