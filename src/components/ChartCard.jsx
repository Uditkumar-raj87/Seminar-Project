const ChartCard = ({ title, subtitle, children, className = '' }) => {
  return (
    <section
      className={`glass-card fade-up p-4 sm:p-5 transition duration-300 hover:-translate-y-0.5 hover:border-slate-500/45 ${className}`}
    >
      <header className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-slate-100 sm:text-lg">{title}</h3>
          {subtitle ? <p className="mt-1 text-xs text-slate-400 sm:text-sm">{subtitle}</p> : null}
        </div>
      </header>
      {children}
    </section>
  );
};

export default ChartCard;
