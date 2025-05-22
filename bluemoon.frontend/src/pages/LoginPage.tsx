import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication - in a real app this would call an API
    setTimeout(() => {
      if (username === "admin" && password === "admin") {
        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng quay trở lại hệ thống quản lý BlueMoon",
        });
        navigate("/");
      } else {
        toast({
          title: "Đăng nhập thất bại",
          description: "Tên đăng nhập hoặc mật khẩu không chính xác",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Blue sidebar with info */}
      <div className="md:w-2/5 bg-gradient-to-br from-bluemoon-800 to-bluemoon-600 text-white p-8 md:p-12 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <span className="text-bluemoon-800 font-bold text-xl">B</span>
            </div>
            <h1 className="text-2xl font-bold">BlueMoon</h1>
          </div>
        </div>

        <div className="flex-grow flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6">Chung cư BlueMoon</h2>
          <p className="mb-4">
            Hệ thống quản lý dành cho Ban quản trị chung cư BlueMoon, giúp quản lý hiệu quả các khoản thu phí và thông tin cư dân.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-bluemoon-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Quản lý khoản thu phí dịch vụ, quản lý</span>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-bluemoon-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Quản lý thông tin hộ khẩu và nhân khẩu</span>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-bluemoon-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Theo dõi thu phí và thống kê báo cáo</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 text-sm text-bluemoon-100">
          <p>© 2025 Chung cư BlueMoon</p>
          <p>Địa chỉ: Ngã tư Văn Phú</p>
        </div>
      </div>

      {/* Login form */}
      <div className="md:w-3/5 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Đăng nhập hệ thống</h2>
            <p className="text-muted-foreground mt-2">
              Nhập thông tin đăng nhập của Ban quản trị để tiếp tục
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <a href="#" className="text-xs text-bluemoon-600 hover:underline">
                  Quên mật khẩu?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bluemoon-gradient" disabled={isLoading}>
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <LogIn className="h-5 w-5 mr-2" />
              )}
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Chưa có tài khoản?{" "}
                <Link to="/register" className="text-bluemoon-600 hover:underline">
                  Đăng ký
                </Link>
              </p>
            </div>

            <div className="text-center mt-6 text-sm text-muted-foreground">
              <p>Tài khoản demo: admin / admin</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
