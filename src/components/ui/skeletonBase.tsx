import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/utils/cn'

function SkeletonBase({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { theme } = useTheme()
  return (
    <div
      data-theme={theme}
      className={cn(
        'animate-pulse data-[theme=dark]:bg-gray900/10 bg-gray100/10',
        className,
      )}
      {...props}
    />
  )
}

export { SkeletonBase }
