import {
  requestBookService,
  getUserRequests,
  getAllRequests,
  approveRequestService,
  issueApprovedRequestService,
  rejectRequestService,
} from "../services/bookRequestService.js";

// Request a book
export const requestBook = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await requestBookService(id, req.user._id);

    res.redirect("/books");
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
  }
};

// Get user's requests
export const getUserBookRequests = async (req, res) => {
  try {
    const requests = await getUserRequests(req.user._id);

    try {
      res.render("bookRequests/my", {
        title: "My Book Requests",
        requests,
      });
    } catch (renderErr) {
      console.error("Render error:", renderErr);
      res.status(500).send("Error rendering requests");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading requests");
  }
};

// Get all requests (admin/librarian)
export const getAllBookRequests = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      bookId: req.query.bookId,
      userId: req.query.userId,
    };
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { requests, total } = await getAllRequests(filters, { page, limit });
    const totalPages = Math.ceil(total / limit) || 1;

    try {
      res.render("bookRequests/index", {
        title: "Book Requests",
        requests,
        pagination: { page, limit, total, totalPages },
        filters,
      });
    } catch (renderErr) {
      console.error("Render error:", renderErr);
      res.status(500).send("Error rendering requests");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading requests");
  }
};

// Approve request
export const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await approveRequestService(id, req.user._id);

    res.redirect("/bookRequests");
  } catch (err) {
    console.error(err);
    res.redirect("/bookRequests");
  }
};

// Issue approved request
export const issueApprovedRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const { transaction, request } = await issueApprovedRequestService(id, req.user._id);

    res.redirect("/bookRequests");
  } catch (err) {
    console.error(err);
    res.redirect("/bookRequests");
  }
};

// Reject request
export const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await rejectRequestService(id, req.user._id);

    res.redirect("/bookRequests");
  } catch (err) {
    console.error(err);
    res.redirect("/bookRequests");
  }
};