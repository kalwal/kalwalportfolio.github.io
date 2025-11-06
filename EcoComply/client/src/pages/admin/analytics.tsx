import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Complaint } from "@shared/schema";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Analytics() {
  const { data: complaints = [] } = useQuery<Complaint[]>({
    queryKey: ['/api/complaints'],
  });

  const { data: analytics } = useQuery<{
    categoryStats: { name: string; count: number }[];
    statusStats: { name: string; count: number }[];
    monthlyTrends: { month: string; count: number }[];
    resolutionRate: number;
  }>({
    queryKey: ['/api/analytics'],
  });

  const categoryData = analytics?.categoryStats || complaints.reduce((acc, c) => {
    const existing = acc.find(item => item.name === c.category);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ name: c.category, count: 1 });
    }
    return acc;
  }, [] as { name: string; count: number }[]);

  const statusData = analytics?.statusStats || complaints.reduce((acc, c) => {
    const existing = acc.find(item => item.name === c.status);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ name: c.status.replace('_', ' '), count: 1 });
    }
    return acc;
  }, [] as { name: string; count: number }[]);

  const resolutionRate = analytics?.resolutionRate || 
    complaints.length > 0 
      ? (complaints.filter(c => c.status === 'resolved').length / complaints.length) * 100 
      : 0;

  const monthlyData = analytics?.monthlyTrends || [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 19 },
    { month: 'Mar', count: 15 },
    { month: 'Apr', count: 25 },
    { month: 'May', count: 22 },
    { month: 'Jun', count: 30 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2" data-testid="text-page-title">Analytics Dashboard</h1>
        <p className="text-muted-foreground" data-testid="text-page-description">
          Environmental compliance insights and trends
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold" data-testid="stat-resolution-rate">
              {resolutionRate.toFixed(1)}%
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              {resolutionRate >= 70 ? (
                <><TrendingUp className="w-3 h-3 text-green-600" /> Good performance</>
              ) : (
                <><TrendingDown className="w-3 h-3 text-red-600" /> Needs improvement</>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold" data-testid="stat-total-categories">
              {categoryData.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active complaint types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold" data-testid="stat-total-analytics">
              {complaints.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All time submissions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Complaints by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" name="Complaints" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
