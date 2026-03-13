export default function Loading() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="flex justify-between items-end">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-white/5 rounded-lg" />
          <div className="h-4 w-48 bg-white/5 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-64 bg-white/5 rounded-2xl" />
        ))}
      </div>
      <div className="h-96 bg-white/5 rounded-2xl" />
    </div>
  )
}
