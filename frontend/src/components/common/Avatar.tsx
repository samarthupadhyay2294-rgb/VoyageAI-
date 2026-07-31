import { clsx } from 'clsx'

interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  ring?: boolean
  onClick?: () => void
  showBadge?: boolean
  badgeColor?: string
}

export default function Avatar({
  src,
  alt,
  name,
  size = 'md',
  className,
  ring = true,
  onClick,
  showBadge = false,
  badgeColor = 'bg-emerald-500',
}: AvatarProps) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'AV'

  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base font-semibold',
    xl: 'h-20 w-20 text-xl font-bold',
  }

  return (
    <div
      onClick={onClick}
      className={clsx(
        'relative inline-block flex-shrink-0 group',
        onClick && 'cursor-pointer transition-transform duration-200 hover:scale-105'
      )}
    >
      <div
        className={clsx(
          'rounded-full flex items-center justify-center font-medium overflow-hidden transition-all duration-300 shadow-md',
          ring && 'ring-2 ring-indigo-500/40 ring-offset-2 ring-offset-slate-950',
          sizeClasses[size],
          className
        )}
        style={{
          background: src ? 'transparent' : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          color: '#ffffff',
        }}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="h-full w-full object-cover rounded-full"
            onError={(e) => {
              // Fallback to initial text on error
              ;(e.target as HTMLElement).style.display = 'none'
            }}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {showBadge && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-slate-950',
            badgeColor,
            size === 'xs' || size === 'sm' ? 'h-2 w-2' : 'h-3.5 w-3.5'
          )}
        />
      )}
    </div>
  )
}
