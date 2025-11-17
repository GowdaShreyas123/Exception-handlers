import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center gap-2 whitespace-nowrap hover:cursor-pointer',
  {
    variants: {
      variant: {
        sidebar: "justify-start",
        sidebar_active: "justify-start bg-brand-primary p-4 rounded-[18px]",
        default:
          'bg-brand-primary text-brandText-primary hover:bg-brand-primary/90',
        destructive:
          'text-error-500 hover:bg-brand-tertiary/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-brand-secondary rounded-lg text-brandText-primary hover:bg-brand-secondary/80',
        ghost: 'hover:bg-accent hover:text-brandText-primary',
        link: 'text-brandText-primary underline-offset-4 hover:underline',
        // 🌈 New gradient variant
        gradient:
          ' bg-gradient cursor-pointer text-h6 text-white rounded-xl hover:from-blue-700 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl',
      },
      size: {
        default: 'h-10 px-4 py-6',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={buttonVariants({ variant, size })}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
