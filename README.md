# Express Book Reviews Backend

A RESTful API for a book review system with user authentication using Express.js and JWT.

## Project Structure

```
├── index.js           # Main application entry point
├── package.json       # Project dependencies and scripts
├── router/
│   ├── auth_users.js  # Authenticated user routes
│   ├── booksdb.js     # Book database
│   └── general.js     # Public routes
```

## Features

- User registration and authentication
- JWT-based protected routes
- Book listing and filtering by ISBN, author, and title
- Adding, updating, and deleting book reviews (for authenticated users)
- Asynchronous data fetching with Promises

## API Endpoints

### Public Routes

- `POST /register` - Register a new user
- `GET /` - Get all available books
- `GET /isbn/:isbn` - Get book details by ISBN
- `GET /author/:author` - Get books by author
- `GET /title/:title` - Get books by title
- `GET /review/:isbn` - Get reviews for a specific book

### Authenticated Routes

- `POST /customer/login` - User login
- `PUT /customer/auth/review/:isbn` - Add or update a book review
- `DELETE /customer/auth/review/:isbn` - Delete a book review

## Technologies Used

- Express.js
- JSON Web Tokens (JWT)
- Express Session
- Nodemon (for development)

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. The server will run on port 5000

## License

This project is licensed under the MIT License.
