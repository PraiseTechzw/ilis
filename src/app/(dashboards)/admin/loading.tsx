export default function Loading() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="h-16 w-1/3 bg-white/5 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-white/5 rounded-2xl" />
        ))}
      </div>
      <div className="h-64 bg-white/5 rounded-2xl" />
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-8 h-96 bg-white/5 rounded-2xl" />
        <div className="xl:col-span-4 h-96 bg-white/5 rounded-2xl" />
      </div>
    </div>
  )
}
