import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Home,
  Users,
  Wallet,
  CircleCheck,
  FileText,
  CreditCard,
  Settings,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();

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

  const navigationCards = [
    {
      title: "Quản lý hộ khẩu",
      description: "Xem và quản lý thông tin các hộ khẩu",
      icon: Home,
      path: "/households",
      color: "bg-blue-500",
    },
    {
      title: "Quản lý nhân khẩu",
      description: "Xem và quản lý thông tin cư dân",
      icon: Users,
      path: "/residents",
      color: "bg-green-500",
    },
    {
      title: "Quản lý thu phí",
      description: "Thiết lập và quản lý các khoản phí",
      icon: CreditCard,
      path: "/fees",
      color: "bg-purple-500",
    },
    {
      title: "Thanh toán",
      description: "Theo dõi tình trạng thanh toán",
      icon: Wallet,
      path: "/payments",
      color: "bg-orange-500",
    },
    {
      title: "Báo cáo & Thống kê",
      description: "Xem báo cáo và phân tích dữ liệu",
      icon: BarChart3,
      path: "/reports",
      color: "bg-indigo-500",
    },
    {
      title: "Quản lý người dùng",
      description: "Quản lý tài khoản và phân quyền",
      icon: Settings,
      path: "/users",
      color: "bg-red-500",
    },
  ];

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

      <div>
        <h2 className="text-2xl font-bold mb-4">Truy cập nhanh</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {navigationCards.map((card, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`${card.color} p-2 rounded-lg text-white`}>
                    <card.icon className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(card.path)}
                >
                  Truy cập
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
