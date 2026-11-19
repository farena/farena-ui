export type ClassNameMap = Readonly<Record<string, boolean | null | undefined>>;

/** Joins the keys whose values are truthy, preserving insertion order. */
export function classNames(classes: ClassNameMap): string {
  return Object.entries(classes)
    .filter(([, active]) => Boolean(active))
    .map(([className]) => className)
    .join(" ");
}

export default classNames;
