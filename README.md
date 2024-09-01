# Full Stack Social Media App

## Overview

This is a full stack Social media application built using React, Vite for Frontend and Django, Django Rest Framework for the backend. The app allows users to create, update, delete posts, manage their profiles, follow others and features JWT authentication for secure access.

## Features

- **User Authentication**: Secure login and registration using JWT (JSON Web Token).
- **Password Reset**: Password Reset via SMTP Service 
- **Post Management**: Users can create and manage their **Posts**.
- **Like / UnLike**: Users can **Like/Unlike** posts.
- **Comment**: Users can Comment on posts.
- **Profile Management**: Users can create and manage posts.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js and npm installed
- Python and pip installed
- Django installed

## Getting Started

### Backend Setup

1. **Clone the repository**
   ```sh
   git clone https://github.com/ZainAli121/FullStack-Social-Media
2. **Navigate to the project directory**
   ```sh
   cd Backend
3. Create a virtual environment
   ```sh
   python -m venv venv
4. Activate the virtual environment
   ```sh
    venv/Scripts/activate
5. Install the required packages
    ```sh
    pip install -r requirements.txt
6. Add your Database and Email Credentials in `Setting.py` File
   
7. Run Migrations
    ```sh
    python manage.py migrate

7. Addtional setup
    - Create a superuser
    ```sh
    python manage.py createsuperuser

8. Start the development server
    ```sh
    python manage.py runserver

9. The backend server should now be running on `http://127.0.0.1:8000/`


### Frontend Setup

1. **Navigate to the project directory**
   ```sh
   cd Frontend
2. Install the required packages
   ```sh
    npm install
3. Create .env file in the root of the frontend directory and add the following environment variables
    ```sh
    VITE_API_URL = "http://127.0.0.1:8000"
4. Start the development server
    ```sh
    npm run dev
5. The frontend server should now be running on `http://localhost:5173/`


### Demo 
1. Access the Full App at `https://blissbuzz.vercel.app`


## Contributing
Feel free to contribute to this project by creating a pull request.

## Team
Developed by **Zain Ali** with ❤️
