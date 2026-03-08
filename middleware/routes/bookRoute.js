const router = express.Router();
const { addBook } = require("../controllers/bookController");
const { authorize } = require("../middleware/auth");

router.post("/", authorize("librarian"), addBook);

module.exports = router;
