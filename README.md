# FlyTicket Frontend

Airline ticket reservation system - React Frontend

## 📋 Technologies

- **Framework:** React 18.2.0
- **Routing:** React Router v6.10.0
- **HTTP Client:** Axios v1.3.4
- **Styling:** CSS Grid & Flexbox
- **State Management:** React Hooks
- **Package Manager:** npm

## 🎨 Features

### User Features
- ✅ Search flights by origin, destination, and date
- ✅ View all available flights with details
- ✅ Book tickets by entering passenger information
- ✅ View booking confirmation with ticket details
- ✅ Responsive design for all devices

### Admin Features
- ✅ Secure admin login with JWT
- ✅ Create new flights
- ✅ Edit existing flights
- ✅ Delete flights
- ✅ View all booked tickets

---

## 🚀 Installation

### Requirements
- Node.js (v14 or higher)
- npm
- Backend API running on http://localhost:5000

### Steps

1. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

**Expected output:**
```
Compiled successfully!
You can now view flyticket-frontend in the browser.
Local: http://localhost:3000
```

The browser will automatically open to http://localhost:3000

---

## 📱 Pages

### 1. Home Page (/)
- Flight search form with three filters:
  - Departure city (dropdown with 81 Turkish cities)
  - Arrival city (dropdown with 81 Turkish cities)
  - Departure date (date picker)
- Search button triggers API request
- Display results as flight cards showing:
  - Route (from → to)
  - Departure and arrival times
  - Price
  - Available seats
  - Book button

### 2. Booking Page (/booking/:flightId)
- Display selected flight details
  - Route, times, price, available seats
- Passenger information form:
  - First Name (required)
  - Last Name (required)
  - Email (required, must be valid)
- Submit button to book ticket
- Error handling with user-friendly messages

### 3. Confirmation Page (/confirmation/:ticketId)
- Success badge
- Ticket details:
  - Ticket ID
  - Passenger name and email
  - Flight number
  - Route and times
  - Price
- Return to home page button

### 4. Admin Login Page (/admin-login)
- Simple login form:
  - Username input
  - Password input
- Submit button
- Test credentials displayed: admin / admin123
- Redirect to admin panel on successful login

### 5. Admin Dashboard (/admin)
- **Add Flight Section:**
  - Form to create new flight
  - Fields: Flight ID, From City, To City, Departure Time, Arrival Time, Price, Total Seats
  - Submit button
  - Clear button to cancel
  - Success/error messages

- **Flights Table:**
  - Display all flights in table format
  - Columns: Flight ID, Route, Departure, Arrival, Price, Available Seats
  - Edit button for each flight
  - Delete button for each flight
  - Delete confirmation dialog

---

## 🔐 Admin Login Credentials

```
Username: admin
Password: admin123
```

---

## 📡 API Integration

### Base URL
```
http://localhost:5000/api
```

### Key Endpoints Used

**GET /flights**
- Fetch all flights
- Used on home page

**GET /flights/search**
- Search flights by from_city, to_city, date
- Parameters: from, to, date

**POST /tickets**
- Create new ticket (book flight)
- Body: passenger_name, passenger_surname, passenger_email, flight_id

**GET /admin/login**
- Admin authentication
- Returns JWT token

**POST /flights** (Admin Only)
- Create new flight
- Requires: Authorization header with JWT token

**PUT /flights/:id** (Admin Only)
- Update flight details
- Requires: Authorization header with JWT token

**DELETE /flights/:id** (Admin Only)
- Delete flight
- Requires: Authorization header with JWT token

**GET /cities**
- Fetch all 81 Turkish cities
- Used for dropdown menus

---

## 🎨 UI/UX Design

- **Color Scheme:** Professional blue (#1e3a8a) and white
- **Layout:** Responsive grid layout with flexbox
- **Navigation:** Top navbar with links to home, admin panel, and logout
- **Forms:** Clean, intuitive form inputs with validation
- **Cards:** Flight information displayed in card format
- **Tables:** Admin panel uses table for flight management
- **Messages:** Color-coded success, error, and info messages
- **Loading:** Loading indicators during API requests

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── HomePage.js              (Flight search & list)
│   │   ├── BookingPage.js            (Book ticket form)
│   │   ├── ConfirmationPage.js       (Booking confirmation)
│   │   ├── AdminLoginPage.js         (Admin login)
│   │   └── AdminDashboard.js         (Flight management)
│   ├── App.js                        (Router & Navigation)
│   ├── index.js                      (React entry point)
│   ├── index.css                     (Global styles)
│   └── logo.svg
├── public/
│   └── index.html                    (HTML template)
├── package.json                      (Dependencies)
├── .gitignore                        (Git ignore file)
└── README.md
```

---

## 🧪 Testing

### Test the Application

1. **Start both backend and frontend**
   ```bash
   Terminal 1: cd backend && npm start
   Terminal 2: cd frontend && npm start
   ```

2. **Test User Features:**
   - Go to http://localhost:3000
   - Search for flights (Istanbul → Ankara)
   - Click "Book" button
   - Fill passenger information
   - Click "Book Ticket"
   - View confirmation page

3. **Test Admin Features:**
   - Go to http://localhost:3000/admin-login
   - Username: admin
   - Password: admin123
   - Create a new flight
   - Edit flight details
   - Delete a flight
   - View all bookings

---

## 🐛 Troubleshooting

### Backend Not Responding
```
Make sure backend is running:
cd backend
npm start

Should see: Server running on port 5000
```

### Port 3000 Already in Use
```
Kill process on port 3000
Windows: netstat -ano | findstr :3000
Then: taskkill /PID PID_NUMBER /F
```

### npm install Error
```bash
npm cache clean --force
npm install
```

### Login Not Working
```
Check if backend is running
Verify admin credentials (admin / admin123)
Check browser console for errors (F12)
```

### Flights Not Loading
```
Ensure backend /api/flights endpoint is working
Check Network tab in browser Developer Tools
Verify MongoDB is running
```

---

## 📊 Component Hierarchy

```
App
├── Navigation (Navbar)
│   ├── Home Link
│   ├── Admin Login/Panel Link
│   └── Logout Button
└── Routes
    ├── HomePage
    ├── BookingPage
    ├── ConfirmationPage
    ├── AdminLoginPage
    └── AdminDashboard
```

---

## ✅ Form Validation

### Booking Form
- First Name: Required, not empty
- Last Name: Required, not empty
- Email: Required, valid email format
- Flight: Required, must have available seats

### Admin Login
- Username: Required
- Password: Required

### Admin Flight Form
- Flight ID: Required, unique
- From City: Required, from 81 cities
- To City: Required, from 81 cities (different from from_city)
- Departure Time: Required, valid DateTime
- Arrival Time: Required, valid DateTime
- Price: Required, positive number
- Total Seats: Required, positive number

---

## 🔒 Security

- ✅ **JWT Token Storage:** Stored in localStorage
- ✅ **Protected Routes:** Admin routes require valid token
- ✅ **HTTPS Ready:** Can be deployed with HTTPS
- ✅ **Input Validation:** All forms validated on frontend
- ✅ **Backend Validation:** All data validated on server

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

Creates optimized build in `build/` folder

### Deploy to Services
- **Vercel:** Push to GitHub, connect repo
- **Netlify:** Drag & drop build folder
- **GitHub Pages:** Run `npm install gh-pages --save-dev`

---

## 📝 License

MIT

---

## ✍️ Author

FlyTicket Frontend - CENG-3502 Final Project
