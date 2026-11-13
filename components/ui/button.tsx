import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[10px] border px-4 py-2 text-sm font-medium transition-[color,background-color,border-color,box-shadow] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--signal)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-accent bg-accent text-accent-foreground shadow-[0_0_26px_-8px_var(--signal)] hover:bg-transparent hover:text-accent-ink hover:shadow-[0_0_34px_-6px_var(--signal)]",
        outline:
          "border-border bg-background/40 text-foreground hover:border-accent hover:text-accent-ink hover:shadow-[0_0_26px_-10px_var(--signal)]",
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
