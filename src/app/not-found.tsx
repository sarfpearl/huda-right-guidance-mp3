import Link from "next/link";
import { LogoIcon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-700 text-3xl text-gold-300">
        <LogoIcon />
      </span>
      <h1 className="mt-6 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-sm text-muted">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center rounded-full bg-primary-700 px-6 font-semibold text-sand-50 hover:bg-primary-600"
      >
        Back to Home
      </Link>
    </div>
  );
}
