
import User from "../models/user.js";


export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).render("error", { 
        title: "Unauthorized", 
        message: "Please login to perform this action." 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).render("error", { 
        title: "Access Denied", 
        message: `Your role (${req.user.role}) does not have permission to do this.` 
      });
    }

    next();
  };
};


export const canEditUser = async (req, res, next) => {
  try {
    const editor = req.user; 
    const targetUserId = req.params.id;

    
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).render("error", { title: "404", message: "User not found." });
    }

    const editorRole = editor.role;
    const targetRole = targetUser.role;
    let isAuthorized = false;

    if (editor._id.toString() === targetUserId) {
      isAuthorized = true;
    } 

    else if (editorRole === "admin") {
      if (targetRole === "librarian" || targetRole === "user") {
        isAuthorized = true;
      }
    } 
    
    else if (editorRole === "librarian") {
      if (targetRole === "user") {
        isAuthorized = true;
      }
    }

    if (isAuthorized) {
      return next();
    }

    return res.status(403).render("error", {
      title: "Access Denied",
      message: `Access Denied: A ${editorRole} cannot manage a ${targetRole}.`
    });

  } catch (error) {
    console.error("Role Middleware Error:", error.message);
    res.status(500).render("error", { title: "Error", message: "Internal Server Error" });
  }
};
