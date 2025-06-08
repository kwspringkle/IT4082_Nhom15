import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("Tổ trưởng"); // default
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Lỗi xác nhận mật khẩu",
        description: "Mật khẩu và xác nhận mật khẩu không khớp",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          fullname: fullName,
          phone: phoneNumber,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      toast({
        title: "Đăng ký thành công",
        description: "Tài khoản của bạn đã được tạo",
      });
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Lỗi đăng ký",
        description:
          error.message ||
          "Không thể kết nối với server. Vui lòng kiểm tra lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
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
          <h2 className="text-3xl font-bold mb-6">Đăng ký tài khoản</h2>
          <p className="mb-4">
            Tạo tài khoản mới để truy cập vào hệ thống quản lý chung cư BlueMoon. Sau khi đăng ký, tài khoản của bạn sẽ cần được quản trị viên phê duyệt.
          </p>
          <ul className="space-y-2">
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
              <span>Theo dõi và quản lý các khoản phí</span>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-bluemoon-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Xem báo cáo và thống kê</span>
            </li>
          </ul>
        </div>
        <div className="mt-8 text-sm text-bluemoon-100">
          <p>© 2025 Chung cư BlueMoon</p>
          <p>Địa chỉ: Ngã tư Văn Phú</p>
        </div>
      </div>
      <div className="md:w-3/5 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Đăng ký tài khoản</h2>
            <p className="text-muted-foreground mt-2">
              Nhập thông tin để tạo tài khoản mới
            </p>
          </div>
          <form onSubmit={handleRegister} className="space-y-4">
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
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Nhập họ và tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Nhập số điện thoại"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Bạn là</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="Tổ trưởng"
                    checked={role === "Tổ trưởng"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Tổ trưởng
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="Kế toán"
                    checked={role === "Kế toán"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Kế toán
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bluemoon-gradient"
              disabled={isLoading}
            >
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
                <UserPlus className="h-5 w-5 mr-2" />
              )}
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>

            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="text-bluemoon-600 hover:underline"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
