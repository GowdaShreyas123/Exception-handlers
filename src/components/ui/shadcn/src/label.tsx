import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

// 🎨 Define style variants
const labelVariants = cva(
  'font-poppins leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', // base
  {
    variants: {
      variant: {
        default: 'text-lg font-normal text-foreground',
        form: 'text-base-bold font-medium text-brandText-primary', // 🧩 your form label style
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// ⚙️ Component
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, variant, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ variant }), className)}
    {...props}
  />
));

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
