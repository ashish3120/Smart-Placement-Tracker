# 🎯 Smart Placement Tracker

A comprehensive, production-ready web application designed to help students effortlessly track campus placement opportunities, manage critical deadlines, and streamline interview preparation.

## 🌐 Live Demo
- **Frontend (Application):** [Smart Placement Tracker](https://smart-placement-tracker-silk.vercel.app/)
- **Backend (API):** [https://smart-placement-tracker.onrender.com](https://smart-placement-tracker.onrender.com)

---

## ✨ Features

- **🚀 Interactive Dashboard**: Get a birds-eye view of your applications (Applied, Interview, Selected, Rejected).
- **💼 Opportunity Tracking**: Stay updated with a list of upcoming placement drives, roles, and CTC details.
- **⏰ Deadline Alerts**: Visual indicators and urgent alerts for deadlines within 24 hours.
- **📝 Preparation Hub**: Dedicated space for interview notes and preparation checklists.
- **👤 Profile Management**: Keep your professional details and placement stats organized.
- **🔒 Secure API**: Robust backend with JWT authentication and middleware protection.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Data Fetching**: Axios & React Query

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Security**: Helmet, CORS, JWT
- **Logging**: Morgan
- **Storage**: Local JSON-based storage (optimized for stability and demo readiness)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Smart-Placement-Tracker
   ```

2. **Install Backend Dependencies**
   ```bash
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd placement-navigator
   npm install
   cd ..
   ```

### Execution

To run the full application, you need to start both the backend and frontend servers:

1. **Start the Backend Server (Port 5000)**
   ```bash
   npm start
   ```

2. **Start the Frontend Development Server (Port 5173)**
   ```bash
   npm run dev --prefix placement-navigator
   ```

Your application will be live at **[http://localhost:5173](http://localhost:5173)**.

---

## 📂 Project Structure

```text
Smart-Placement-Tracker/
├── controllers/          # Request handlers
├── models/               # Data access logic (JSON Storage)
├── routes/               # API route definitions
├── services/             # Core business logic
├── middleware/           # Auth and error handling filters
├── utils/                # Helper functions and DB utilities
├── data/                 # Local JSON data store
└── placement-navigator/  # React Frontend (Vite + TypeScript)
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── pages/        # Main application views
    │   ├── lib/          # API and utility configs
    │   └── App.tsx       # Main routing logic
    └── tailwind.config.ts # Styling configuration
```

---

## 📝 Environment Setup

Ensure you have the following `.env` files configured:

**Root `.env`**:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
```

**Frontend `.env` (`/placement-navigator/.env`)**:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

