# Dự án Frontend

Đây là dự án frontend được xây dựng bằng React và Vite.

## Các công nghệ chính

* **React:** Một thư viện JavaScript để xây dựng giao diện người dùng.
* **Vite:** Một công cụ xây dựng thế hệ mới, cung cấp trải nghiệm phát triển cực nhanh.

## Cài đặt

Để chạy dự án này trên máy cục bộ của bạn, hãy làm theo các bước sau:

1.  **Sao chép kho lưu trữ:**
    ```bash
    cd bluemoon.frontend
    ```

2.  **Cài đặt các dependencies:**
    ```bash
    npm install
    ```

## Chạy ứng dụng

Để khởi động máy chủ phát triển, hãy chạy lệnh sau:

```bash
npm run dev
```
## Cấu trúc dự án
<pre lang="markdown">
bluemoon.frontend/
├── public/          # Chứa các tài sản tĩnh được phục vụ trực tiếp (ví dụ: robots.txt, favicon.ico)
├── src/             # Chứa mã nguồn chính của ứng dụng
│   ├── assets/      # Chứa các tài sản tĩnh (ví dụ: hình ảnh, phông chữ) được Vite xử lý
│   ├── components/  # Chứa các thành phần React có thể tái sử dụng
│   ├── pages/       # Chứa các thành phần React đại diện cho các trang của ứng dụng
│   ├── routes/      # Có thể chứa cấu hình định tuyến của ứng dụng
│   ├── App.css      # Các kiểu CSS toàn cục cho thành phần App
│   ├── App.jsx      # Thành phần React gốc của ứng dụng
│   ├── index.css    # Các kiểu CSS toàn cục
│   └── main.jsx     # Điểm vào chính của ứng dụng React
├── .gitignore       # Chỉ định các tệp và thư mục Git nên bỏ qua
├── .eslintrc.js     # Cấu hình ESLint cho việc linting mã JavaScript/JSX
├── index.html       # Tệp HTML gốc
├── package-lock.json# Khóa các phiên bản dependencies (cho npm)
├── package.json     # Chứa thông tin về dự án và các dependencies
├── README.md        # Tài liệu mô tả dự án (tệp này)
└── vite.config.js   # Cấu hình Vite
</pre>
