
import Book from '../model/book.js'; 
import User from '../model/user.js';
import Category from '../model/category.js';
import Transaction from '../model/transactions.js';

export const getHomePage = async (req, res) => {
    try {
        const bookCount = await Book.countDocuments();
        const userCount = await User.countDocuments();
        const categoryCount = await Category.countDocuments();

        res.render('index.js', { 
            bookCount, 
            userCount, 
            categoryCount 
        });
    } catch (error) {
        res.status(500).send("Error loading home page");
    }
};
