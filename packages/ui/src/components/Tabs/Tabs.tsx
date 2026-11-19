import "./_tabs.scss";
import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { classNames } from "../../internal/classNames";
import FormIcon from "../Form/FormIcon";

export type Tab = string | { title: string; icon?: string };
export type TabsProps = {
  tabs: Tab[];
  underline?: boolean;
  theme?: string;
  header?: ReactNode;
  addTab?: ReactNode;
  removeTab?: (tab: Tab, index: number) => ReactNode;
  onChange?: (tab: Tab) => void;
  children?: ReactNode;
};

const titleOf = (tab: Tab) => (typeof tab === "string" ? tab : tab.title);
type TabRecord = { tab: Tab; id: number; paneKey: string | null };

export default function Tabs({
  tabs,
  underline = false,
  theme = "dark",
  header,
  addTab,
  removeTab,
  onChange,
  children,
}: TabsProps) {
  const baseId = useId();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const nextId = useRef(0);
  const records = useRef<TabRecord[]>([]);
  const panes: ReactNode[] = [];
  Children.forEach(children, (child) => panes.push(child));
  const paneKeys = panes.map((pane) =>
    isValidElement(pane) && pane.key != null ? String(pane.key) : null,
  );
  const old = records.current;
  const used = new Set<number>();
  const retained = new Map<Tab, TabRecord[]>();
  const current = tabs.map((tab, index) => {
    const paneKey = paneKeys[index] ?? null;
    // A keyed pane gives otherwise identical tab labels a durable identity.
    let record =
      paneKey === null
        ? undefined
        : old.find(
            (candidate) =>
              candidate.tab === tab && candidate.paneKey === paneKey && !used.has(candidate.id),
          );
    if (!record && paneKey === null) {
      let candidates = retained.get(tab);
      if (!candidates) {
        const previous = old.filter(
          (candidate) => candidate.tab === tab && candidate.paneKey === null,
        );
        const wanted = tabs.filter(
          (candidate, candidateIndex) => candidate === tab && paneKeys[candidateIndex] == null,
        ).length;
        let excess = Math.max(0, previous.length - wanted);
        // Unkeyed duplicate strings are indistinguishable. Discard earlier
        // nonselected occurrences first, keeping the selected occurrence.
        candidates = previous.filter((candidate) => {
          if (excess && candidate.id !== selectedId) {
            excess--;
            return false;
          }
          return true;
        });
        retained.set(tab, candidates);
      }
      record = candidates.find((candidate) => !used.has(candidate.id));
    }
    record ??= { tab, id: ++nextId.current, paneKey };
    used.add(record.id);
    return record;
  });
  records.current = current;
  const selectedIndex = Math.max(
    0,
    current.findIndex((record) => record.id === selectedId),
  );
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    if (
      selectedId !== null &&
      current.length &&
      !current.some((record) => record.id === selectedId)
    ) {
      setSelectedId(current[0].id);
      buttons.current[0]?.focus();
    }
  }, [selectedId, current]);
  const select = (index: number, focus = false) => {
    const record = current[index];
    if (!record) return;
    if (record.id !== current[selectedIndex]?.id) {
      setSelectedId(record.id);
      onChange?.(record.tab);
    }
    if (focus) buttons.current[index]?.focus();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    switch (event.key) {
      case "ArrowRight":
        next = (index + 1) % tabs.length;
        break;
      case "ArrowLeft":
        next = (index - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = tabs.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    select(next, true);
  };

  return (
    <div
      className={classNames({
        tabs: true,
        "tabs-underlined": underline,
        [`tabs-${theme}`]: true,
      })}
    >
      {header && <div className="tabs-head">{header}</div>}
      <div className="tabs-nav" role="tablist">
        {addTab}
        {current.map(({ tab, id }, index) => (
          <div key={id} className="tabs-nav-item">
            <button
              type="button"
              ref={(node) => {
                buttons.current[index] = node;
              }}
              role="tab"
              id={`${baseId}-tab-${id}`}
              aria-controls={`${baseId}-panel-${id}`}
              aria-selected={index === selectedIndex}
              tabIndex={index === selectedIndex ? 0 : -1}
              className={index === selectedIndex ? "btn active" : "btn"}
              onClick={() => select(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              {typeof tab !== "string" && tab.icon && <FormIcon icon={tab.icon} />}
              {titleOf(tab)}
            </button>
            {removeTab?.(tab, index)}
          </div>
        ))}
      </div>
      {current.length > 0 && (
        <div className="tabs-body">
          <div
            role="tabpanel"
            tabIndex={0}
            id={`${baseId}-panel-${current[selectedIndex].id}`}
            aria-labelledby={`${baseId}-tab-${current[selectedIndex].id}`}
            className={`tabs-pane tabs-pane-${selectedIndex + 1}`}
          >
            {panes[selectedIndex]}
          </div>
        </div>
      )}
    </div>
  );
}
