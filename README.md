# 🛍️ VIX Front-End Task 5 — Vue E-Commerce Product Viewer

**(Vue 3 + Vite + TypeScript + Atomic Design + FakeStore API)**

A modern and responsive single-product viewer built as part of **Virtual Internship Experience (VIX) Front-End Core Initiative — Task 5**.  
This project implements a fully functional e-commerce interface using data from **FakeStore API**, following **Atomic Design Pattern** and **UX-friendly loading states**.

---

## 📖 Table of Contents

1. [Overview](#-overview)
2. [Case Study Requirements](#-case-study-requirements)
3. [Tech Stack](#-tech-stack)
4. [Features](#-features)
5. [Preview](#-preview)
6. [Project Structure](#-project-structure)
7. [Installation](#-installation)
8. [Development Commands](#-development-commands)
9. [License](#-license)
10. [Author](#-author)

---

## 🧩 Overview

This project was created as part of the **VIX Front-End Core Initiative — Task 5**.  
In this task, participants were required to build an **e-commerce web interface** consisting of two main product pages:  
**Men’s Clothing** and **Women’s Clothing**.

The app consumes real product data from the [FakeStore API](https://fakestoreapi.com)  
and displays them in a single dynamic product view with a **Next Product button**,  
a **skeleton loader**, and **responsive layout** matching the provided [Figma design](https://www.figma.com/file/x1bkO3alpmGQFtysh9Lmn7/Task-5-Ecommerce?node-id=0%3A1).

---

## 📜 Case Study Requirements

Based on the official VIX Front-End case study:contentReference[oaicite:1]{index=1}:

1. **Fetch product data from the API**
   - Use `https://fakestoreapi.com/products`
   - Each index (1–20) contains a different product category  
     e.g. `https://fakestoreapi.com/products/1` → _men’s clothing_

2. **Display one product per page**
   - The displayed product updates each time the user clicks **Next Product**.

3. **Add a loading element (UX Loader)**
   - Must appear while waiting for API response.
   - Loader can be:
     - Spinner → [CSS Loader Tutorial](https://www.w3schools.com/howto/howto_css_loader.asp)
     - Skeleton → [Skeleton Loader Guide](https://dev.to/devggaurav/build-a-simple-card-skeleton-loader-component-using-html-and-css-3a20)

4. **Create three main pages following the Figma design**
   - **Men’s Clothing Page**
   - **Women’s Clothing Page**
   - **Unavailable Product Page**

5. **Implement responsive design**
   - Adjusted for desktop, tablet, and mobile views.

---

## ⚙️ Tech Stack

| Layer            | Tools / Frameworks                                                                                      |
| :--------------- | :------------------------------------------------------------------------------------------------------ |
| **Frontend**     | [Vue 3](https://vuejs.org/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Architecture** | Atomic Design Pattern (Atoms → Molecules → Organisms → Templates → Pages)                               |
| **Routing**      | [Vue Router](https://router.vuejs.org/)                                                                 |
| **Styling**      | CSS3, Flexbox, Grid, Media Queries                                                                      |
| **API**          | [FakeStore API](https://fakestoreapi.com/products)                                                      |
| **Loader**       | Skeleton Loader Animation                                                                               |
| **SEO**          | [`@vueuse/head`](https://vueuse.org/core/useHead/)                                                      |
| **Build Tool**   | Vite + Hot Module Replacement                                                                           |

---

## 🌟 Features

✅ Fetch and display API product data  
✅ Dynamic **Next Product** navigation  
✅ Skeleton loader while fetching  
✅ Background color adapts by category (men/women)  
✅ “Unavailable Product” screen with image and button  
✅ Responsive design for all breakpoints  
✅ Clean architecture using **Atomic Design**  
✅ Organized components & reactivity via Composition API

---

## 🖼️ Preview

| Desktop View                                              | Tablet View                                             | Mobile View                                             |
| :-------------------------------------------------------- | :------------------------------------------------------ | :------------------------------------------------------ |
| ![Desktop Screenshot](src/assets/screenshots/desktop.png) | ![Tablet Screenshot](src/assets/screenshots/tablet.png) | ![Mobile Screenshot](src/assets/screenshots/mobile.png) |

💡 **Tips:**  
Place screenshots in:  
`src/assets/screenshots/`  
Use `.png` or `.webp` for better compression.

---

## 🧱 Project Structure

```bash
src/
├── assets/                 # static assets (images, patterns, screenshots, styles)
│   ├── images/             # illustrations (sad-face, icons)
│   ├── screenshots/        # preview images for documentation
│   └── styles/             # global CSS
│
├── components/             # Atomic Design components
│   ├── atoms/              # base elements (button, text, rating circle)
│   ├── molecules/          # small groups (skeleton card, rating bar)
│   ├── organisms/          # larger blocks (OProductCard)
│   ├── templates/          # layout wrappers (TProductTemplate)
│   └── pages/              # page views (ProductPage.vue)
│
├── composables/            # reusable logic (e.g. useProduct)
├── router/                 # Vue Router setup
├── services/               # API service files (fetchProduct, fetchCount)
├── utils/                  # helper utilities (slug generator, canonical URL)
└── main.ts                 # entry point
```

🧭 Installation

1️⃣ Clone the repository
git clone https://github.com/rbnset/ecommerce-catalog.git
cd ecommerce-catalog

2️⃣ Install dependencies
npm install

3️⃣ Run development server
npm run dev

🧑‍💻 Development Commands
| Command | Description |
| :---------------- | :---------------------------------------------------------- |
| `npm run dev` | Menjalankan Vite dev server lokal |
| `npm run build` | Type-check dengan `vue-tsc -b` lalu build produksi via Vite |
| `npm run preview` | Menjalankan server preview untuk hasil build produksi |
| `npm run format` | Memformat kode dengan Prettier sesuai konfigurasi proyek |

📜 License

Licensed under the MIT License.
Free to use, modify, and distribute with proper attribution.

👤 Author

Robin Setiyawan
📧 rbn.setiyawan@gmail.com
🌐 https://www.linkedin.com/in/robin-setiyawan
