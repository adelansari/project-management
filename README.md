# Project Management System- Kanban Boards

## Overview
This web-based application is designed for project management, featuring user authentication, board, section, and task management. It uses React for the frontend and Express.js with MongoDB for the backend.

#### Technologies Used
- Frontend: React, Redux, Material-UI
- Backend: Express.js, MongoDB
- Authentication: JWT

## Features
- **User Authentication**:
  - Register new users with encrypted password storage.
  - Login functionality with JWT token generation.
  - Token verification endpoint.
- **Task Management**:
  - Create, update, delete, and reposition (drag & drop) tasks.
  - Update the position of multiple tasks within or between sections.
- **Board Management**:
  - Create, retrieve, update, and delete boards.
  - Mark boards as favorites and update their positions.
- **Section Handling**:
  - Group tasks into sections for better organization. Manage tasks within sections.
  - Create, update, and delete sections within boards.


## Getting Started

### Prerequisites
- Node.js
- npm or Yarn
- MongoDB

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/adelansari/project-management.git
   ```
2. **Install dependencies for the server**
   ```bash
   cd server
   yarn install
   ```
3. **Install dependencies for the client**
   ```bash
   cd ../client
   yarn install
   ```
4. **Set up environment variables**
   - Duplicate `server/.env.Example` and rename it to `.env`.
   - Fill in the necessary environment variables.
        ```bash
        # server/.env
        PORT=5000
        MONGODB_URL=mongodb://127.0.0.1:27017/project-management
        PASSWORD_SECRET_KEY=
        TOKEN_SECRET_KEY=
        ```

### Running the Application
1. **Start the server**
   ```bash
   cd server
   yarn start
   ```
2. **In a new terminal, start the client**
   ```bash
   cd client
   yarn start
   ```
3. The application should now be running on `localhost:3000`.

## Usage
- **Login/Signup**: Create an account or log in to access the dashboard.
- **Creating Boards**: Manage different projects or aspects of your work.
- **Adding Tasks**: Break down your work into manageable tasks.
- **Organizing Sections**: Group related tasks for better clarity.

## Contributing
Contributions to the Project Management System are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

## License
Distributed under the MIT License. See `LICENSE` for more information.

---
