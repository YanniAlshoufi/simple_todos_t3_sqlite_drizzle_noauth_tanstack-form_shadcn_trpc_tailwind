"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

export function AddTodo() {
  const utils = api.useUtils();

  const mutation = api.todos.create.useMutation({
    onSuccess: async () => {
      await utils.todos.invalidate();
    },
  });

  const form = useForm({
    defaultValues: {
      text: "",
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync({ text: value.text });
    },
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await form.handleSubmit();
        form.reset();
      }}
      className="flex gap-5"
    >
      <form.Field name="text">
        {(field) => (
          <div>
            <Input
              name="text"
              type="text"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.Field>
      <form.Subscribe
        selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit}>
            {isSubmitting ? "..." : "Submit"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
