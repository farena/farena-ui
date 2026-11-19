import type { ReactNode } from "react";
import { classNames } from "../../internal/classNames";
import "./_widget_counter.scss";
import FormIcon from "../Form/FormIcon";

export type WidgetCounterProps = {
  title?: string;
  description?: string;
  count?: number | string;
  moneySign?: string;
  small?: boolean;
  tooltip?: string;
  children?: ReactNode; // Rendered as a chart next to the count
};

export default function WidgetCounter({
  title,
  description,
  count,
  moneySign,
  small = false,
  tooltip,
  children,
}: WidgetCounterProps) {
  return (
    <div
      className={classNames({
        "counter-widget": true,
        "counter-widget-small": small,
      })}
    >
      <div className="counter-widget-head">
        <h6>{title}</h6>
        {tooltip && (
          <span className="counter-widget-info" tabIndex={0} aria-label={tooltip}>
            <FormIcon icon="fa fa-circle-info" />
            <span className="tooltip bottom-left counter-widget-tooltip">{tooltip}</span>
          </span>
        )}
      </div>
      <div className="counter-widget-body">
        <div>
          <h3>
            {moneySign}
            {count}
          </h3>
          {description && <p className="small m-0">{description}</p>}
        </div>

        {children && <div className="chart">{children}</div>}
      </div>
    </div>
  );
}
