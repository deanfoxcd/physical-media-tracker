# 🎬 Physical Media Collection Tracker

[![Status](https://img.shields.io/badge/Status-In%20Progress-orange?style=flat-square)](https://github.com/deanfoxcd/physical-media-tracker)

A web app for tracking a physical movie and TV show collection – DVDs, Blu-Rays, 4Ks, and more. Search for titles via TMDB, add them to your collection or wishlist, and keep notes, ratings, and purchase details all in one place.

---

## 🚀 Live Demo

👉 Coming soon

---

## ✨ Features

- Search for movies and TV shows powered by TMDB
- Track owned media with format, condition, price paid, acquisition details, notes, review, and rating
- Maintain a separate wishlist, with notes that carry over when an item is moved to your collection
- Sort and filter your collection/wishlist by title, media type, and more
- Switch between grid and list views, responsive down to mobile
- Email/password authentication with password reset, backed by Firebase

---

## 🛠️ Getting Started

To run this project locally:

1. **Clone the repo**
   ```bash
   git clone https://github.com/deanfoxcd/physical-media-tracker.git
   cd physical-media-tracker
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up environment variables**
   - Copy `.env.example` to `.env.local` and fill in your Firebase project config and TMDB API key.
4. **Start the development server**
   ```bash
   npm run dev
   ```
5. Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧰 Tech Stack

- **Frontend:** Next.js (React with TypeScript, App Router and API routes), MUI
- **Backend:** Firebase (Authentication, Firestore)
- **External API:** TMDB (The Movie Database)
- **Deployment:** Vercel (coming soon)

---

## ⚠️ Known Issues

- The in-memory rate limiter on the TMDB proxy routes resets per server instance, so it isn't a hard global limit on serverless deployments

---

## ✅ To Do

- Deploy to Vercel and connect a live demo link
- Add automated tests
- Continue polishing mobile responsiveness across remaining pages
- Improve on styling and design
- Add Search function for both Collection and Wishlist
- Session timer
- Dark Mode

---

## 📬 Contact

Created by [Dean Fox](https://github.com/deanfoxcd) – feel free to reach out!

---
