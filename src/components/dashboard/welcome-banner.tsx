import { cn } from "@/lib/utils";

interface WelcomeBannerProps {
  name: string;
  streak?: number;
  className?: string;
}

export function WelcomeBanner({ name, streak, className }: WelcomeBannerProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white",
        className
      )}
    >
      <h1 className="text-2xl font-bold">Welcome back, {name}!</h1>
      <p className="mt-1 text-violet-100">
        {streak
          ? `You're on a ${streak}-day learning streak. Keep it up!`
          : "Start your learning journey today."}
      </p>
    </div>
  );
}
