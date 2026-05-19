export default function Loading() {
  return (
    <div className="min-h-screen bg-paper-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-ink-500">Loading...</p>
      </div>
    </div>
  )
}
