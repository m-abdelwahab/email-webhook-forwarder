import type { HeadingProps as ReactAriaHeadingProps } from "react-aria-components";
import { Heading as ReactAriaHeading } from "react-aria-components";
import { cn, sizes } from "~/lib/utils";

export type HeadingProps = ReactAriaHeadingProps & {
  size?: keyof typeof sizes;
};

const Heading = ({
  children,
  className,
  level,
  size = "lg",
  ...props
}: HeadingProps) => {
  return (
    <ReactAriaHeading
      level={level}
      {...props}
      className={cn("font-medium text-balance", sizes[size], className)}
    >
      {children}
    </ReactAriaHeading>
  );
};

export { Heading };
