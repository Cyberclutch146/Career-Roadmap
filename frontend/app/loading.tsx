import { Navbar } from '@/components/Navbar'

export default function Loading() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-16 flex">
        {/* Sidebar Skeleton */}
        <aside className="fixed left-0 top-16 bottom-0 w-72 bg-surface-container border-r border-border hidden lg:block p-6">
          <div className="w-32 h-4 bg-surface-container-highest rounded animate-pulse mb-8" />
          <div className="w-full h-8 bg-surface-container-highest rounded animate-pulse mb-4" />
          <div className="w-24 h-4 bg-surface-container-highest rounded animate-pulse mb-8" />
          <div className="w-full h-2 bg-surface-container-highest rounded animate-pulse mb-8" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-full h-10 bg-surface-container-highest rounded animate-pulse" />
            ))}
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1 lg:ml-72 p-8">
          <div className="max-w-reading mx-auto">
            <div className="w-48 h-4 bg-surface-container rounded animate-pulse mb-8" />
            <div className="w-3/4 h-10 bg-surface-container rounded animate-pulse mb-6" />
            <div className="w-full h-24 bg-surface-container rounded animate-pulse mb-12" />
            
            <div className="grid sm:grid-cols-4 gap-4 mb-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full h-24 bg-surface-container rounded-xl animate-pulse" />
              ))}
            </div>

            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-full h-32 bg-surface-container rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
