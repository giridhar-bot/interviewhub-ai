import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        <span className="text-[10rem] font-extrabold leading-none text-muted/50">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">🔍</span>
        </div>
      </div>
      <h1 className="text-2xl font-bold sm:text-3xl">Page Not Found</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back on track.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/">
          <Button className="bg-brand-gradient text-white">
            Go Home
          </Button>
        </Link>
        <Link href="/topics">
          <Button variant="outline">Browse Topics</Button>
        </Link>
      </div>
    </div>
  );
}
