export default function Loading() {
  return (
    <main
      role="status"
      className="mx-auto w-full max-w-5xl px-4 py-10"
    >
      <p className="mb-6 text-sm text-slate-500">
        Herding your notes…
      </p>
      <div aria-hidden="true" className="grid animate-pulse gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="surface h-48">
            <div className="mb-5 h-4 w-1/2 rounded bg-slate-200" />
            <div className="mb-3 h-3 rounded bg-slate-100" />
            <div className="h-3 w-3/4 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </main>
  );
}
