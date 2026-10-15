const express = require("express");
const server = express();
const mysql = require("mysql");
const cors = require("cors");

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "nailton123",
  database: process.env.DB_NAME || "crudgames",
});

server.use(express.json());
server.use(cors());

server.post("/", (req, res) => {
  res.status(200).json({
    message: "Bienvenue sur l´API Book CRUD",
  });
});

//#region Books
server.post("/books/create", (req, res) => {
  const { name } = req.body;
  const { cost } = req.body;
  const { categoryId } = req.body;
  const { authorId } = req.body;
  const { isbn } = req.body;
  const { parutionDate } = req.body;
  const { pageNumber } = req.body;
  const { synopsis } = req.body;
  const { image } = req.body;

  let sql =
    "INSERT INTO Book (name, cost, categoryId, authorId, isbn, parutionDate, pageNumber, synopsis, image) VALUES (?,?,?,?,?,?,?,?,?)";
  db.query(
    sql,
    [
      name,
      cost,
      categoryId,
      authorId,
      isbn,
      parutionDate,
      pageNumber,
      synopsis,
      image,
    ],
    (err, result) => {
      if (err) {
        res.status(500).json({
          message: "Une erreur est survenue.",
          err,
        });
      } else {
        res.status(200).json({
          message: "Insertion reussie.",
        });
      }
    }
  );
});

server.get("/books", (req, res) => {
  let sql = "SELECT * FROM Book";

  const page = req.query.page ??  null;
  const pageSize = req.query.pageSize ?? null;
  const offset = (page - 1) * pageSize;

    if (page && pageSize) {
      sql += ` LIMIT ${pageSize} OFFSET ${offset}`;
    }

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Une erreur est survenue.",
        err,
      });
    } else {
      res.send(result);
    }
  });
});

server.put("/books/edit/:index", (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  const { cost } = req.body;
  const { categoryId } = req.body;
  const { authorId } = req.body;
  const { isbn } = req.body;
  const { parutionDate } = req.body;
  const { pageNumber } = req.body;
  const { synopsis } = req.body;
  const { image } = req.body;

  let sql =
    "UPDATE Book SET name = ?, cost = ?, categoryId = ?, authorId = ?, isbn = ?, parutionDate = ?, pageNumber = ?, synopsis = ?, image = ? WHERE id = ?";
  db.query(
    sql,
    [
      name,
      cost,
      categoryId,
      authorId,
      isbn,
      parutionDate,
      pageNumber,
      synopsis,
      image,
      index,
    ],
    (err, result) => {
      if (err) {
        res.status(500).json({
          message: "Une erreur est survenue.",
          err,
        });
      } else {
        res.status(200).json({
          message: "Modification reussie.",
        });
      }
    }
  );
});

server.delete("/books/delete/:index", (req, res) => {
  const { index } = req.params;

  let sql = "DELETE FROM Book WHERE id = ?";
  db.query(sql, [index], (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Une erreur est survenue.",
        err,
      });
    } else {
      res.status(200).json({
        message: "Suppression reussie.",
      });
    }
  });
});
//#endregion

//#region Authors
server.post("/authors/create", (req, res) => {
  const { name } = req.body;

  let sql =
    "INSERT INTO Author (name) VALUES (?)";
  db.query(
    sql,
    [
      name,
    ],
    (err, result) => {
      if (err) {
        res.status(500).json({
          message: "Une erreur est survenue.",
          err,
        });
      } else {
        res.status(200).json({
          message: "Insertion reussie.",
        });
      }
    }
  );
});

server.get("/authors", (req, res) => {
  let sql = "SELECT * FROM Author";
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Une erreur est survenue.",
        err,
      });
    } else {
      res.send(result);
    }
  });
});

server.put("/authors/edit/:index", (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  let sql =
    "UPDATE Author SET name = ? WHERE id = ?";
  db.query(
    sql,
    [
      name,
      index,
    ],
    (err, result) => {
      if (err) {
        res.status(500).json({
          message: "Une erreur est survenue.",
          err,
        });
      } else {
        res.status(200).json({
          message: "Modification reussie.",
        });
      }
    }
  );
});

server.delete("/authors/delete/:index", (req, res) => {
  const { index } = req.params;

  let sql = "DELETE FROM Author WHERE id = ?";
  db.query(sql, [index], (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Une erreur est survenue.",
        err,
      });
    } else {
      res.status(200).json({
        message: "Suppression reussie.",
      });
    }
  });
});
//#endregion

//#region Categories
server.post("/categories/create", (req, res) => {
  const { name } = req.body;

  let sql =
    "INSERT INTO Category (name) VALUES (?)";
  db.query(
    sql,
    [
      name,
    ],
    (err, result) => {
      if (err) {
        res.status(500).json({
          message: "Une erreur est survenue.",
          err,
        });
      } else {
        res.status(200).json({
          message: "Insertion reussie.",
        });
      }
    }
  );
});

server.get("/categories", (req, res) => {
  let sql = "SELECT * FROM Category";
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Une erreur est survenue.",
        err,
      });
    } else {
      res.send(result);
    }
  });
});

server.put("/categories/edit/:index", (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  let sql =
    "UPDATE Category SET name = ? WHERE id = ?";
  db.query(
    sql,
    [
      name,
      index,
    ],
    (err, result) => {
      if (err) {
        res.status(500).json({
          message: "Une erreur est survenue.",
          err,
        });
      } else {
        res.status(200).json({
          message: "Modification reussie.",
        });
      }
    }
  );
});

server.delete("/categories/delete/:index", (req, res) => {
  const { index } = req.params;

  let sql = "DELETE FROM Category WHERE id = ?";
  db.query(sql, [index], (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Une erreur est survenue.",
        err,
      });
    } else {
      res.status(200).json({
        message: "Suppression reussie.",
      });
    }
  });
});
//#endregion


// Only start listening when run directly (e.g. `node index.js`),
// so the app can be imported in unit tests without opening a port.
if (require.main === module) {
  server.listen(3001, () => console.log("Running in the port 3001"));
}

module.exports = server;
