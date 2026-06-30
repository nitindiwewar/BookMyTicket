import { cx } from '../../lib/format'

export function Skeleton({ className }) {
  return <div className={cx('skeleton', className)} />
}

export function MovieCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <Skeleton className="aspect-[2/3] w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  )
}

export function MovieGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  )
}
