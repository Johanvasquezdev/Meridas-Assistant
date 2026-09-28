import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { MeridasLogo } from "@/components/brand/MeridasLogo";

export default function SignUpPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#151417] px-4 py-12">
      {/* Subtle, refined Crimson ambient depth - zero neon/purple orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(158,27,50,0.12),transparent_60%)] pointer-events-none" />

      {/* Header with Meridas Brand */}
      <div className="relative z-10 mb-8 flex flex-col items-center gap-2">
        <Link href="/" className="transition-opacity hover:opacity-90">
          <MeridasLogo size="md" withTagline={true} />
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-[28rem]">
        <SignUp
          fallbackRedirectUrl="/dashboard/chat"
          signInUrl="/sign-in"
          appearance={clerkAppearance}
        />
      </div>

      <div className="relative z-10 mt-8 text-center">
        <Link
          href="/"
          className="font-mono text-xs text-[#8C8A94] hover:text-[#C9A227] transition-colors"
        >
          ← Return to Operational Portal
        </Link>
      </div>
    </main>
  );
}
