import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, LabelHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-colors";

interface FieldProps {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & FieldProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(fieldBase, error ? "border-red-400" : "border-gray-300", className)}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(fieldBase, "min-h-[100px] resize-y", error ? "border-red-400" : "border-gray-300", className)}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & FieldProps>(
  ({ className, error, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(fieldBase, error ? "border-red-400" : "border-gray-300", className)}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-sm font-medium text-gray-700", className)} {...props} />;
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}
