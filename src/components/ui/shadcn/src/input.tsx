import * as React from 'react';
import { cn } from '../lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.ComponentProps<'input'> {
  variant?: 'default' | 'email' | 'password';
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', variant = 'default', error, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    const baseStyles =
      'flex h-9 w-full rounded-lg font-poppins bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';

    const variants = {
      default: '',
      email: cn(
        'p-6 bg-background-elevated text-brandText-primary placeholder:text-brandText-tertiary border-background-elevated rounded-lg transition-colors',
        error
          ? 'border-red-500 focus:border-red-500'
          : 'border-gray-300 focus:border-blue-500'
      ),
      password: cn(
        'p-6 bg-background-elevated text-brandText-primary placeholder:text-brandText-tertiary border-background-elevated rounded-lg pr-12 transition-colors', // padding-right for icon
        error
          ? 'border-red-500 focus:border-red-500'
          : 'border-gray-300 focus:border-blue-500'
      ),
    };

    if (variant === 'password') {
      return (
        <div className="relative w-full">
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            ref={ref}
            className={cn(baseStyles, variants.password, className)}
            {...props}
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground focus:outline-none"
            tabIndex={-1}
          >
            {isPasswordVisible ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 30 30"
                fill="none"
              >
                <path
                  d="M15 8.75C18.45 8.75 21.25 11.55 21.25 15C21.25 15.8125 21.0875 16.575 20.8 17.2875L24.45 20.9375C26.3375 19.3625 27.825 17.325 28.7375 15C26.575 9.5125 21.2375 5.625 14.9875 5.625C13.2375 5.625 11.5625 5.9375 10.0125 6.5L12.7125 9.2C13.425 8.9125 14.1875 8.75 15 8.75ZM2.5 5.3375L5.35 8.1875L5.925 8.7625C3.83553 10.3848 2.22081 12.5392 1.25 15C3.4125 20.4875 8.75 24.375 15 24.375C16.9375 24.375 18.7875 24 20.475 23.325L21 23.85L24.6625 27.5L26.25 25.9125L4.0875 3.75L2.5 5.3375ZM9.4125 12.25L11.35 14.1875C11.2875 14.45 11.25 14.725 11.25 15C11.25 17.075 12.925 18.75 15 18.75C15.275 18.75 15.55 18.7125 15.8125 18.65L17.75 20.5875C16.9125 21 15.9875 21.25 15 21.25C11.55 21.25 8.75 18.45 8.75 15C8.75 14.0125 9 13.0875 9.4125 12.25ZM14.8 11.275L18.7375 15.2125L18.7625 15.0125C18.7625 12.9375 17.0875 11.2625 15.0125 11.2625L14.8 11.275Z"
                  className="fill-brandText-tertiary"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 30 30"
                fill="none"
              >
                <path
                  d="M15 5.625C8.75 5.625 3.4125 9.5125 1.25 15C3.4125 20.4875 8.75 24.375 15 24.375C21.25 24.375 26.5875 20.4875 28.75 15C26.5875 9.5125 21.25 5.625 15 5.625ZM15 21.25C11.55 21.25 8.75 18.45 8.75 15C8.75 11.55 11.55 8.75 15 8.75C18.45 8.75 21.25 11.55 21.25 15C21.25 18.45 18.45 21.25 15 21.25ZM15 11.25C12.925 11.25 11.25 12.925 11.25 15C11.25 17.075 12.925 18.75 15 18.75C17.075 18.75 18.75 17.075 18.75 15C18.75 12.925 17.075 11.25 15 11.25Z"
                  className="fill-brandText-tertiary"
                />
              </svg>
            )}
          </button>
        </div>
      );
    }

    // Default / Email variants
    return (
      <input
        type={type}
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
export { Input };
