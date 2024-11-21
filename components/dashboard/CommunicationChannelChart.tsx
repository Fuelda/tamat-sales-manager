import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Company } from "@/types/company";

type CommunicationChannelChartProps = {
  companies: Company[] | null;
  channelOptions: { id: number; name: string | null }[];
};

export function CommunicationChannelChart({
  companies,
  channelOptions,
}: CommunicationChannelChartProps) {
  const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#6b7280"];

  const getChannelData = () => {
    if (!companies) return [];

    const channelCounts = companies.reduce((acc, company) => {
      const channel = company.communication_channel || "未設定";
      acc[channel] = (acc[channel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(channelCounts)
      .map(([id, value]) => {
        const channelName =
          channelOptions.find((opt) => opt.name === id)?.name || "未設定";

        return {
          name: channelName,
          value,
        };
      })
      .sort((a, b) => b.value - a.value);
  };

  return (
    <div className="mt-8">
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={getChannelData()}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {getChannelData().map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
