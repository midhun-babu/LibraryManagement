exports.addBook = async (req, res) => {
  const book = await Book.create(req.body);
  res.status(201).json(book);
};
