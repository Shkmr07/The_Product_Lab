# Product Lab Map Project

A React + Vite project that allows users to log in with Google (via Firebase), search for routes between two locations, and view the route on a map. User authentication is persisted using cookies.

## Features

- Google authentication using Firebase
- Protected map route (`/map`) accessible only to authenticated users
- Search for routes between two locations using OpenRouteService and OpenStreetMap
- Interactive map with route display (Leaflet)
- User session stored in cookies

## Project Structure

```
.env
.gitignore
eslint.config.js
index.html
package.json
vite.config.js
public/
  vite.svg
src/
  App.jsx
  index.css
  main.jsx
  assets/
    react.svg
  components/
    ProtectedRoute.jsx
  pages/
    Login.jsx
    MapPage.jsx
  utils/
    firebase.js
```

## Getting Started

### 1. Clone the repository

```sh
git clone <your-repo-url>
cd Product_Lab
```

### 2. Install dependencies

```sh
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add your Firebase and OpenRouteService credentials:

```
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_PROJECT_ID=your_firebase_project_id
VITE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_APP_ID=your_firebase_app_id
VITE_ORS_KEY=your_openrouteservice_api_key
```

### 4. Run the development server

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. Visit `/` to log in with Google.
2. After login, you are redirected to `/map`.
3. Enter "From" and "To" locations or click on the map to select points.
4. The route, distance, and duration will be displayed on the map.

## Main Files

- [`src/App.jsx`](src/App.jsx): App routing and route protection
- [`src/pages/Login.jsx`](src/pages/Login.jsx): Google login page
- [`src/pages/MapPage.jsx`](src/pages/MapPage.jsx): Map and route search
- [`src/components/ProtectedRoute.jsx`](src/components/ProtectedRoute.jsx): Protects `/map` route
- [`src/utils/firebase.js`](src/utils/firebase.js): Firebase configuration