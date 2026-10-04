import { Skeleton } from "@/components/ui/skeleton";

const IndexSkeleton = () => {
  return (
    <div className="min-h-screen bg-background animate-pulse">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-xl" />
              <Skeleton className="w-28 h-4 rounded-md" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Skeleton className="w-28 h-9 rounded-lg" />
              <Skeleton className="w-24 h-9 rounded-lg" />
            </div>

          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <Skeleton className="w-72 h-9 mx-auto rounded-full mb-10" />

          {/* Title */}
          <div className="space-y-4 mb-8">
            <Skeleton className="h-14 w-3/4 mx-auto rounded-lg" />
            <Skeleton className="h-14 w-2/3 mx-auto rounded-lg" />
          </div>

          {/* Subtitle */}
          <div className="space-y-3 mb-12">
            <Skeleton className="h-5 w-full max-w-2xl mx-auto" />
            <Skeleton className="h-5 w-5/6 max-w-2xl mx-auto" />
            <Skeleton className="h-5 w-4/6 max-w-2xl mx-auto" />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Skeleton className="w-full h-16 rounded-xl" />
            <Skeleton className="w-full h-16 rounded-xl" />
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-card/40 border-y border-border/40">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center space-y-3 mb-16">
            <Skeleton className="h-8 w-96 mx-auto rounded-md" />
            <Skeleton className="h-4 w-[420px] mx-auto rounded-md" />
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/50 p-8 space-y-5 bg-background/40"
              >
                <Skeleton className="w-14 h-14 rounded-xl mx-auto" />
                <Skeleton className="h-5 w-40 mx-auto rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full mx-auto" />
                  <Skeleton className="h-4 w-5/6 mx-auto" />
                  <Skeleton className="h-4 w-4/6 mx-auto" />
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">

          <div className="rounded-3xl border border-border/50 bg-card/40 p-14 space-y-6">

            <Skeleton className="h-8 w-80 mx-auto rounded-md" />
            <Skeleton className="h-4 w-[420px] mx-auto rounded-md" />

            <div className="pt-4">
              <Skeleton className="w-44 h-12 mx-auto rounded-xl" />
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          <div className="flex items-center gap-3">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="w-24 h-4 rounded" />
          </div>

          <Skeleton className="w-56 h-4 rounded" />

        </div>
      </footer>

    </div>
  );
};

export default IndexSkeleton;