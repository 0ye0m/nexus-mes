'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
}

function ChartContainer({ title, children }: ChartContainerProps) {
  return (
    <div 
      className="rounded-lg p-5"
      style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
    >
      <h3 className="text-sm font-semibold mb-4" style={{ color: '#111827' }}>{title}</h3>
      {children}
    </div>
  );
}

interface ProductionTrendProps {
  data: Array<{
    date: string;
    vehiclesProduced: number;
    efficiency: number;
  }>;
}

export function ProductionTrendChart({ data }: ProductionTrendProps) {
  const chartData = data.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    produced: d.vehiclesProduced,
    efficiency: d.efficiency,
  }));

  return (
    <ChartContainer title="Production Trend (Last 7 Days)">
      <div className="h-64">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="produced" 
                stroke="#2563EB" 
                strokeWidth={2}
                name="Produced"
                dot={{ fill: '#2563EB', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="efficiency" 
                stroke="#16A34A" 
                strokeWidth={2}
                name="Efficiency %"
                dot={{ fill: '#16A34A', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">No data available</div>
        )}
      </div>
    </ChartContainer>
  );
}

interface ModelDistributionProps {
  data: Array<{ name: string; value: number }>;
}

export function VehicleModelChart({ data }: ModelDistributionProps) {
  const colors = ['#2563EB', '#16A34A', '#D97706', '#DC2626'];
  const chartData = data.map((d, i) => ({ ...d, fill: colors[i % colors.length] }));

  return (
    <ChartContainer title="Production by Vehicle Model">
      <div className="h-64">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#6B7280" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="#6B7280" fontSize={12} width={80} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">No data available</div>
        )}
      </div>
    </ChartContainer>
  );
}

interface StatusDistributionProps {
  data: Array<{ name: string; value: number }>;
}

export function ProductionStatusChart({ data }: StatusDistributionProps) {
  const colors: Record<string, string> = {
    'Completed': '#16A34A',
    'In Progress': '#2563EB',
    'Pending': '#D97706',
  };
  const chartData = data.map(d => ({ ...d, fill: colors[d.name] || '#6B7280' }));

  return (
    <ChartContainer title="Production Status Distribution">
      <div className="h-64 flex items-center justify-center">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-gray-400 text-sm">No data available</div>
        )}
      </div>
    </ChartContainer>
  );
}

interface CostBreakdownProps {
  data: { material: number; labor: number; overhead: number };
}

export function CostBreakdownChart({ data }: CostBreakdownProps) {
  const total = data.material + data.labor + data.overhead;
  const chartData = [
    { name: 'Material', value: total > 0 ? Math.round((data.material / total) * 100) : 0, fill: '#2563EB' },
    { name: 'Labor', value: total > 0 ? Math.round((data.labor / total) * 100) : 0, fill: '#16A34A' },
    { name: 'Overhead', value: total > 0 ? Math.round((data.overhead / total) * 100) : 0, fill: '#D97706' },
  ];

  return (
    <ChartContainer title="Cost Breakdown">
      <div className="h-64 flex items-center justify-center">
        {total > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value}%`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-gray-400 text-sm">No cost data available</div>
        )}
      </div>
    </ChartContainer>
  );
}
