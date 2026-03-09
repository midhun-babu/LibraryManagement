import { getDashboardStats } from "../services/dashboardService.js";

export const dashboardController = async (req, res) => {
  try {
    const { bookCount, categoryCount, userCount } = await getDashboardStats();

    res.render("index", {
      user: req.user || { name: "Guest" },  
      bookCount,
      categoryCount,
      userCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export const getDashboard = async (req, res) => {
  const bookCount = await Book.countDocuments();
  
  res.render("index", { 
    title: "Library Dashboard",
    bookCount,
    categoryCount,
    userCount
  });
};
