import type { ButtonProps as BtnProps } from "react-aria-components";
import { Button as ReactAriaButton } from "react-aria-components";
import { cn } from "~/lib/utils";

const buttonSizes = {
  default: "h-9 px-4 py-3",
  sm: "h-8 px-3 text-xs",
  lg: "h-10 px-8",
  icon: "h-9 w-9",
} as const;

const buttonVariants = {
  primary: "bg-primary-solid text-white hover:bg-primary-solid-hover",
  danger: "bg-danger-solid text-white  hover:bg-danger-solid-hover",
  outline:
    "border border-muted bg-transparent hover:border-muted-hover hover:bg-muted-element-hover hover:text-muted-high-contrast data-[focus-visible]-visible:text-muted-high-contrast",
  secondary:
    "bg-primary-element text-primary-high-contrast hover:bg-primary-element-hover",
  ghost:
    "hover:bg-muted-element-hover hover:text-muted-high-contrast data-focus-visible:text-muted-high-contrast",
} as const;

export type ButtonProps = BtnProps & {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  className?: string;
};

const Button = ({
  variant = "outline",
  size = "default",
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <ReactAriaButton
      {...props}
      className={cn(
        "text-muted-base inline-flex items-center justify-center rounded-lg text-sm transition-colors",
        "data-focus-visible:ring-primary-active data-focus-visible:ring-offset-muted-app focus:outline-hidden data-focus-visible:ring-2 data-focus-visible:ring-offset-2 data-focus-visible:outline-hidden",
        "disabled:pointer-events-none disabled:opacity-50",
        "cursor-default",
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
    >
      {children}
    </ReactAriaButton>
  );
};

export { Button, buttonSizes, buttonVariants };
