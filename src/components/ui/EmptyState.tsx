import { CompassIcon } from "./Icon";

export function EmptyState({
  title,
  hint,
  icon,
}: {
  title: string;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed surface-muted px-6 py-16 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary-50 text-2xl text-primary-600 dark:bg-primary-900/50 dark:text-primary-300">
        {icon ?? <CompassIcon />}
      </div>
      <p className="text-base font-semibold">{title}</p>
      {hint ? <p className="mt-1 max-w-xs text-sm text-muted">{hint}</p> : null}
    </div>
  );
}
