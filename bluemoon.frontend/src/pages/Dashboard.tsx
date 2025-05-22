import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CircleOff,
  Home,
  Users,
  Wallet,
  CircleCheck,
  CircleDollarSign,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Dashboard = () => {
  // Mock data
  const paymentStatus = [
    { name: "Đã thu", value: 68, color: "#4ade80" },
    { name: "Chưa thu", value: 22, color: "#f87171" },
    { name: "Trễ hạn", value: 10, color: "#facc15" },
  ];
  
  const monthlyRevenue = [
    { month: "T1", amount: 120000000 },
    { month: "T2", amount: 125000000 },
    { month: "T3", amount: 130000000 },
    { month: "T4", amount: 128000000 },
    { month: "T5", amount: 126000000 },
    { month: "T6", amount: 132000000 },
  ];

  const statCards = [
    {
      title: "Tổng số hộ khẩu",
      value: "243",
      description: "hộ khẩu đang sinh sống",
      icon: Home,
      trend: "+2 so với tháng trước",
      trendUp: true,
    },
    {
      title: "Tổng số nhân khẩu",
      value: "578",
      description: "nhân khẩu đăng ký",
      icon: Users,
      trend: "+5 so với tháng trước",
      trendUp: true,
    },
    {
      title: "Thu phí tháng này",
      value: "824,500,000",
      description: "VND đã thu",
      icon: Wallet,
      trend: "+12% so với tháng trước",
      trendUp: true,
    },
    {
      title: "Tỉ lệ thanh toán",
      value: "92%",
      description: "hộ đã thanh toán",
      icon: CircleCheck,
      trend: "+5% so với tháng trước",
      trendUp: true,
    },
  ];

  // Format the number with commas
  const formatNumber = (value: number) => {
    return value.toLocaleString("vi-VN");
  };

  // Format the value as currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Dữ liệu cập nhật: 21/05/2025
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
              <div
                className={`mt-2 text-xs ${
                  card.trendUp ? "text-green-600" : "text-red-600"
                }`}
              >
                {card.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tình trạng thanh toán phí (tháng 5/2025)</CardTitle>
            <CardDescription>
              Tỉ lệ thanh toán các khoản phí của cư dân
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {paymentStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${Number(value)}%`, "Tỉ lệ"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Thu phí 6 tháng gần đây</CardTitle>
            <CardDescription>
              Tổng số tiền thu được từ các khoản phí
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlyRevenue}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), "Doanh thu"]}
                  labelFormatter={(label) => `Tháng ${label}`}
                />
                <Legend />
                <Bar dataKey="amount" name="Doanh thu" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;