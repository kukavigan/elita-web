export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] skeleton" />
      <div className="mt-3.5 space-y-2">
        <div className="h-3.5 skeleton w-4/5" />
        <div className="h-3 skeleton w-1/4" />
      </div>
    </div>
  );
}
