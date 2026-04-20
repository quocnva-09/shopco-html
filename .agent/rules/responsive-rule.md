---
trigger: always_on
---

1. Quy tắc chung (PC, Android, iOS)🎨

- Độ chính xác & Hiển thịFidelity: Sản phẩm thực tế phải khớp hoàn toàn với bản thiết kế (PSD/Figma) về: font chữ, padding, margin, căn chỉnh, hình ảnh và hiển thị.
- Asset Management: Hình ảnh phải luôn có đầy đủ thuộc tính alt và title.
- Responsive Image: Ngăn chặn vỡ khung hình bằng CSS:CSSimg {
  max-width: 100%;
  height: auto;
  }
- Cấu trúc Code & Hiệu suấtReusability: Các thuộc tính giống nhau (text, link, title...) phải được tách thành các Class riêng (Utility classes) hoặc sử dụng BEM naming convention.
- Clean HTML: Khai báo đúng DOCTYPE, các thẻ trong <head> cần tinh gọn, tránh dư thừa.
- JS Optimization: Chỉ gọi file JS ở những trang thực sự cần thiết để tối ưu tốc độ load.
- Cache Control: Khi release hoặc update, thêm query string (ngày tháng) sau file CSS/JS.Ví dụ: <link href="css/style.css?20260420" rel="stylesheet">
- Bảo mật & Chống CopyUser Experience Protection:
  Disable chuột phải: oncontextmenu="return false;"
  Disable kéo thả ảnh: ondragstart="return false;" ondrop="return false;"Anti-Print:CSS@media print {
  html, body { display: none !important; }
  }

2. Tiêu chuẩn dành cho Smartphone (Android & iOS)

- Layout & Đơn vịFluid Layout: Không sử dụng giá trị tuyệt đối (px) cho thuộc tính width. Bắt buộc dùng đơn vị phần trăm % để co giãn theo màn hình.
- CSS3 Over Images: Ưu tiên sử dụng CSS3 (gradients, shadows, border-radius) thay cho hình ảnh cho các thành phần như Title, Button để tăng tốc độ tải.
- Screen Orientation (Xoay màn hình):Layout phải giãn theo chiều ngang.Không tự động zoom màn hình. Hình ảnh và nút bấm giữ nguyên kích thước tỉ lệ.
- Typography (Đơn vị REM)Thiết lập hệ thống font-size theo chuẩn $1rem = 10px$ để đồng nhất hiển thị trên mọi trình duyệt:CSShtml {
  font-size: 62.5%; /_ Quy đổi 16px mặc định về 10px _/
  }

body {
font-size: 1.4rem; /_ Tương đương 14px _/
} 3. Tối ưu hóa theo Hệ điều hành

- Phân loại thiết bị (Device Detection)Sử dụng Script để thêm class vào body giúp viết CSS riêng cho từng OS:JavaScriptif(/Android/.test(window.navigator.userAgent)){
  document.getElementsByTagName("body")[0].setAttribute("class","and");
  }
- Đặc thù iOSText Zoom Fix: Chặn trường hợp text bị tự động phóng to trên iPhone.CSSbody { -webkit-text-size-adjust: 100%; }
  Bold Text Stroke: Fix lỗi hiển thị chữ đậm trên iOS:CSS.text_bold {
  -webkit-text-stroke-width: 0.5px;
  -webkit-text-stroke-color: #626262;
  -webkit-text-fill-color: #626262;
  color: #626262;
  }
- Đặc thù AndroidFont Weight: Đảm bảo chữ đậm hiển thị rõ ràng bằng font-weight: bold;.4. Khả năng tương thích trình duyệt (Browser Compatibility)Sử dụng đầy đủ vendor prefixes cho các thuộc tính CSS3 (Transition, Box-shadow,...) để hỗ trợ Firefox, Chrome, Safari và Opera.Ví dụ:CSS.card {
  -webkit-box-shadow: 0px 1px 2px rgb(51, 51, 51);
  -moz-box-shadow: 0px 1px 2px rgb(51, 51, 51);
  -o-box-shadow: 0px 1px 2px rgb(51, 51, 51);
  box-shadow: 0px 1px 2px rgb(51, 51, 51);
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  transition: all 0.3s ease;
  }
