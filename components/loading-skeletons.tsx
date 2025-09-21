"use client"

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 p-4 animate-pulse">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 bg-white/20 rounded w-48 mb-2"></div>
              <div className="h-4 bg-white/20 rounded w-32"></div>
            </div>
            <div className="h-12 w-12 bg-white/20 rounded-full"></div>
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-white/20 rounded w-24"></div>
                <div className="h-5 w-5 bg-white/20 rounded"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-white/20 rounded w-full"></div>
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                <div className="h-4 bg-white/20 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function MiniWidgetSkeleton() {
  return (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-4 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 bg-white/20 rounded w-24"></div>
        <div className="h-4 bg-white/20 rounded w-16"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-white/20 rounded w-full"></div>
        <div className="h-3 bg-white/20 rounded w-3/4"></div>
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 animate-pulse">
      <div className="h-6 bg-white/20 rounded w-32 mb-4"></div>
      <div className="h-64 bg-white/10 rounded-lg flex items-end justify-around p-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="bg-white/20 rounded-t w-8" style={{ height: `${Math.random() * 100 + 50}px` }}></div>
        ))}
      </div>
    </div>
  )
}