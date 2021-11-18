const Router = require("express").Router();

const BookModel = require("../schema/book");
const AuthorModel = require("../schema/author");
Router.get("/book", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

Router.get("/book/:bookID", async (req, res) => {
    const getSpecificBook = await BookModel.findOne({
        ISBN: req.params.bookID,
    });

    if (!getSpecificBook) {
        return res.json({
            error: `No book found fot the ISBN of ${req.params.bookID}`,
        });
    }

    return res.json({ book: getSpecificBook });
});

Router.get("/book/c/:category", async (req, res) => {
    const getSpecificBooks = await BookModel.findOne({
        category: req.params.category,
    });

    if (!getSpecificBooks) {
        return res.json({
            error: `No book found for the category of ${req.params.category}`,
        });
    }

    return res.json({ books: getSpecificBooks });
});

Router.post("/book/new", async (req, res) => {
    try {
        const { newBook } = req.body;

        await BookModel.create(newBook);
        return res.json({ message: "Book added to the database" });
    } catch (error) {
        return res.json({ error: error.message });
    }
});

Router.put("/book/updateTitle/:isbn", async (req, res) => {
    const { title } = req.body.title;

    const updateBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            title: title,
        },
        {
            new: true,
        }
    );

    return res.json({ book: updateBook });
});

Router.put("/book/updateAuthor/:isbn", async (req, res) => {
    const { newAuthor } = req.body;
    const { isbn } = req.params;

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: isbn,
        },
        {
            $addToSet: {
                authors: newAuthor,
            },
        },
        {
            new: true,
        }
    );

    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: newAuthor,
        },
        {
            $addToSet: {
                books: isbn,
            },
        },
        {
            new: true,
        }
    );

    return res.json({
        books: updatedBook,
        authors: updatedAuthor,
        message: "New author was added into the database",
    });
});

Router.delete("/book/delete/:isbn", async (req, res) => {
    const { isbn } = req.params;

    const updateBookDatabase = await BookModel.findOneAndDelete({
        ISBN: isbn,
    });

    return res.json({ books: updateBookDatabase });
});

Router.delete("/book/delete/author/:isbn/:id", async (req, res) => {
    const { isbn, id } = req.params;

    //updating book database object
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: isbn,
        },
        {
            $pull: {
                authors: parseInt(id),
            },
        },
        {
            new: true,
        }
    );

    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(id),
        },
        {
            $pull: {
                books: isbn,
            },
        },
        {
            new: true,
        }
    );

    return res.json({
        message: "Author was deleted",
        book: updatedBook,
        author: updatedAuthor,
    });
});

module.exports = Router;