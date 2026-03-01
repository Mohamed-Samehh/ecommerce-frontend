<p align="center">
  <img src="https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 21" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Bootstrap-5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap 5" />
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

# 📚 WyrmHole — E-Commerce Bookstore (Frontend)

The **frontend** application for WyrmHole, a full-stack e-commerce bookstore platform built with the **MEAN** stack. This Angular 21 app provides a modern storefront for customers and a comprehensive admin dashboard — with SSR support, lazy loading, and role-based access control.

> 🔗 **Backend Repository:** [ecommerce-backend](https://github.com/Mohamed-Samehh/ecommerce-backend)

---

## ✨ Features

### 🛍️ Customer Experience
- **Browse & Explore** — Search, filter by category/author/price/rating, sort, and paginate through a curated book catalog
- **Book Details** — View cover images, author bio, categories, pricing, stock status, and community reviews
- **Shopping Cart** — Add, update quantities, and remove books with real-time stock validation
- **Checkout & Orders** — Multiple payment methods (COD & Online via Stripe), order confirmation, and full order history
- **Review System** — Rate (1–5 stars) and review purchased books; only buyers of delivered orders can leave reviews
- **User Profile** — View and update personal information
- **OTP Authentication** — Two-factor email verification for both registration and login

### 🛠️ Admin Dashboard
- **Manage Books** — Full CRUD with cover image upload, author/category assignment
- **Manage Authors** — Create and edit author profiles with bios
- **Manage Categories** — Organize the book catalog
- **Manage Orders** — View all orders, update status (processing → shipped → delivered/cancelled)
- **Manage Users** — Search, filter, create, update, and delete users with role assignment
- **Manage Reviews** — Monitor and moderate all user reviews
- **Admin Profile** — View and update admin account settings

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| **Angular 21** | Frontend framework with SSR |
| **TypeScript 5.9** | Type-safe development |
| **Bootstrap 5** | Responsive UI layout & components |
| **Font Awesome 7** | Icon library |
| **SweetAlert2** | Beautiful alert/confirmation dialogs |
| **ngx-pagination** | Client-side pagination |
| **RxJS** | Reactive data streams |
| **Angular SSR** | Server-side rendering with Express |
| **Vitest** | Unit testing framework |

---

## 📁 Project Structure

```
src/app/
├── components/              # 12 reusable UI components
│   ├── book-card/           # Book display card with rating
│   ├── book-form/           # Book create/edit form (admin)
│   ├── category-admin/      # Category management panel
│   ├── filter/              # Advanced filtering controls
│   ├── footer/              # App footer
│   ├── min-max-slider/      # Price range slider
│   ├── nav-bar/             # Navigation with cart badge
│   ├── pagenation/          # Pagination controls
│   ├── review-form/         # Review submission form
│   ├── reviews-list/        # Reviews display list
│   ├── search-bar/          # Search input component
│   └── star-rating/         # Interactive star rating
├── pages/                   # 17 route pages
│   ├── explore/             # Book catalog (home)
│   ├── book-details/        # Single book view + reviews
│   ├── cart/                # Shopping cart
│   ├── checkout/            # Order checkout
│   ├── order-history/       # User order history
│   ├── order-confirmation/  # Post-order confirmation
│   ├── login/               # Sign in (with OTP)
│   ├── register/            # Sign up (with OTP)
│   ├── profile/             # User profile
│   ├── admin/               # Admin layout wrapper
│   ├── admin-books/         # Admin: book management
│   ├── admin-authors/       # Admin: author management
│   ├── admin-orders/        # Admin: order management
│   ├── admin-users/         # Admin: user management
│   ├── admin-reviews/       # Admin: review moderation
│   ├── admin-profile/       # Admin: profile settings
│   └── not-found/           # 404 page
├── services/                # 8 API service layers
│   ├── auth/                # Authentication & token management
│   ├── book/                # Book CRUD operations
│   ├── cart/                # Cart operations
│   ├── order/               # Order management
│   ├── review/              # Review operations
│   ├── author/              # Author data
│   ├── category/            # Category data
│   └── admin-user/          # Admin user management
├── guards/                  # 4 route guards
│   ├── auth.guard.ts        # Logged-in users only
│   ├── admin.guard.ts       # Admin role only
│   ├── user.guard.ts        # Standard user role only
│   └── guest.guard.ts       # Non-authenticated only
├── interceptors/            # HTTP interceptor
│   └── auth.interceptor.ts  # JWT token injection
├── interfaces/              # 9 TypeScript interfaces
└── environments/            # API URL configuration
```

---

## 🔐 Security

- **JWT-based auth** with automatic token injection via HTTP interceptor
- **4 route guards** — `auth`, `admin`, `user`, and `guest` guards
- **Lazy-loaded routes** — All pages use `loadComponent()` for code splitting
- **Role-based UI** — Admin and user views are completely separated

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- Running [backend server](https://github.com/Mohamed-Samehh/ecommerce-backend)

### Installation

```bash
git clone https://github.com/Mohamed-Samehh/ecommerce-frontend.git
cd ecommerce-frontend
npm install
```

### Configuration

Update `src/environments/environment.ts` with your backend URL:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

### Run

```bash
# Development server
npm start

# Build for production
npm run build

# Lint
npm run lint
```

The app will be running at `http://localhost:4200`.

---

## 🌐 Deployment

Deployed on **Vercel** with Angular SSR.

- Build command: `ng build`
- Output directory: `dist/ecommerce-frontend`
- Set `apiUrl` in production environment to point to the deployed backend URL

---

## 👥 Team

- **Alaa Abdallah**
- **Andrew**
- **Mohamed Abdelhaq**
- **Mohamed Sameh**

---

## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">
  Made with ❤️ by the WyrmHole Team
</p>
