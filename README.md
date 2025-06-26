# 🧵 Handmade Marketplace (Desi Etsy) — MERN Stack Project

A full-stack niche e-commerce platform that empowers local artisans to showcase and sell their handmade products. Designed with a mission to uplift rural creators, this marketplace supports artisan registration, product listings, secure payment integration, role-based dashboards, and admin approval flows.

---

## 🚀 Features

### 👥 User & Artisan

- User & Artisan Authentication (JWT based)
- Artisan dashboard to manage products
- Product listings with smart filters (category, price, popularity)
- Add to Cart, Checkout, and Order History
- Razorpay payment integration with PDF invoices
- Wishlist and Recently Viewed Items
- Product reviews & ratings system

### 🧑‍💼 Admin

- Role-Based Access Control (RBAC): User, Artisan, Admin
- Admin Panel for:
  - Artisan verification
  - Product approval workflow
  - Order monitoring
  - Data visualizations (sales trends, top products)

### 📈 Business & UX Enhancements

- SEO-ready with metadata & Open Graph tags
- Progressive Web App (PWA) support (offline catalog browsing)
- Mobile Responsive Design
- Real-time order status updates (via WebSockets)
- Multi-language Support (English & Hindi toggle)
- Invoice generation (PDF) on successful payment
- Coupon/discount code system (admin-generated)

---

## 🛠 Tech Stack

| Tech     | Role                        |
|----------|-----------------------------|
| React.js + TailwindCSS | Frontend UI (SPA)               |
| Node.js + Express      | Backend API server              |
| MongoDB + Mongoose     | NoSQL database and modeling     |
| Razorpay API           | Payment gateway                 |
| JWT, bcryptjs          | Authentication & security       |
| Chart.js               | Admin analytics dashboards      |
| PDFKit                 | PDF invoice generation          |

---

## 🗂️ Folder Structure

```
handmade-marketplace_mern/
│
├── desi-etsy-frontend/     → React app (Tailwind + routing)
│   ├── components/
│   ├── pages/
│   └── utils/
│
├── desi-etsy-backend/      → Node/Express app
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── middleware/
│
├── .gitignore
├── README.md
└── package.json
```

---

## 📷 Screenshots

> Add screenshots/GIFs of key dashboards here for visual appeal!

---

## 🧠 Project Motivation

This project was designed to:
- Empower grassroots artisans through digital access
- Simulate real-world full-stack product development
- Integrate role-based workflows, payment systems & admin logic

---

## ✅ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sandeepbehera21/handmade-marketplace_mern.git
cd handmade-marketplace_mern
```

### 2. Install frontend & backend dependencies

```bash
cd desi-etsy-frontend
npm install
cd ../desi-etsy-backend
npm install
```

### 3. Add your `.env` file

```
PORT=5000
MONGO_URI=your_mongo_connection
JWT_SECRET=your_secret
RAZORPAY_KEY_ID=your_id
RAZORPAY_KEY_SECRET=your_secret
```

### 4. Run the project

```bash
# In desi-etsy-backend
npm run dev

# In desi-etsy-frontend
npm start
```

---

## 🧪 Upcoming Improvements

- CI/CD with GitHub Actions & Vercel
- Email Notifications for order updates
- Firebase for chat support between artisans & buyers
- Elastic search for fuzzy product search

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

This platform is part of a startup-focused learning series, built to simulate real-world marketplaces and empower tech-for-good solutions.

---

> Made with 💻 by [@sandeepbehera21](https://github.com/sandeepbehera21)
