import {
  findUserByIdentifier,
  validatePassword,
  createUser,
  createToken,
} from "../services/authService.js";

// controllers/authController.js
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await findUserByIdentifier(identifier).select("+password");

    if (!user) {
      return res.render("auth/login", {
        title: "Login",
        error: "User not found",
      });
    }

    const isMatch = await validatePassword(password, user.password);
    if (!isMatch) {
      return res.render("auth/login", {
        title: "Login",
        error: "Invalid password",
      });
    }

    const token = createToken(user._id);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Login error: " + error.message);
  }
};
export const logout = (req, res) => {
  res.clearCookie("token");
  req.user = null;
  res.locals.user = null;
  res.redirect("/auth/login");
};

export const register = async (req, res, next) => {
  console.log("Received Body:", req.body);
  try {
    const { name, uname, email, password, role } = req.body;

    await createUser({ name, uname, email, password, role });

    res.redirect("/auth/login");
  } catch (error) {
    console.log("FULL ERROR OBJECT:", error);
    console.error("Registration Error:", error.message);
    res.render("auth/register", {
      title: "Register",
      error:
        error.code === 11000
          ? "Username or Email already exists"
          : "Registration failed",
    });
  }
};
