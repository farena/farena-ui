import { useEffect, useMemo, useState, type ComponentType } from "react";
import type { Props } from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { BASE_OPTIONS, mergeOptions } from "./_chartDefaults";

// Props shared by every chart in this folder
export type ChartBaseProps = {
  height?: number | string;
  width?: number | string;
  options?: ApexOptions; // Raw ApexCharts options, merged over the chart defaults
};

type ChartProps = ChartBaseProps & {
  type: NonNullable<Props["type"]>;
  series: ApexOptions["series"];
  defaults?: ApexOptions; // Chart-type defaults, applied between the base and `options`
};

// Renders an empty div on the server; ApexCharts mounts on the client
export default function Chart({
  type,
  series,
  defaults,
  options,
  height = 350,
  width = "100%",
}: ChartProps) {
  const [Renderer, setRenderer] = useState<ComponentType<Props> | null>(null);
  const [loadError, setLoadError] = useState(false);
  useEffect(() => {
    let active = true;
    import("react-apexcharts")
      .then((module) => {
        if (active) setRenderer(() => module.default);
      })
      .catch(() => {
        if (active) setLoadError(true);
      });
    return () => {
      active = false;
    };
  }, []);
  const safeSeries = useMemo(() => cloneChartValue(series), [series]);
  const merged = useMemo(() => mergeOptions(BASE_OPTIONS, defaults, options), [defaults, options]);

  if (!Renderer)
    return (
      <div
        className="fui-chart-placeholder"
        style={{ height, width }}
        role={loadError ? "alert" : "status"}
      >
        {loadError ? "Unable to load chart" : "Loading chart…"}
      </div>
    );
  return (
    <Renderer type={type} series={safeSeries} options={merged} height={height} width={width} />
  );
}

function cloneChartValue<T>(value: T): T {
  if (Array.isArray(value)) return value.map(cloneChartValue) as T;
  if (value instanceof Date) return new Date(value.getTime()) as T;
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, cloneChartValue(item)]),
    ) as T;
  return value;
}
