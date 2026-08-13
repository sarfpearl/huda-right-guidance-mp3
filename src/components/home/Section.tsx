import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/Icon";

export function Section({
  title,
  titleTa,
  subtitle,
  href,
  children,
}: {
  title: string;
  titleTa?: string;
  subtitle?: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight sm:text-xl">
            {title}
            {titleTa ? (
              <span className="ml-2 text-sm font-medium text-muted">
                {titleTa}
              </span>
            ) : null}
          </h2>
          {subtitle ? (
            <p className="mt-0.5 text-sm text-muted">{subtitle}</p>
          ) : null}
        </div>
        {href ? (
          <Link
            href={href}
            className="inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold text-primary-600 hover:underline dark:text-primary-300"
          >
            See all <ChevronRightIcon className="text-base" />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
