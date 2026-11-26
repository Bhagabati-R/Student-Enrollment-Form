# Student Enrollment Form using JsonPowerDB

A complete, functional, and professionally designed Student Enrollment Management web application built with HTML, CSS, JavaScript, and JsonPowerDB.

## Project Overview

This application provides a user-friendly interface for managing student enrollment records. It implements full CRUD operations (Create, Read, Update) with JsonPowerDB as the backend database, following a strict workflow for data integrity and user experience.

## Technologies Used

- **HTML5** - Structure and markup
- **CSS3** - Modern styling with responsive design
- **JavaScript (Vanilla)** - Form handling and database operations
- **JsonPowerDB** - NoSQL database for data persistence

## Database Configuration

| Property | Value |
|----------|-------|
| Database Name | SCHOOL-DB |
| Relation/Table Name | STUDENT-TABLE |
| Primary Key | Roll-No |

## Input Fields

The form contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| Roll-No | Number | Primary Key - Unique identifier for each student |
| Full-Name | Text | Student's full name |
| Class | Text | Class/Grade (e.g., 10th, 12th) |
| Birth-Date | Date | Student's date of birth |
| Address | Textarea | Full residential address |
| Enrollment-Date | Date | Date of enrollment |

## Features

### Initial Page Load
- Empty form displayed
- Cursor focused on Roll-No field
- Only Roll-No field enabled
- All buttons disabled

### Primary Key Validation
When Roll-No is entered:
- **New Roll-No**: Form enables for new entry with Save button active
- **Existing Roll-No**: Form populates with existing data, Update button active

### Save Functionality
- Validates all fields are non-empty
- Inserts new record into JsonPowerDB
- Shows success message and resets form

### Update Functionality
- Allows modification of all fields except Roll-No
- Updates existing record in database
- Shows success message and resets form

### Reset Functionality
- Clears all fields
- Resets to initial state
- Focuses cursor on Roll-No

## Project Structure

```
Student-Enrollment-Form/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Stylesheet for the application
├── js/
│   ├── db.js           # JsonPowerDB configuration and operations
│   └── form.js         # Form handling logic
├── README.md           # Project documentation
└── .gitignore          # Git ignore file
```

## Setup and Execution Instructions

### Prerequisites

1. **JsonPowerDB Installation**
   - Download JsonPowerDB from [login2explore.com](https://login2explore.com/jpdb/)
   - Or use the cloud version at [jpdb.io](https://jpdb.io/)

2. **Web Browser**
   - Chrome, Firefox, Edge, or any modern browser

3. **Code Editor** (Optional)
   - VS Code with Live Server extension recommended

### Installation Steps

1. **Clone or Download the Repository**
   ```bash
   git clone <your-repository-url>
   cd Student-Enrollment-Form
   ```

2. **Configure JsonPowerDB**
   - Open `js/db.js` in a text editor
   - Replace `YOUR_CONNECTION_TOKEN_HERE` with your actual JsonPowerDB connection token
   - Update the `baseUrl` if using a remote server:
     ```javascript
     baseUrl: "http://localhost:8081"  // For local
     // OR
     baseUrl: "https://your-jpdb-server.com"  // For remote
     ```

3. **Create Database and Table**
   - Login to your JsonPowerDB admin panel
   - Create a new database named `SCHOOL-DB`
   - Create a relation named `STUDENT-TABLE`
   - Set `Roll-No` as the primary key

4. **Run the Application**
   - **Option 1: Using VS Code Live Server**
     - Open the project folder in VS Code
     - Right-click on `index.html`
     - Select "Open with Live Server"
   
   - **Option 2: Direct Browser**
     - Open `index.html` directly in a web browser
     - Note: For JPDB connectivity, use Live Server or a local server

## JsonPowerDB Configuration Instructions

### Getting Your Connection Token

1. Visit [login2explore.com](https://login2explore.com/) or your JPDB instance
2. Create an account or login
3. Navigate to the dashboard
4. Copy your connection token from the API section

### Database Setup Commands

You can create the database using JPDB REST API:

```javascript
// Create Database
PUT /api/iml
{
    "token": "YOUR_TOKEN",
    "cmd": "PUT",
    "dbName": "SCHOOL-DB",
    "rel": "STUDENT-TABLE",
    "jsonStr": {
        "Roll-No": "1",
        "Full-Name": "Test Student",
        "Class": "10th",
        "Birth-Date": "2008-01-15",
        "Address": "Test Address",
        "Enrollment-Date": "2023-06-01"
    }
}
```

### Security Note

**IMPORTANT**: Never commit your actual connection token to GitHub or any public repository. Consider these alternatives:

1. Use environment variables
2. Use a backend proxy service
3. Keep the token in a separate config file that's gitignored

## How to Test the Application

1. **Test Save Operation**
   - Enter a new Roll Number
   - Fill in all student details
   - Click Save
   - Verify success message and form reset

2. **Test Update Operation**
   - Enter an existing Roll Number
   - Modify the displayed details
   - Click Update
   - Verify success message and form reset

3. **Test Reset Operation**
   - Click Reset at any time
   - Verify form returns to initial state

## Uploading to GitHub

### Step 1: Initialize Git Repository
```bash
cd Student-Enrollment-Form
git init
```

### Step 2: Add Files
```bash
git add .
```

### Step 3: Commit Changes
```bash
git commit -m "Initial commit: Student Enrollment Form with JsonPowerDB"
```

### Step 4: Create GitHub Repository
1. Go to [GitHub](https://github.com/)
2. Click "New Repository"
3. Name it `Student-Enrollment-Form`
4. Don't initialize with README (we already have one)

### Step 5: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/Student-Enrollment-Form.git
git branch -M main
git push -u origin main
```

### Step 6: Update Connection Token Securely

Before pushing, ensure your token is removed or replaced with placeholder:

```javascript
// In js/db.js - use placeholder for public repos
connToken: "YOUR_CONNECTION_TOKEN_HERE"
```

## Screenshots

The application features:
- Clean, modern UI with gradient background
- Responsive design for mobile and desktop
- Clear form validation messages
- Loading indicators during database operations
- Visually distinct enabled/disabled states

## Browser Support

- Google Chrome (recommended)
- Mozilla Firefox
- Microsoft Edge
- Safari

## License

This project is created for educational purposes as part of the JsonPowerDB learning curriculum.

## Author

Created for Student Enrollment Management System assignment.

## Support

For JsonPowerDB related issues, visit:
- [JPDB Documentation](https://login2explore.com/jpdbdocs.html)
- [JPDB Forums](https://login2explore.com/forums/)

---

**Note**: This application uses JsonPowerDB, a high-performance, lightweight, and simple-to-use NoSQL database. Make sure to properly configure your JPDB instance before running the application.
