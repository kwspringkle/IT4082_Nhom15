
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-bluemoon-500">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">Trang không tồn tại</h1>
        <p className="text-muted-foreground mb-6">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <div className="space-x-4">
          <Button asChild>
            <Link to="/">
              Về trang chủ
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/login">
              Đăng nhập lại
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;