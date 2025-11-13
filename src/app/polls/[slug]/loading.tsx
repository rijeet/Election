export default function LoadingPoll() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 animate-pulse">
      <div className="h-8 w-64 rounded bg-gray-200" />
      <div className="mt-4 h-4 w-40 rounded bg-gray-200" />
      <div className="mt-8 space-y-4">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="h-6 w-3/4 rounded bg-gray-200" />
            <div className="mt-4 space-y-3">
              {[...Array(3)].map((__, optionIdx) => (
                <div key={optionIdx} className="h-10 rounded-xl bg-gray-100" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


