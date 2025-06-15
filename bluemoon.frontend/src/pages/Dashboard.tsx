import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Home,
  Users,
  Wallet,
  CircleCheck,
  CreditCard,
  Settings,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [stats, setStats] = useState({
    totalHouseholds: 0,
    totalResidents: 0,
    monthlyRevenue: 0,
    paymentRate: 0,
  });

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "";
    setRole(storedRole);

    // Gọi API lấy dữ liệu dashboard
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/statistics/dashboard");
        setStats(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy số liệu thống kê:", error);
      }
    };

    fetchStats();
  }, []);

  const isLeader = role === "Quản trị viên" || role === "Tổ phó" || role == "Tổ trưởng";
  const isAccountant = role === "Kế toán";

  const statCards = [
    {
      title: "Tổng số căn hộ",
      value: stats.totalHouseholds.toLocaleString(),
      description: "đang có sẵn",
      icon: Home,
      show: isLeader,
    },
    {
      title: "Tổng số nhân khẩu",
      value: stats.totalResidents.toLocaleString(),
      description: "nhân khẩu đăng ký",
      icon: Users,
      show: isLeader,
    },
    {
      title: "Thu phí tháng này",
      value: stats.monthlyRevenue.toLocaleString("vi-VN") + " VND",
      description: "VND đã thu",
      icon: Wallet,
      show: isAccountant,
    },
    {
      title: "Tỉ lệ thanh toán",
      value: `${Math.round(stats.paymentRate * 100)}%`,
      description: "hộ đã thanh toán",
      icon: CircleCheck,
      show: isAccountant,
    },
  ];


  const navigationCards = [
    {
      title: "Quản lý căn hộ",
      description: "Xem và quản lý thông tin các hộ khẩu",
      icon: Home,
      path: "/households",
      color: "bg-blue-500",
      show: isLeader,
    },
    {
      title: "Quản lý nhân khẩu",
      description: "Xem và quản lý thông tin cư dân",
      icon: Users,
      path: "/residents",
      color: "bg-green-500",
      show: isLeader,
    },
    {
      title: "Quản lý khoản phí",
      description: "Thiết lập và quản lý các khoản phí",
      icon: CreditCard,
      path: "/fees",
      color: "bg-purple-500",
      show: isAccountant,
    },
    {
      title: "Quản lý thu phí",
      description: "Theo dõi tình trạng thanh toán",
      icon: Wallet,
      path: "/payments",
      color: "bg-orange-500",
      show: isAccountant,
    },
    {
      title: "Báo cáo & Thống kê",
      description: "Xem báo cáo và phân tích dữ liệu",
      icon: BarChart3,
      path: "/reports",
      color: "bg-indigo-500",
      show: isLeader || isAccountant,
    },
    {
      title: "Quản lý người dùng",
      description: "Quản lý tài khoản và phân quyền",
      icon: Settings,
      path: "/users",
      color: "bg-red-500",
      show: isLeader,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
        <span className="text-sm text-muted-foreground">
          Dữ liệu cập nhật: {new Date().toLocaleDateString("vi-VN")}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.filter(card => card.show).map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Truy cập nhanh</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {navigationCards.filter(card => card.show).map((card, index) => (
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
