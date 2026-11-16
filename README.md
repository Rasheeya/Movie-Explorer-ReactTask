# 🎬 Stackly — Modern Movie Explorer

A modern, cinematic Movie Explorer web application built with **React**, **JavaScript (ES6+)**, **HTML5**, and **CSS3**, styled with the **JioHotstar design system & color palette**. Inspired by industry-leading streaming and discovery platforms.

---

## 🌟 Key Features

### 1. 🏠 Home Page (`/`)
- **Cinematic Hero Spotlight**: Features top highlighted movies with full-bleed backdrop art, IMDb rating badges, release years, runtimes, genres, full storyline overview, and direct actions.
- **Interactive Spotlight Switcher**: Seamlessly switch between spotlight blockbusters (e.g. *Dune: Part Two*, *Oppenheimer*, *Spider-Man: Across the Spider-Verse*).
- **Curated Movie Shelves**:
  - 🔥 **Trending This Week**
  - 📈 **Popular Blockbusters**
  - 🏆 **Top Rated Masterpieces** (IMDb 8.5+)
- **Quick Actions**: Add to favourites with one click, open official trailers, or click **"View All Movies"** to explore the entire library.

### 2. 🧭 Explore Movies (`/explore`)
- **Dynamic Catalog**: Over 30 curated blockbuster and award-winning titles across diverse genres and eras.
- **Instant Search**: Search movies by **title**, **director**, or **starring cast** in real time.
- **Genre-Based Filtering**: Filter dynamically across genres including *Action, Sci-Fi, Drama, Animation, Crime, Comedy, Adventure, Fantasy, Horror*, and more.
- **Release-Year Era Filtering**: Filter by eras (*2024 & Newer, 2020–2023, 2010–2019, 2000–2009, Classics Pre-2000*).
- **Multi-Criteria Sorting**:
  - Highest Rating
  - Lowest Rating
  - Newest Release Year
  - Oldest Release Year
  - Title Alphabetical (A – Z)
- **Clear Filters Option**: One-click reset for search query, active genre, year filter, and sorting.
- **Smart Empty State**: Informative messaging with a reset button when no titles match search criteria.

### 3. ❤️ Favourites Watchlist (`/favourites`)
- **LocalStorage Persistence**: Watchlist is saved to the browser's `localStorage` and persists across browser refreshes and sessions.
- **Live Counter Badge**: Navigation bar displays real-time count of saved favourite films.
- **Add & Remove Anywhere**: Toggle favourites effortlessly from movie cards, the hero section, or within the details modal.
- **Watchlist Analytics**: Displays total saved movies and average IMDb rating score.
- **In-Watchlist Search**: Quick search box to filter through saved favourites.
- **Clear All with Confirmation**: Safe modal dialog before clearing the entire watchlist.
- **Welcoming Empty State**: Visual illustration with a direct CTA to explore movies when no favourites are saved.

### 4. 🪟 Interactive Movie Details Modal (Optional Feature)
- **Backdrop & HD Trailer**: Play embedded official YouTube trailers directly in the modal.
- **Star Rating & Metrics**: Displays IMDb score, vote count, release date, runtime, and 4K UHD badge.
- **Credits & Personnel**: Highlights movie **Director** and **Starring Cast** chips.
- **Full Synopsis**: Uncut plot overview and tagline.
- **Accessible & Responsive**: Close via `Esc` key, background backdrop click, or the close button.

### 5. 📱 Responsive & Modern UI/UX
- **Mobile Responsive Drawer**: Smooth animated slide-in drawer menu for mobile and tablet screens.
- **Glassmorphism**: Backdrop blur headers and elevated card surfaces.
- **Hover Micro-interactions**: Smooth card lift, poster zoom, star glow, and subtle toast notifications.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | Functional components, custom hooks, and state management (`useState`, `useEffect`, `useMemo`, `useCallback`) |
| **React Router v6** | Client-side routing with `BrowserRouter`, `Routes`, `Route`, `NavLink`, and `useSearchParams` |
| **LocalStorage API** | Browser-level persistence for saved favourite movies |
| **Lucide React** | Sleek, modern vector icons |
| **Vite** | Fast development server and production bundler |
| **CSS3 & HTML5** | Modern CSS variables, flexbox, CSS grid, and responsive animations |

---

## 📁 Project Structure

```
d:\Movie Explorer\
├── index.html                  # HTML entry point with Google Fonts
├── vite.config.js              # Vite React configuration
├── package.json                # Project dependencies & scripts
├── public/
│   └── favicon.svg             # Custom Stackly star icon
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # App shell, routing, global modal & toasts
    ├── index.css               # Design system, theme variables & styles
    ├── context/
    │   └── FavouritesContext.jsx # LocalStorage sync, favourite helpers, modal state
    ├── data/
    │   └── moviesData.js       # 30+ curated movie items, genres, and sort options
    ├── components/
    │   ├── Navbar.jsx          # Glassmorphic header & responsive mobile drawer
    │   ├── Footer.jsx          # Navigation links, badges & attribution
    │   ├── HeroBanner.jsx      # Cinematic spotlight slider & quick actions
    │   ├── MovieCard.jsx       # Reusable movie card with poster, badges & fav toggle
    │   ├── MovieGrid.jsx       # Responsive auto-fill grid container & empty state
    │   ├── MovieModal.jsx      # Detailed modal with trailer, cast & director
    │   ├── FilterBar.jsx       # Real-time search, genre pills, year & sort selectors
    │   └── Toast.jsx           # Animated floating feedback toast
    └── pages/
        ├── HomePage.jsx        # Hero, Trending, Popular, Top Rated & CTA banner
        ├── ExplorePage.jsx     # Search, filter, sort & dynamic catalog grid
        └── FavouritesPage.jsx  # Watchlist grid, stats, search & empty state
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher) and npm installed.

### Development Server
To start the live local server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Production Build
To create an optimized production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```
