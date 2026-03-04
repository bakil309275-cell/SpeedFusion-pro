import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'small' | 'medium' | 'large'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, padding = 'medium', className = '', ...props }, ref) => {
    const paddingClasses = {
      none: 'p-0',
      small: 'p-4',
      medium: 'p-6',
      large: 'p-8'
    }
    
    return (
      <div
        ref={ref}
        className={`bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 ${paddingClasses[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
