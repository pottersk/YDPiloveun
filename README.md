### ฟีเจอร์หลัก
- เรียกดูสินค้าทั้งหมดจาก FakeStoreAPI
- ดูรายละเอียดสินค้า
- กรองตามหมวดหมู่ (อิเล็กทรอนิกส์, เครื่องประดับ, เสื้อผ้า)
- หน้ากดใจและตะกร้า

## Tech Stack

### Frontend
- **Next.js 15** - Full-stack React framework พร้อม App Router
- **React 19** - UI library พร้อม modern hooks
- **TailwindCSS 4** - Utility-first CSS framework

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Fake Store API** - ข้อมูลสินค้าภายนอก

### เครื่องมือ
- **npm** - Package manager
- **ESLint** - ตรวจสอบคุณภาพโค้ด
- **Git & GitHub** - Version control
- **Vercel** - แพลตฟอร์มสำหรับ deploy

### คำสั่ง
```bash
npm run dev      # รัน development server
npm run build    # build สำหรับ production
npm start        # รัน production server
npm run lint     # ตรวจสอบคุณภาพโค้ด
```

### Endpoints
- `GET /api/products` - ดึงสินค้าทั้งหมด
- `GET /api/products/[id]` - ดึงสินค้าตาม ID

ข้อมูลทั้งหมดมาจาก [Fake Store API]