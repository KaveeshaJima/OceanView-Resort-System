# 🏨 OceanView Resort Management System

OceanView Resort is a comprehensive web application designed for a beachside hotel in Galle to manage room reservations, guest records, and billing efficiently. This system replaces manual record-keeping, reducing booking conflicts and enhancing operational speed.

## 🚀 Project Overview
The system follows a **3-Tier Architecture** and is built using modern web technologies. It supports multiple user roles (Admin, Manager, and Receptionist) with specific access permissions.

### Key Features:
* **User Authentication:** Secure login for Admin, Manager, and Receptionist.
* **Reservation Management:** Full CRUD operations for bookings with automated room status updates.
* **Guest Management:** Centralized database for guest registration and history.
* **Billing System:** Automatic total price calculation based on stay duration and room rates.
* **Automated PDF Invoices:** Generate professional invoices using iText library.
* **Dashboard & Reports:** Real-time data visualization of room availability and revenue.
* **CI/CD Integration:** Automated build verification using GitHub Actions.

---

## 🛠️ Tech Stack

### Frontend:
* **React.js** (Vite)
* **Tailwind CSS** (Styling)
* **Axios** (API Requests)
* **Recharts** (Data Visualization)

### Backend:
* **Java EE / Jakarta EE**
* **Jersey (JAX-RS)** (RESTful Web Services)
* **Hibernate / JPA** (ORM)
* **MySQL** (Database)
* **iText** (PDF Generation)

---

## 🏗️ System Architecture
The project is divided into two main modules:
1. `resort-frontend`: The user interface built with React.
2. `resort-management-ee`: The backend API handling business logic and database connectivity.



---

## ⚙️ Setup and Installation

### Prerequisites:
* JDK 17 or higher
* Node.js (v16 or higher)
* MySQL Server
* Apache Tomcat 9 or 10

### Steps:
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/KaveeshaJima/OceanView-Resort-System.git](https://github.com/KaveeshaJima/OceanView-Resort-System.git)
