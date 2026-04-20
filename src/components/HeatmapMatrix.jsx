const HeatmapMatrix = ({ rows, columns, data }) => {
  const allValues = data.flatMap((entry) => Object.values(entry.values));
  const maxValue = Math.max(...allValues, 1);

  const colorFromIntensity = (value) => {
    const ratio = value / maxValue;
    if (ratio > 0.8) return 'bg-blue-500';
    if (ratio > 0.6) return 'bg-blue-400';
    if (ratio > 0.4) return 'bg-cyan-400';
    if (ratio > 0.2) return 'bg-teal-500';
    return 'bg-slate-700';
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[560px]">
        <div
          className="grid items-center gap-2 text-xs text-slate-400"
          style={{ gridTemplateColumns: `140px repeat(${columns.length}, minmax(70px, 1fr))` }}
        >
          <div />
          {columns.map((column) => (
            <div key={column} className="text-center">
              {column}
            </div>
          ))}

          {rows.map((row) => (
            <div key={row} className="contents">
              <div key={`${row}-label`} className="pr-2 text-right text-slate-300">
                {row}
              </div>
              {columns.map((column) => {
                const source = data.find((item) => item.row === row);
                const value = source ? source.values[column] || 0 : 0;
                return (
                  <div
                    key={`${row}-${column}`}
                    title={`${row} in ${column}: ${value} users`}
                    className={`rounded-md border border-slate-700/70 p-2 text-center text-xs font-medium text-slate-100 transition hover:scale-[1.03] ${colorFromIntensity(
                      value,
                    )}`}
                  >
                    {value}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-end gap-2 text-xs text-slate-400">
          <span>Low</span>
          <span className="size-3 rounded-sm bg-slate-700" />
          <span className="size-3 rounded-sm bg-teal-500" />
          <span className="size-3 rounded-sm bg-cyan-400" />
          <span className="size-3 rounded-sm bg-blue-400" />
          <span className="size-3 rounded-sm bg-blue-500" />
          <span>High</span>
        </div>
      </div>
    </div>
  );
};

export default HeatmapMatrix;
