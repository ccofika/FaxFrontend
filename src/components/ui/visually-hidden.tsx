import * as React from 'react'
import { cn } from '../../lib/utils'

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean
}

const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "absolute w-px h-px p-0 m-[-1px] overflow-hidden whitespace-nowrap border-0",
        className
      )}
      {...props}
    />
  )
)
VisuallyHidden.displayName = "VisuallyHidden"

export { VisuallyHidden }