import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string
  description?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  id?: string
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    { className, label, description, error, size = 'md', id, ...props },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    }

    const iconSizeClasses = {
      sm: 'h-2.5 w-2.5',
      md: 'h-3 w-3',
      lg: 'h-4 w-4',
    }

    return (
      <div className="flex items-start space-x-2">
        <CheckboxPrimitive.Root
          ref={ref}
          id={id}
          className={cn(
            'peer shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
            sizeClasses[size],
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          {...props}>
          <CheckboxPrimitive.Indicator
            className={cn('flex items-center justify-center text-current')}>
            <Check className={iconSizeClasses[size]} />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {(label || description || error) && (
          <div className="grid gap-1.5 leading-none">
            {label && (
              <label
                htmlFor={id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )}
      </div>
    )
  }
)

Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
