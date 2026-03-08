backend/
├npm ── config/             # Database connection (e.g., MongoDB/Mongoose or SQL)
├── controllers/        # Logic: Book issue/return, User registration
├── models/             # Database Schemas: Book, User, Transaction
├── routes/             # URL Endpoints: /api/books, /api/users
├── middleware/         # Auth (JWT), Error Handling, Role Check (Admin/Student)
├── utils/              # Helper functions: Fine calculator, Date formatters
├── .env                # Secret keys, DB URI
└── server.js           # Entry point 



// You can name it whatever you like since it was a default export
import Book from './models/Book.js'; 

// Example usage
const allBooks = await Book.find();
