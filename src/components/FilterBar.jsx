const FilterBar = ({ filters, options, onChange, splitByGender, onToggleSplit }) => {
  const selectClasses =
    'w-full rounded-lg border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-blue-400/70 focus:ring-2 focus:ring-blue-500/25';

  return (
    <section className="glass-card fade-up p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-1">
          <span className="text-xs uppercase tracking-wide text-slate-400">Gender</span>
          <select
            className={selectClasses}
            value={filters.gender}
            onChange={(event) => onChange('gender', event.target.value)}
          >
            <option value="All">All</option>
            {options.gender.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs uppercase tracking-wide text-slate-400">Age Group</span>
          <select
            className={selectClasses}
            value={filters.ageGroup}
            onChange={(event) => onChange('ageGroup', event.target.value)}
          >
            <option value="All">All</option>
            {options.ageGroup.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs uppercase tracking-wide text-slate-400">Profession</span>
          <select
            className={selectClasses}
            value={filters.profession}
            onChange={(event) => onChange('profession', event.target.value)}
          >
            <option value="All">All</option>
            {options.profession.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-end justify-between rounded-lg border border-slate-700/80 bg-slate-900/70 p-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Line Chart Mode</p>
            <p className="text-sm text-slate-200">Split trends by gender</p>
          </div>
          <button
            type="button"
            onClick={onToggleSplit}
            className={`relative h-7 w-12 rounded-full transition ${
              splitByGender ? 'bg-blue-500/80' : 'bg-slate-700'
            }`}
            aria-label="Toggle gender split"
          >
            <span
              className={`absolute top-1 size-5 rounded-full bg-white transition ${
                splitByGender ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </label>
      </div>
    </section>
  );
};

export default FilterBar;
