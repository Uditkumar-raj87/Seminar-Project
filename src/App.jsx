import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import {
  Brain,
  Clock3,
  MoonStar,
  ShieldAlert,
} from 'lucide-react';
import ChartCard from './components/ChartCard';
import FilterBar from './components/FilterBar';
import HeatmapMatrix from './components/HeatmapMatrix';
import KpiCard from './components/KpiCard';
import {
  digitalLifeData,
  filterOptions,
  productivityOrder,
  screenBins,
  sleepQualityOrder,
} from './data/digitalLifeData';

const productivityColors = {
  High: '#3b82f6',
  Medium: '#fb923c',
  Low: '#f87171',
};

const genderColors = {
  Male: '#60a5fa',
  Female: '#f472b6',
  'Non-binary': '#2dd4bf',
};

const sleepQualityColors = {
  Good: '#3b82f6',
  Average: '#fb923c',
  Poor: '#f87171',
};

const formatNumber = (value) => Number(value).toFixed(2);

const getScreenBin = (screenTime) => {
  if (screenTime < 3) return '0-3h';
  if (screenTime < 5) return '3-5h';
  if (screenTime < 7) return '5-7h';
  if (screenTime < 9) return '7-9h';
  if (screenTime < 11) return '9-11h';
  return '11h+';
};

const tooltipStyle = {
  background: 'rgba(15, 23, 42, 0.92)',
  border: '1px solid rgba(148, 163, 184, 0.25)',
  borderRadius: '10px',
  color: '#f8fafc',
};

