"use client";

import * as React from "react";
import type { FieldError as RHFFieldError } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <div
      data-slot="field"
      data-orientation={orientation}
      className={cn(
        orientation === "horizontal"
          ? "flex flex-row flex-wrap items-center gap-3"
          : "flex flex-col gap-2",
        className
      )}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("flex flex-col gap-6", className)}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label data-slot="field-label" className={cn(className)} {...props} />
  );
}

function FieldDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function FieldError({
  errors,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<RHFFieldError | undefined>;
}) {
  const messages = React.useMemo(() => {
    const list =
      errors
        ?.filter(Boolean)
        .map((e) => e?.message)
        .filter((m): m is string => Boolean(m)) ?? [];
    return list;
  }, [errors]);

  if (messages.length === 0) return null;

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-destructive text-sm font-medium", className)}
      {...props}
    >
      {messages.join(" ")}
    </div>
  );
}

export { Field, FieldDescription, FieldError, FieldGroup, FieldLabel };
