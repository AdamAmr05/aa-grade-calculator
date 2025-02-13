
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow forward slash for fractions
      if (e.key === "/") {
        e.preventDefault();
        const input = e.currentTarget;
        const newValue = input.value + "/";
        input.value = newValue;
        // Trigger onChange event
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
      }
      // Call the original onKeyDown if it exists
      onKeyDown?.(e);
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        onKeyDown={handleKeyDown}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
