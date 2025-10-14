# FitTrack - Fitness Tracking & Community Platform 🏋️‍♂️

<div align="center">

![FitTrack Banner](https://img.shields.io/badge/FitTrack-Fitness%20Platform-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-Express-brightgreen)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)

*A comprehensive fitness tracking platform connecting users, trainers, and gyms*

[Features](#-features) • [Quick Start](#-quick-start) • [Project Structure](#-project-structure) • [API Docs](#-api-endpoints)

</div>

## 🌟 Features

| Category | Features |
|----------|----------|
| **📊 Fitness Tracking** | Daily activity logging • Workout sessions • Sleep analysis • Progress analytics |
| **🏋️‍♂️ Gym & Trainer** | Gym discovery • Ratings & reviews • Trainer profiles • Booking system |
| **📝 Journal & Community** | Personal journal • Community feed • Comments • Ratings system |
| **🔐 User Management** | Secure authentication • User profiles • Role-based access |

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- PostgreSQL
- npm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/fittrack.git
cd fittrack

# Backend setup
cd backend
npm install
cp .env.example .env
npx sequelize-cli db:migrate
npm run dev

# Frontend setup (new terminal)
cd ../fitness-frontend
npm install
cp .env.example .env
npm start




Access: Frontend → http://localhost:3000 | Backend API → http://localhost:5000







🏗️ Project Structure
📁 Backend Architecture
text
backend/
├── 🗂️ config/
│   └── database.js
├── 🎮 controllers/
│   ├── authController.js
│   ├── gymController.js
│   ├── trainerController.js
│   ├── journalController.js
│   ├── dailylogController.js
│   └── sleepAnalysisController.js
├── 🛡️ middleware/
│   └── auth.js
├── 🗃️ models/
│   ├── users.js
│   ├── gym.js
│   ├── trainerprofile.js
│   ├── journal.js
│   ├── dailylog.js
│   └── sleeplog.js
├── 🛣️ routes/
│   ├── authRoutes.js
│   ├── gymRoutes.js
│   ├── trainerRoutes.js
│   ├── journalRoutes.js
│   └── dailylogRoutes.js
├── 🔧 services/
│   ├── aiSuggestionService.js
│   ├── messagingService.js
│   └── notificationService.js
└── 🚀 app.js
📁 Frontend Architecture
text
fitness-frontend/
├── 🌐 public/
│   ├── index.html
│   └── favicon.ico
├── 💻 src/
│   ├── 🧩 components/
│   │   ├── 🔐 Auth/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Auth.css
│   │   ├── 🏋️‍♂️ Gym/
│   │   │   ├── GymCard.js
│   │   │   ├── GymSearch.js
│   │   │   ├── GymDetails.js
│   │   │   └── GymRating.js
│   │   ├── 👨‍🏫 Trainer/
│   │   │   ├── TrainerCard.js
│   │   │   ├── TrainerProfile.js
│   │   │   ├── TrainerRating.js
│   │   │   └── TrainerList.js
│   │   ├── 📝 Journal/
│   │   │   ├── JournalCard.js
│   │   │   ├── JournalEditor.js
│   │   │   ├── JournalComments.js
│   │   │   ├── JournalRating.js
│   │   │   └── JournalSearch.js
│   │   └── 🔧 Common/
│   │       ├── Layout.js
│   │       └── Navbar.js
│   ├── 🎯 pages/
│   │   ├── Dashboard.js
│   │   ├── Gyms.js
│   │   ├── Trainers.js
│   │   ├── Journal.js
│   │   ├── JournalCommunity.js
│   │   └── Profile.js
│   ├── 🌐 services/
│   │   └── api.js
│   ├── 🛠️ utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── 🏠 App.js
│   └── ⚡ index.js
└── package.json






🎯 Key Components
🚀 Core Features
Component	Description	Key Files
🔐 Authentication	JWT-based secure login system	AuthContext.js, authController.js
🏋️‍♂️ Gym System	Gym discovery with ratings & reviews	GymCard.js, gymController.js, gym.js
👨‍🏫 Trainer System	Trainer profiles with booking	TrainerCard.js, trainerController.js, trainerprofile.js
📝 Journal System	Personal & community journals	JournalEditor.js, journalController.js, journal.js
📊 Fitness Tracking	Activity, workout & sleep logging	dailylogController.js, workoutsession.js, sleeplog.js
🎨 Frontend Components
🔐 Authentication


Login/Register - Secure user authentication forms

Auth Context - Global authentication state management

🏋️‍♂️ Gym Components
GymCard - Beautiful gym preview cards with ratings

GymSearch - Location-based gym discovery

GymDetails - Comprehensive gym information pages

GymRating - 5-star rating system with reviews

👨‍🏫 Trainer Components
TrainerCard - Professional trainer profile cards

TrainerProfile - Detailed trainer pages with specialties

TrainerRating - Rating and review system for trainers

📝 Journal Components
JournalCard - Journal entry preview cards

JournalEditor - Rich text journal creation/editing

JournalComments - Interactive comment system

JournalRating - Community rating for journals

🔧 Backend Services
🗃️ Database Models
User Management - users.js, authentication profiles

Gym System - gym.js, gymrating.js for gym data

Trainer System - trainerprofile.js, trainerrating.js

Journal System - journal.js, journalcomment.js, journalrating.js

Fitness Tracking - dailylog.js, workoutsession.js, sleeplog.js

🎮 Controllers
Auth Controller - User registration, login, profile management

Gym Controller - Gym CRUD, nearby search, rating system

Trainer Controller - Profile management, search, ratings

Journal Controller - Entries, comments, community feed

📱 Pages & Routes
Page	Route	Description
Home	/	Landing page with app overview
Dashboard	/dashboard	User fitness overview & analytics
Gyms	/gyms	Gym discovery & search
Gym Details	/gym/:id	Individual gym with ratings
Trainers	/trainers	Trainer directory & filters
Trainer Profile	/trainer/:id	Trainer details & booking
Journal	/journal	Personal journal management
Community	/journal/community	Public journal feed
Journal Entry	/journal/:id	Single entry with comments

🔧 API Endpoints

🔐 Authentication
Method	Endpoint	Description
POST	/api/auth/login	User login
POST	/api/auth/register	User registration
GET	/api/auth/profile	Get user profile
PUT	/api/auth/profile	Update profile

🏋️‍♂️ Gyms
Method	Endpoint	Description
POST	/api/gyms	Create gym (owners)
GET	/api/gyms/nearby	Find nearby gyms
POST	/api/gyms/:id/rate	Rate a gym

👨‍🏫 Trainers
Method	Endpoint	Description
POST	/api/trainer/profile	Create trainer profile
GET	/api/trainers	Get trainers list
POST	/api/trainers/:id/rate	Rate a trainer

📝 Journals
Method	Endpoint	Description
POST	/api/journals	Create journal entry
GET	/api/journals	Get community journals
POST	/api/journals/:id/comments	Add comment
POST	/api/journals/:id/rate	Rate journal











🚀 Deployment
Backend
bash
npm run build
npm start
Frontend
bash
npm run build
# Deploy to hosting service
Environment Variables
Backend (.env)

env
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_NAME=fittrack
DB_USER=username
DB_PASS=password
JWT_SECRET=your_jwt_secret
Frontend (.env)

env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=production
🤝 Contributing
Fork the repository

Create feature branch: git checkout -b feature/AmazingFeature

Commit changes: git commit -m 'Add AmazingFeature'

Push to branch: git push origin feature/AmazingFeature

Open a Pull Request

📄 License
This project is licensed under the MIT License - see LICENSE file for details.

