import { getHomeStats } from "../services/pageService.js";

export const getHomePage = async (req, res) => {
  try {
    const { bookCount, userCount, categoryCount } = await getHomeStats();

    res.render("index", {
      title: "Home",
      bookCount,
      userCount,
      categoryCount,
      user: req.user || { name: "Guest" }  
    });
  } catch (error) {
    res.status(500).send("Error loading home page");
  }
};
