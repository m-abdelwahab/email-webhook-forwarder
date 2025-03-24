import {
  Input as ReactAriaInput,
  type InputProps,
} from "react-aria-components";
import { cn } from "~/lib/utils";

const Input = ({ className, type = "text", ...props }: InputProps) => {
  return (
    <span
      className={cn(
        // Basic layout
        "relative block w-full",

        // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
        "before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-white before:shadow-sm",

        // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
        "dark:before:hidden",

        // Focus ring
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset sm:focus-within:after:ring-2",

        // Disabled state
        "has-data-disabled:opacity-50 has-data-disabled:before:bg-black/5 has-data-disabled:before:shadow-none",

        // Invalid state
        "has-data-invalid:before:shadow-red-500/10",
      )}
    >
      <ReactAriaInput
        type={type}
        className={cn(
          // Basic layout
          "relative block w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] transition-colors sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]",

          // Typography
          "text-muted-high-contrast placeholder:text-muted-base text-base/6 sm:text-sm/6",

          // Border
          "border-muted hover:border-muted-hover border",

          // Background color
          "dark:bg-muted-element bg-transparent",

          // Invalid state
          "data-invalid:border-danger data-invalid:hover:border-danger-hover",

          // Disabled state
          "data-disabled:border-muted/50 data-[disabled]:70",

          // Focus styles
          "focus-visible:ring-primary-active focus-visible:ring-offset-muted-app focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden",
          className,
        )}
        {...props}
      />
    </span>
  );
};

export { Input };
