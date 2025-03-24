import type { TextProps as ReactAriaTextProps } from "react-aria-components";
import { Text as ReactAriaText } from "react-aria-components";
import { cn, sizes } from "~/lib/utils";

export type TextProps = ReactAriaTextProps & {
  size?: keyof typeof sizes;
};

const Text = ({
  children,
  className,
  size = "md",
  elementType = "p",
  ...props
}: TextProps) => {
  return (
    <ReactAriaText
      {...props}
      elementType={elementType}
      className={cn("text-pretty", sizes[size], className)}
    >
      {children}
    </ReactAriaText>
  );
};

export { Text };
