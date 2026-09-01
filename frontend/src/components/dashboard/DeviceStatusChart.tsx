import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface DeviceStatusChartProps {
  online: number;
  offline: number;
}

export function DeviceStatusChart({ online, offline }: DeviceStatusChartProps) {
  const data = [
    { name: "Online", value: online },
    { name: "Offline", value: offline },
  ];
  
  const total = online + offline;

  const COLORS = ["#16a34a", "#dc2626"]; // green-600, red-600

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
        <p>No device data available</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#374151', fontWeight: 500 }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-sm font-medium text-gray-700">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
