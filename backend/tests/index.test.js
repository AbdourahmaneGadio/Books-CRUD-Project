const mockQuery = jest.fn();

// Replace the real mysql driver with a pool whose query() is a jest mock.
jest.mock("mysql", () => ({
  createPool: jest.fn(() => ({ query: mockQuery })),
}));

const request = require("supertest");
const app = require("../index");

// Makes the mocked pool call its callback with the given error/rows.
// Supports both db.query(sql, cb) and db.query(sql, params, cb) signatures.
const dbResponds = (err, rows) => {
  mockQuery.mockImplementation((sql, params, cb) => {
    if (typeof params === "function") {
      cb = params;
    }
    cb(err, rows);
  });
};

const BOOK = {
  name: "Dom Casmurro",
  cost: 29.9,
  categoryId: 1,
  authorId: 2,
  isbn: "978-85-359-0277-5",
  parutionDate: "1899-01-01",
  pageNumber: 256,
  synopsis: "A classic of Brazilian literature.",
  image: "https://example.com/dom-casmurro.jpg",
};

beforeEach(() => {
  mockQuery.mockReset();
});

describe("POST /", () => {
  it("returns the welcome message", async () => {
    const res = await request(app).post("/");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Bienvenue sur l´API Book CRUD" });
  });
});

describe("Books", () => {
  describe("POST /books/create", () => {
    it("inserts a book and returns success", async () => {
      dbResponds(null, { insertId: 1 });

      const res = await request(app).post("/books/create").send(BOOK);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Insertion reussie." });
      expect(mockQuery).toHaveBeenCalledTimes(1);

      const [sql, params] = mockQuery.mock.calls[0];
      expect(sql).toContain("INSERT INTO Book");
      expect(params).toEqual([
        BOOK.name,
        BOOK.cost,
        BOOK.categoryId,
        BOOK.authorId,
        BOOK.isbn,
        BOOK.parutionDate,
        BOOK.pageNumber,
        BOOK.synopsis,
        BOOK.image,
      ]);
    });

    it("returns 500 when the query fails", async () => {
      dbResponds(new Error("boom"));

      const res = await request(app).post("/books/create").send(BOOK);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Une erreur est survenue.");
    });
  });

  describe("GET /books", () => {
    it("returns all books", async () => {
      const rows = [{ id: 1, name: "Dom Casmurro" }];
      dbResponds(null, rows);

      const res = await request(app).get("/books");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(rows);
      expect(mockQuery).toHaveBeenCalledWith(
        "SELECT * FROM Book",
        expect.any(Function)
      );
    });

    it("applies LIMIT and OFFSET when page and pageSize are provided", async () => {
      dbResponds(null, []);

      await request(app).get("/books?page=2&pageSize=5");

      const [sql] = mockQuery.mock.calls[0];
      expect(sql).toBe("SELECT * FROM Book LIMIT 5 OFFSET 5");
    });

    it("ignores pagination when only one param is provided", async () => {
      dbResponds(null, []);

      await request(app).get("/books?page=2");

      const [sql] = mockQuery.mock.calls[0];
      expect(sql).toBe("SELECT * FROM Book");
    });

    it("returns 500 when the query fails", async () => {
      dbResponds(new Error("boom"));

      const res = await request(app).get("/books");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Une erreur est survenue.");
    });
  });

  describe("PUT /books/edit/:index", () => {
    it("updates a book and returns success", async () => {
      dbResponds(null, { affectedRows: 1 });

      const res = await request(app).put("/books/edit/7").send(BOOK);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Modification reussie." });

      const [sql, params] = mockQuery.mock.calls[0];
      expect(sql).toContain("UPDATE Book SET");
      expect(sql).toContain("WHERE id = ?");
      expect(params[params.length - 1]).toBe("7");
    });

    it("returns 500 when the query fails", async () => {
      dbResponds(new Error("boom"));

      const res = await request(app).put("/books/edit/7").send(BOOK);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Une erreur est survenue.");
    });
  });

  describe("DELETE /books/delete/:index", () => {
    it("deletes a book and returns success", async () => {
      dbResponds(null, { affectedRows: 1 });

      const res = await request(app).delete("/books/delete/7");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Suppression reussie." });
      expect(mockQuery).toHaveBeenCalledWith(
        "DELETE FROM Book WHERE id = ?",
        ["7"],
        expect.any(Function)
      );
    });

    it("returns 500 when the query fails", async () => {
      dbResponds(new Error("boom"));

      const res = await request(app).delete("/books/delete/7");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Une erreur est survenue.");
    });
  });
});

