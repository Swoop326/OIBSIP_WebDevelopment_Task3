# Online Pizza Ordering System  
**OIB-SIP Web Development & Design Internship – Task 3**

## Project Objective
The objective of this project is to design and develop a **full-stack online pizza ordering system** that allows users to browse pizzas, customize orders, place orders with mock payment, and track order status.  
An **admin dashboard** is included to manage inventory, view orders, update order status, and receive low-stock notifications.

---

## Technologies Used

### Frontend
- React.js
- React Router
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication

### Other Tools
- Nodemailer (Email notifications)
- Git & GitHub

---

## Features Implemented

### User Features
- User registration with email verification
- Secure login and logout
- Browse available pizzas
- Customize pizza (base, sauce, cheese, veggies)
- Place orders with mock payment gateway
- View order history
- Track real-time order status updates

---

### Admin Features
- Secure admin login
- Inventory management (bases, sauces, cheese, veggies)
- Update inventory quantities manually
- Automatic inventory deduction after orders
- Low-stock email alerts
- View all customer orders
- Update order status:
  - PLACED
  - PREPARING
  - OUT FOR DELIVERY
  - DELIVERED
- Order status updates reflected on user dashboard

---

## Authentication & Security
- JWT-based authentication
- Separate user and admin sessions
- Protected routes for user and admin dashboards

## How to run this project locally

## For backend
- cd backend
- npm install
- npm run dev

## For frontend
- cd frontend
- npm install
- npm start

---

## Environment Variables

Create a `.env` file in the **backend** folder with the following variables:

```env
PORT=5500
MONGO_URI=mongodb_connection_string
JWT_SECRET=jwt_secret
ADMIN_EMAIL=admin_email_for_alerts
EMAIL_USER=email_address
EMAIL_PASS=email_app_password



