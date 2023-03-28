import React, { Children, PropsWithChildren } from "react";
import { getColumns } from "@renderer/constants";

type Props = {
  children?: React.ReactNode;
  title?: string;
};

interface CustomCSSProps extends React.CSSProperties {
  "--columns-count"?: number;
  "--column-width"?: number | string;
  "--min-container-width"?: number | string;
  "--column-gap"?: number | string;
  "--shelf-min-height"?: number | string;
}

export default function Shelf({ title, children }: Props) {
  const defaultColGap = 24;
  const width = React.useRef(0);
  const [columns, setColumns] = React.useState({
    columnsCount: -1,
    columnWidth: -1,
    minContainerWidth: -1,
    columnGap: defaultColGap,
  });
  const columnConfig = React.useMemo(() => getColumns("default"), []);
  const ref = React.useRef<HTMLDivElement>(null);
  const initMount = React.useRef(false);

  const getColumnParams = (
    width: number,
    columnConfig: {
      MINIMUM_COLUMN_WIDTH: number;
      TWO_COLUMNS_MAX_WIDTH: number;
      THREE_COLUMNS_MAX_WIDTH: number;
      FOUR_COLUMNS_MAX_WIDTH: number;
      MIN_COLUMNS_COUNT: number;
    }
  ) => {
    let temp: number;
    const params = ((width, config) =>
      width < config.TWO_COLUMNS_MAX_WIDTH
        ? 2
        : width < config.THREE_COLUMNS_MAX_WIDTH
        ? 3
        : width < config.FOUR_COLUMNS_MAX_WIDTH
        ? 4
        : Math.floor((width + defaultColGap) / (config.MINIMUM_COLUMN_WIDTH + defaultColGap)))(width, columnConfig);
    const gridGap = (temp = params) === 2 ? 12 : temp === 3 ? 18 : defaultColGap;
    return {
      columnCountMainGrid: params,
      gapMainGrid: gridGap,
      columnWidthMainGrid: Math.floor((width - (params - 1) * gridGap) / params),
    };
  };

  const updateColumns = React.useCallback(
    (newWidth: number) => {
      const params = getColumnParams(width.current, columnConfig);
      setColumns({
        columnWidth: params.columnWidthMainGrid,
        columnGap: params.gapMainGrid,
        columnsCount: Math.round((newWidth + params.gapMainGrid) / (params.columnWidthMainGrid + params.gapMainGrid)),
        minContainerWidth:
          (params.columnWidthMainGrid + params.gapMainGrid) * columnConfig.MIN_COLUMNS_COUNT - params.gapMainGrid,
      });
    },
    [columnConfig]
  );

  const onResize = React.useCallback(() => {
    if (initMount.current) {
      return;
    }
    if (ref.current) {
      updateColumns(ref.current.offsetWidth);
    }
  }, [updateColumns, ref.current, initMount.current]);

  React.useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize();
    initMount.current = false;
    return () => window.removeEventListener("resize", onResize);
  }, [onResize]);

  React.useEffect(() => {
    width.current = ref.current?.offsetWidth || 0;
  });

  return (
    <section
      className="flex flex-col mb-4 flex-auto max-w-full"
      style={
        {
          "--shelf-min-height": "300px",
          containIntrinsicSize: "var(--shelf-min-height)",
          contentVisibility: "auto",
          minWidth: "var(--min-container-width)",
        } as CustomCSSProps
      }
      ref={ref}
    >
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
      </div>
      <div
        className="auto-rows-[0] overflow-y-hidden grid-container"
        style={
          {
            "--columns-count": columns.columnsCount,
            "--column-width": `${columns.columnWidth}px`,
            "--min-container-width": `${columns.minContainerWidth}px`,
            "--column-gap": `${columns.columnGap}px`,
            gridGap: "var(--column-gap)",
            display: "grid",
            gridTemplateColumns: "repeat(var(--columns-count), minmax(0, 1fr))",
            minWidth: "var(--min-container-width)",
            gridTemplateRows: "1fr",
          } as CustomCSSProps
        }
      >
        {Array.isArray(children)
          ? children.map((child, index) => {
              if (index < columns.columnsCount) {
                return child;
              }
            })
          : children}
      </div>
    </section>
  );
}