describe("Authors", () => {
  describe("POST /authors/create", () => {
    it("inserts an author and returns success", async () => {
      dbResponds(null, { insertId: 1 });

      const res = await request(app).post("/authors/create").send({ name: "Machado de Assis" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Insertion reussie." });
      expect(mockQuery).toHaveBeenCalledWith(
        "INSERT INTO Author (name) VALUES (?)",
        ["Machado de Assis"],
        expect.any(Function)
      );
    });

    it("returns 500 when the query fails", async () => {
      dbResponds(new Error("boom"));

      const res = await request(app).post("/authors/create").send({ name: "x" });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Une erreur est survenue.");
    });
  });

  describe("GET /authors", () => {
    it("returns all authors", async () => {
      const rows = [{ id: 1, name: "Machado de Assis" }];
      dbResponds(null, rows);

      const res = await request(app).get("/authors");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(rows);
    });

    it("returns 500 when the query fails", async () => {
      dbResponds(new Error("boom"));

      const res = await request(app).get("/authors");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Une erreur est survenue.");
    });
  });

  describe("PUT /authors/edit/:index", () => {
    it("updates an author and returns success", async () => {
      dbResponds(null, { affectedRows: 1 });

      const res = await request(app).put("/authors/edit/3").send({ name: "New name" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Modification reussie." });
      expect(mockQuery).toHaveBeenCalledWith(
        "UPDATE Author SET name = ? WHERE id = ?",
        ["New name", "3"],
        expect.any(Function)
      );
    });

    it("returns 500 when the query fails", async () => {
      dbResponds(new Error("boom"));

      const res = await request(app).put("/authors/edit/3").send({ name: "New name" });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Une erreur est survenue.");
    });
  });

  describe("DELETE /authors/delete/:index", () => {
    it("deletes an author and returns success", async () => {
      dbResponds(null, { affectedRows: 1 });

      const res = await request(app).delete("/authors/delete/3");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Suppression reussie." });
      expect(mockQuery).toHaveBeenCalledWith(
        "DELETE FROM Author WHERE id = ?",
        ["3"],
        expect.any(Function)
      );
    });

    it("returns 500 when the query fails", async () => {
      dbResponds(new Error("boom"));

      const res = await request(app).delete("/authors/delete/3");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Une erreur est survenue.");
    });
  });
});

describe("Categories", () => {
  describe("POST /categories/create", () => {
    it("inserts a category and returns success", async () => {
      dbResponds(null, { insertId: 1 });

      const res = await request(app).post("/categories/create").send({ name: "Fiction" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Insertion reussie." });
      expect(mockQuery).toHaveBeenCalledWith(
        "INSERT INTO Category (name) VALUES (?)",
        ["Fiction"],
        expect.any(Function)
      );
    });

    it("returns 500 when the query fails", async () => {
      dbResponds(new Error("boom"));

      const res = await request(app).post("/categories/create").send({ name: "x" });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Une erreur est survenue.");
    });
  });

  describe("GET /categories", () => {
    it("returns all categories", async () => {
      const rows = [{ id: 1, name: "Fiction" }];
      dbResponds(null, rows);

      const res = await request(app).get("/categories");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(rows);
    });

    it("returns 500 when the query fails", async () => {
      dbResponds(new Error("boom"));

      const res = await request(app).get("/categories");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Une erreur est survenue.");
    });
  });

  describe("PUT /categories/edit/:index", () => {
    it("updates a category and returns success", async () => {
      dbResponds(null, { affectedRows: 1 });

      const res = await request(app).put("/categories/edit/4").send({ name: "Non-fiction" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Modification reussie." });
      expect(mockQuery).toHaveBeenCalledWith(
        "UPDATE Category SET name = ? WHERE id = ?",
        ["Non-fiction", "4"],
        expect.any(Function)
      );
    });

    it("returns 500 when the query fails", async () => {
      dbResponds(new Error("boom"));

      const res = await request(app).put("/categories/edit/4").send({ name: "x" });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Une erreur est survenue.");
    });
  });

  describe("DELETE /categories/delete/:index", () => {
    it("deletes a category and returns success", async () => {
      dbResponds(null, { affectedRows: 1 });

      const res = await request(app).delete("/categories/delete/4");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Suppression reussie." });
      expect(mockQuery).toHaveBeenCalledWith(
        "DELETE FROM Category WHERE id = ?",
        ["4"],
        expect.any(Function)
      );
    });

    it("returns 500 when the query fails", async () => {
      dbResponds(new Error("boom"));

      const res = await request(app).delete("/categories/delete/4");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Une erreur est survenue.");
    });
  });
});
