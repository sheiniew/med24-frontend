// Skeleton loader minimalista y reutilizable

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      {/* Avatar skeleton */}
      <div className="w-14 h-14 bg-gray-200 rounded-xl animate-pulse"></div>

      {/* Title skeleton */}
      <div className="mt-4 h-6 w-3/4 bg-gray-200 rounded-lg animate-pulse"></div>

      {/* Specialty skeleton */}
      <div className="mt-3 h-4 w-1/2 bg-gray-100 rounded-lg animate-pulse"></div>

      {/* Bio skeleton */}
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full bg-gray-100 rounded-lg animate-pulse"></div>
        <div className="h-3 w-5/6 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>

      {/* Footer skeleton */}
      <div className="flex items-center justify-between mt-4">
        <div className="h-3 w-20 bg-gray-100 rounded-lg animate-pulse"></div>
        <div className="h-3 w-12 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
}

export function SkeletonDoctorDetail() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header skeleton */}
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
          <div className="h-8 w-2/3 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-5 w-1/3 bg-gray-100 rounded-lg animate-pulse"></div>

          <div className="space-y-2 mt-4">
            <div className="h-4 w-full bg-gray-100 rounded-lg animate-pulse"></div>
            <div className="h-4 w-5/6 bg-gray-100 rounded-lg animate-pulse"></div>
            <div className="h-4 w-4/6 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>

          {/* Grid info skeleton */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 p-3 rounded-xl space-y-2">
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 w-3/4 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl space-y-2">
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 w-3/4 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Guides skeleton */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="h-6 w-1/3 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-2xl p-4 space-y-2">
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-full bg-gray-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonChatMessage() {
  return (
    <div className="flex gap-3 mb-3">
      <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-gray-100 rounded-lg animate-pulse"></div>
        <div className="h-4 w-5/6 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
}

export function SkeletonChatList() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
      ))}
    </div>
  );
}

export function SkeletonGridCards({ count = 6 }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonGuideItem() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-5 w-3/4 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-full bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
        <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse ml-2"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse"></div>
        <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}

export function SkeletonGuidesList() {
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <SkeletonGuideItem key={i} />
      ))}
    </div>
  );
}

export function SkeletonChatItem() {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-100 animate-pulse">
      <div className="flex-1">
        <div className="h-4 w-2/3 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-1/3 bg-gray-100 rounded"></div>
      </div>
      <div className="w-4 h-4 bg-gray-200 rounded"></div>
    </div>
  );
}

export function SkeletonChatSidebar() {
  return (
    <div className="w-80 bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="h-10 w-full bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {[...Array(8)].map((_, i) => (
          <div key={i}>
            <div className="h-12 bg-gray-100 rounded-2xl animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
