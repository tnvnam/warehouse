# Warehouse Management App

**Trạng thái:** Đang phát triển  
**Ngày khởi tạo:** 18/05/2025

---

## 🧾 Nhật ký phát triển

### 📅 Ngày 18/05/2025
- [ ] Xây dựng chức năng **Đăng nhập**
- [ ] Load **danh sách sản phẩm**

---

### 📅 Ngày 19/05/2025
#### 1. Kết nối database (`services/connect.js`)
- [x] Định nghĩa phương thức `GET` và `POST` trong cùng file `connect.js`
- [x] Xử lý **băm mật khẩu**, **chuyển kiểu dữ liệu**, và **gửi dữ liệu đến PostgreSQL**

#### 2. Cấu trúc thư mục
- Thư mục `admin/`: chứa các trang **thêm dữ liệu vào bảng**

#### 3. Chức năng đã thêm:
- [x] Thêm **Role**
- [x] Thêm **User**
- [x] Thêm **Phòng ban**
- [x] Thêm **Đơn vị**
- [x] Thêm **Nhà cung cấp**
- [x] Thêm **Danh mục sản phẩm**
- [x] Thêm **Sản phẩm**

---

### ⚠️ Tình trạng giao diện
- Chưa có giao diện nào hoàn chỉnh.

---

## 📌 Ghi chú
- App viết bằng **React Native** + **TypeScript**
- Kết nối **PostgreSQL** thông qua API Node.js (`connect.js`)

