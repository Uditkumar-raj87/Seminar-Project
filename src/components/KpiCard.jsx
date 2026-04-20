const KpiCard = ({ icon: Icon, label, value, tone, formatter = (v) => v }) => {
  const toneClasses = {
    blue: 'text-blue-400 bg-blue-500/15 border-blue-400/30',
    orange: 'text-orange-400 bg-orange-500/15 border-orange-400/30',
    red: 'text-red-400 bg-red-500/15 border-red-400/30',
    teal: 'text-teal-400 bg-teal-500/15 border-teal-400/30',
  };

  return (
    <article className="glass-card fade-up p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/50">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{label}</p>
        <span className={`rounded-md border p-2 ${toneClasses[tone]}`}>
          <Icon className="size-4" strokeWidth={2.2} />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold leading-none text-slate-100 sm:text-3xl">{formatter(value)}</p>
    </article>
  );
};

export default KpiCard;
