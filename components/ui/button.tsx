import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 border px-4 py-2 text-sm font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-accent bg-accent text-accent-foreground hover:bg-transparent hover:text-accent-ink",
        outline:
          "border-border bg-transparent text-foreground hover:border-accent hover:text-accent-ink",
        ghost: "border-transparent bg-transparent hover:border-border",
      },
      size: {
        default: "h-10",
        icon: "h-9 w-9 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