const App = () => {
  const [filters, setFilters] = useState({
    gender: 'All',
    ageGroup: 'All',
    profession: 'All',
  });
  const [splitByGender, setSplitByGender] = useState(false);

  const filteredData = useMemo(() => {
    return digitalLifeData.filter((record) => {
      const genderPass = filters.gender === 'All' || record.Gender === filters.gender;
      const agePass = filters.ageGroup === 'All' || record.Age_Group === filters.ageGroup;
      const professionPass =
        filters.profession === 'All' || record.Profession_Type === filters.profession;

      return genderPass && agePass && professionPass;
    });
  }, [filters]);

  const kpi = useMemo(() => {
    const total = filteredData.length || 1;

    const averageScreenTime =
      filteredData.reduce((sum, item) => sum + item.Daily_Screen_Time, 0) / total;
    const averageSleepHours = filteredData.reduce((sum, item) => sum + item.Sleep_Hours, 0) / total;
    const averageStressLevel = filteredData.reduce((sum, item) => sum + item.Stress_Level, 0) / total;
    const averageProductivity =
      filteredData.reduce((sum, item) => sum + item.Productivity_Level, 0) / total;

    return {
      averageScreenTime,
      averageSleepHours,
      averageStressLevel,
      averageProductivity,
    };
  }, [filteredData]);

  const lineChartModel = useMemo(() => {
    const grouped = screenBins.map((bin) => ({ bin }));
    const series = [];

    if (!splitByGender) {
      productivityOrder.forEach((level) => {
        series.push({ key: level, label: level, color: productivityColors[level] });
      });
    } else {
      const gendersInData =
        filters.gender === 'All' ? filterOptions.gender : [filters.gender];
      gendersInData.forEach((gender) => {
        productivityOrder.forEach((level) => {
          const key = `${level}_${gender.replace(/[^a-z]/gi, '')}`;
          const baseColor = productivityColors[level];
          series.push({ key, label: `${level} (${gender})`, color: baseColor, gender });
        });
      });
    }

    grouped.forEach((binRow) => {
      series.forEach((s) => {
        binRow[s.key] = 0;
      });
    });

    filteredData.forEach((record) => {
      const bin = getScreenBin(record.Daily_Screen_Time);
      const row = grouped.find((item) => item.bin === bin);
      if (!row) return;

      if (!splitByGender) {
        row[record.Productivity_Band] += 1;
      } else {
        const key = `${record.Productivity_Band}_${record.Gender.replace(/[^a-z]/gi, '')}`;
        row[key] += 1;
      }
    });

    return { data: grouped, series };
  }, [filteredData, splitByGender, filters.gender]);

  const scatterData = useMemo(
    () =>
      filteredData.map((record) => ({
        x: record.Daily_Screen_Time,
        y: record.Sleep_Hours,
        z: record.Stress_Level,
        gender: record.Gender,
      })),
    [filteredData],
  );

  const scatterSeries = useMemo(() => {
    const allowedGenders = ['Male', 'Female'];
    const gendersInData =
      filters.gender === 'All'
        ? allowedGenders
        : allowedGenders.includes(filters.gender)
          ? [filters.gender]
          : [];

    return gendersInData.map((gender) => ({
      gender,
      color: genderColors[gender],
      data: scatterData.filter((item) => item.gender === gender),
    }));
  }, [scatterData, filters.gender]);

  const stressByAgeData = useMemo(() => {
    return filterOptions.ageGroup.map((ageGroup) => {
      const source = filteredData.filter((item) => item.Age_Group === ageGroup);
      const total = source.length || 1;
      const avgStress = source.reduce((sum, item) => sum + item.Stress_Level, 0) / total;
      return {
        ageGroup,
        stress: Number(avgStress.toFixed(2)),
      };
    });
  }, [filteredData]);

  const eyeStrainStackedData = useMemo(() => {
    const result = [];

    filterOptions.ageGroup.forEach((ageGroup) => {
      ['Yes', 'No'].forEach((eyeStrain) => {
        const source = filteredData.filter(
          (item) => item.Age_Group === ageGroup && item.Eye_Strain === eyeStrain,
        );
        const total = source.length || 1;
        const row = {
          group: `${ageGroup} ${eyeStrain}`,
          ageGroup,
          eyeStrain,
        };

        sleepQualityOrder.forEach((quality) => {
          const count = source.filter((item) => item.Sleep_Quality === quality).length;
          row[quality] = Number(((count / total) * 100).toFixed(2));
        });

        result.push(row);
      });
    });

    return result;
  }, [filteredData]);

  const heatmapData = useMemo(() => {
    const result = productivityOrder.map((band) => {
      const values = {};
      screenBins.forEach((bin) => {
        values[bin] = 0;
      });
      return { row: band, values };
    });

    filteredData.forEach((record) => {
      const row = result.find((item) => item.row === record.Productivity_Band);
      const bin = getScreenBin(record.Daily_Screen_Time);
      if (!row) return;
      row.values[bin] += 1;
    });

    return result;
  }, [filteredData]);

  const professionComparisons = useMemo(() => {
    return filterOptions.profession.map((profession) => {
      const source = filteredData.filter((item) => item.Profession_Type === profession);
      const total = source.length || 1;

      const averageScreenTime = source.reduce((sum, item) => sum + item.Daily_Screen_Time, 0) / total;
      const averageSocialMedia = source.reduce((sum, item) => sum + item.Social_Media_Time, 0) / total;
      const averageSleepHours = source.reduce((sum, item) => sum + item.Sleep_Hours, 0) / total;
      const averageProductivity =
        source.reduce((sum, item) => sum + item.Productivity_Level, 0) / total;

      return {
        profession,
        screenTime: Number(averageScreenTime.toFixed(2)),
        socialMedia: Number(averageSocialMedia.toFixed(2)),
        sleepHours: Number(averageSleepHours.toFixed(2)),
        productivity: Number(averageProductivity.toFixed(2)),
      };
    });
  }, [filteredData]);

  return (
    <div className="dashboard-shell">
      <header className="fade-up mb-6 rounded-2xl border border-slate-700/70 bg-gradient-to-r from-slate-900/80 via-slate-800/50 to-slate-900/80 p-5 sm:p-7">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-50 sm:text-4xl">
          Digital Life Impact Dashboard
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">
          Analyzing Screen Time, Sleep, Stress, and Productivity
        </p>
      </header>

      <FilterBar
        filters={filters}
        options={filterOptions}
        onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
        splitByGender={splitByGender}
        onToggleSplit={() => setSplitByGender((current) => !current)}
      />

      <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Clock3}
          label="Average Daily Screen Time"
          value={kpi.averageScreenTime}
          formatter={(value) => `${formatNumber(value)} h`}
          tone="blue"
        />
        <KpiCard
          icon={MoonStar}
          label="Average Sleep Hours"
          value={kpi.averageSleepHours}
          formatter={(value) => `${formatNumber(value)} h`}
          tone="teal"
        />
        <KpiCard
          icon={ShieldAlert}
          label="Average Stress Level"
          value={kpi.averageStressLevel}
          formatter={(value) => `${formatNumber(value)} / 10`}
          tone="red"
        />
        <KpiCard
          icon={Brain}
          label="Average Productivity Level"
          value={kpi.averageProductivity}
          formatter={(value) => `${formatNumber(value)} / 10`}
          tone="orange"
        />
      </section>

      <section className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard
          title="Screen Time vs Productivity Trends"
          subtitle="User count across screen-time bins segmented by productivity levels"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartModel.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="bin" stroke="#cbd5e1" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                <YAxis stroke="#cbd5e1" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                {lineChartModel.series.map((series) => (
                  <Line
                    key={series.key}
                    type="monotone"
                    dataKey={series.key}
                    stroke={series.color}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    name={series.label}
                    strokeDasharray={
                      splitByGender && series.gender === 'Female'
                        ? '4 2'
                        : splitByGender && series.gender === 'Non-binary'
                          ? '3 3'
                          : undefined
                    }
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Screen Time vs Sleep Hours"
          subtitle="Bubble size represents stress level, color indicates gender"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 15, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.45} />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Daily Screen Time"
                  unit="h"
                  stroke="#cbd5e1"
                  tick={{ fill: '#cbd5e1', fontSize: 12 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Sleep Hours"
                  unit="h"
                  stroke="#cbd5e1"
                  tick={{ fill: '#cbd5e1', fontSize: 12 }}
                />
                <ZAxis type="number" dataKey="z" range={[40, 280]} name="Stress Level" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={tooltipStyle} />
                <Legend />
                {scatterSeries.map((series) => (
                  <Scatter
                    key={series.gender}
                    name={series.gender}
                    data={series.data}
                    fill={series.color}
                    fillOpacity={0.72}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </section>

      <section className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard title="Stress Level by Age Group" subtitle="Average stress score per age segment">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stressByAgeData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.45} />
                <XAxis dataKey="ageGroup" stroke="#cbd5e1" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                <YAxis stroke="#cbd5e1" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="stress" fill="#f87171" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Eye Strain vs Sleep Quality"
          subtitle="100% stacked bars by age group and eye-strain status"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eyeStrainStackedData} margin={{ top: 10, right: 20, bottom: 35, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.45} />
                <XAxis
                  dataKey="group"
                  angle={-18}
                  textAnchor="end"
                  interval={0}
                  height={56}
                  stroke="#cbd5e1"
                  tick={{ fill: '#cbd5e1', fontSize: 11 }}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  stroke="#cbd5e1"
                  tick={{ fill: '#cbd5e1', fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={tooltipStyle}
                />
                <Legend />
                {sleepQualityOrder.map((quality) => (
                  <Bar
                    key={quality}
                    dataKey={quality}
                    stackId="sleepQuality"
                    fill={sleepQualityColors[quality]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </section>

      <section className="mt-5 grid grid-cols-1 gap-4">
        <ChartCard
          title="Screen Time vs Productivity Distribution"
          subtitle="Heatmap of user concentration by screen-time range and productivity level"
        >
          <HeatmapMatrix rows={productivityOrder} columns={screenBins} data={heatmapData} />
        </ChartCard>
      </section>

      <section className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Daily Screen Time by Profession" subtitle="Average hours per day">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={professionComparisons} margin={{ top: 10, right: 20, bottom: 55, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.45} />
                <XAxis
                  dataKey="profession"
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                  height={64}
                  stroke="#cbd5e1"
                  tick={{ fill: '#cbd5e1', fontSize: 11 }}
                />
                <YAxis stroke="#cbd5e1" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="screenTime" fill="#60a5fa" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Social Media Usage by Profession" subtitle="Average social media hours per day">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={professionComparisons} margin={{ top: 10, right: 20, bottom: 55, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.45} />
                <XAxis
                  dataKey="profession"
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                  height={64}
                  stroke="#cbd5e1"
                  tick={{ fill: '#cbd5e1', fontSize: 11 }}
                />
                <YAxis stroke="#cbd5e1" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="socialMedia" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Sleep Hours by Profession" subtitle="Average sleep duration by profession">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={professionComparisons} margin={{ top: 10, right: 20, bottom: 55, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.45} />
                <XAxis
                  dataKey="profession"
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                  height={64}
                  stroke="#cbd5e1"
                  tick={{ fill: '#cbd5e1', fontSize: 11 }}
                />
                <YAxis stroke="#cbd5e1" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="sleepHours" fill="#2dd4bf" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Productivity Level by Profession" subtitle="Average productivity score (numeric)">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={professionComparisons} margin={{ top: 10, right: 20, bottom: 55, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.45} />
                <XAxis
                  dataKey="profession"
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                  height={64}
                  stroke="#cbd5e1"
                  tick={{ fill: '#cbd5e1', fontSize: 11 }}
                />
                <YAxis stroke="#cbd5e1" tick={{ fill: '#cbd5e1', fontSize: 12 }} domain={[0, 10]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="productivity" fill="#a78bfa" radius={[8, 8, 0, 0]}>
                  {professionComparisons.map((entry) => (
                    <Cell
                      key={entry.profession}
                      fill={entry.productivity >= 7 ? '#3b82f6' : entry.productivity >= 4 ? '#fb923c' : '#f87171'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </section>
    </div>
  );
};

export default App;
