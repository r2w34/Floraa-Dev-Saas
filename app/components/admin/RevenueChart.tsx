export function RevenueChart() {
  // Mock data - in real app, this would come from props or API
  const monthlyData = [
    { month: 'Jan', revenue: 18500 },
    { month: 'Feb', revenue: 21200 },
    { month: 'Mar', revenue: 19800 },
    { month: 'Apr', revenue: 24100 },
    { month: 'May', revenue: 22900 },
    { month: 'Jun', revenue: 26750 },
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-floraa-elements-textPrimary">
          Revenue Trend
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-accent-500 rounded-full" />
          <span className="text-sm text-floraa-elements-textSecondary">Monthly Revenue</span>
        </div>
      </div>

      <div className="space-y-4">
        {monthlyData.map((data) => (
          <div key={data.month} className="flex items-center gap-4">
            <div className="w-8 text-xs text-floraa-elements-textSecondary font-medium">
              {data.month}
            </div>
            <div className="flex-1 bg-floraa-elements-bg-depth-1 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-500 to-pink-500 rounded-full transition-all duration-500"
                style={{
                  width: `${(data.revenue / maxRevenue) * 100}%`,
                }}
              />
            </div>
            <div className="w-16 text-xs text-floraa-elements-textPrimary font-medium text-right">
              ${(data.revenue / 1000).toFixed(1)}k
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-floraa-elements-borderColor">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-floraa-elements-textSecondary">Total Revenue</p>
            <p className="text-xl font-bold text-floraa-elements-textPrimary">
              ${monthlyData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-floraa-elements-textSecondary">Growth</p>
            <p className="text-xl font-bold text-green-600">+23.5%</p>
          </div>
        </div>
      </div>
    </div>
  );
}