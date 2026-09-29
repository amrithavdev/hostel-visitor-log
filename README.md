# Hostel Visitor Log Management System

A simple DBMS college project that demonstrates a real-time database application using Node.js, Express, MySQL, and vanilla HTML/CSS/JavaScript.

---

## Project Description

The Hostel Visitor Log Management System allows hostel staff to:

- Manage hostel residents
- Record visitor check-ins and check-outs
- View who is currently inside the hostel
- Search and filter visitor history
- Delete visitor records

This project is built as a DBMS activity to demonstrate core database concepts including tables, primary keys, foreign keys, relationships, and SQL operations (INSERT, SELECT, UPDATE, DELETE, JOIN).

---

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | HTML, CSS, JavaScript   |
| Backend  | Node.js + Express       |
| Database | MySQL                   |

---

## Database Design

**Database name:** `hostel_log`

### Table 1: `residents`

| Column       | Type         | Constraints              |
|--------------|--------------|--------------------------|
| resident_id  | INT          | PRIMARY KEY, AUTO_INCREMENT |
| name         | VARCHAR(100) | NOT NULL                 |
| room_no      | VARCHAR(10)  | NOT NULL                 |

### Table 2: `visitors`

| Column       | Type         | Constraints                                      |
|--------------|--------------|--------------------------------------------------|
| visitor_id   | INT          | PRIMARY KEY, AUTO_INCREMENT                      |
| visitor_name | VARCHAR(100) | NOT NULL                                         |
| purpose      | VARCHAR(200) | NOT NULL                                         |
| check_in     | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP              |
| check_out    | DATETIME     | DEFAULT NULL (NULL = visitor still inside)       |
| resident_id  | INT          | NOT NULL, FOREIGN KEY → residents(resident_id)  |

### Relationship

One resident can have many visitors over time.  
Each visitor record belongs to exactly one resident.  
This is a **one-to-many** relationship enforced via foreign key.

```
residents (1) ──────── (many) visitors
```

---

## DBMS Concepts Demonstrated

| Concept              | Where it appears                                      |
|----------------------|-------------------------------------------------------|
| Primary Key          | `resident_id`, `visitor_id`                          |
| Foreign Key          | `visitors.resident_id → residents.resident_id`       |
| One-to-many relation | One resident → many visitor records                  |
| NOT NULL constraint  | name, room_no, visitor_name, purpose, check_in       |
| NULL                 | `check_out` is NULL while visitor is still inside    |
| AUTO_INCREMENT       | Both primary keys                                    |
| INSERT               | Add resident, record check-in                        |
| SELECT               | View residents, view visitors                        |
| UPDATE               | Mark visitor as checked out                          |
| DELETE               | Delete resident or visitor record                    |
| JOIN                 | Visitor records joined with resident name and room   |
| WHERE / filtering    | Current visitors (check_out IS NULL), search         |
| LIKE                 | Search by name, purpose, resident, room              |
| DATETIME / NOW()     | check_in and check_out timestamps                    |

---

## Folder Structure

```
hostel-visitor-log/
│
├── backend/
│   ├── db.js              ← MySQL connection
│   ├── server.js          ← Express app and all API routes
│   ├── package.json
│   ├── .env               ← your local credentials (not on GitHub)
│   ├── .env.example       ← template for credentials
│   └── .gitignore
│
├── frontend/
│   ├── index.html         ← Dashboard
│   ├── residents.html     ← Add and manage residents
│   ├── checkin.html       ← Record visitor check-in
│   ├── visitors.html      ← View records, checkout, search, delete
│   └── style.css          ← Shared styles
│
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or above)
- [MySQL](https://www.mysql.com/) (v8 or above)
- A browser (Chrome recommended)

---

## Setup Instructions

### Step 1 — Create the MySQL database and tables

Open MySQL and run:

```sql
CREATE DATABASE hostel_log;
USE hostel_log;

CREATE TABLE residents (
    resident_id INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    room_no     VARCHAR(10)  NOT NULL
);

CREATE TABLE visitors (
    visitor_id   INT AUTO_INCREMENT PRIMARY KEY,
    visitor_name VARCHAR(100) NOT NULL,
    purpose      VARCHAR(200) NOT NULL,
    check_in     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    check_out    DATETIME     DEFAULT NULL,
    resident_id  INT          NOT NULL,
    FOREIGN KEY (resident_id) REFERENCES residents(resident_id)
);
```

### Step 2 — Configure environment variables

Inside the `backend/` folder, create a file named `.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=hostel_log
PORT=3000
```

### Step 3 — Install backend dependencies

Open a terminal inside the `backend/` folder:

```bash
npm install
```

### Step 4 — Start the backend server

```bash
npm start
```

You should see:

```
Connected to MySQL database: hostel_log
Server is running on http://localhost:3000
```

### Step 5 — Open the frontend

Open `frontend/index.html` directly in your browser (double-click it or drag it into Chrome).

No additional server is needed for the frontend.

---

## API Endpoints

### Residents

| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | /api/residents        | Get all residents    |
| POST   | /api/residents        | Add a new resident   |
| DELETE | /api/residents/:id    | Delete a resident    |

### Visitors

| Method | Endpoint                        | Description                        |
|--------|---------------------------------|------------------------------------|
| GET    | /api/visitors                   | Get all visitor records (with JOIN)|
| POST   | /api/visitors                   | Record a visitor check-in          |
| PUT    | /api/visitors/:id/checkout      | Mark visitor as checked out        |
| DELETE | /api/visitors/:id               | Delete a visitor record            |
| GET    | /api/visitors/current           | Get visitors currently inside      |
| GET    | /api/visitors/search?query=...  | Search visitor records             |

---

## Frontend Pages

| Page             | File             | Purpose                                      |
|------------------|------------------|----------------------------------------------|
| Dashboard        | index.html       | Live counts of residents and visitors        |
| Residents        | residents.html   | Add residents, view list, delete             |
| Visitor Check-in | checkin.html     | Record a visitor arriving at the hostel      |
| Visitor Records  | visitors.html    | Current visitors, history, search, checkout  |

---

## How to Test

1. Go to **Residents** → add 2–3 residents
2. Go to **Visitor Check-in** → check in 2–3 visitors for different residents
3. Go to **Visitor Records** → see currently inside visitors
4. Click **Check Out** on one visitor → they move to history
5. Use the **Search** box → search by visitor name, purpose, resident name, or room number
6. Go back to **Residents** → try deleting a resident who has visitor records (deletion will be blocked by the database foreign key constraint)
7. Check the **Dashboard** → counts update automatically

---

## Notes

- `check_out` is `NULL` in the database while the visitor is still inside. This is intentional and demonstrates the use of NULL in SQL.
- The foreign key constraint prevents deleting a resident who still has visitor records, preserving data integrity.
- All SQL queries use parameterized inputs to prevent SQL injection.
- No authentication, no login, no external APIs — kept minimal for a DBMS college demo.

---

## Team


**St. Joseph's College of Engineering, Chennai**  
Department of Information Technology  
DBMS Lab Activity — B.Tech IT (2029 Batch)
### Team Members

- Amritha V
- Bala Aditya
- Shafeeq Ahmad
- Sharon jayaseeli
