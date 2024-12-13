// Source : https://github.com/nailtonvital/react-node-mysql-crud/blob/master/server/index.js

const express = require('express');
const server = express();
const mysql = require('mysql');
const cors = require('cors');

// Swagger UI
const swaggerSetup = require('./swagger');

// Middleware pour Swagger
swaggerSetup(server);

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "nailton123",
    database: process.env.DB_NAME || "crudgames",
});

server.use(express.json());
server.use(cors());

/**
 * @swagger
 * /books/create:
 *   post:
 *     summary: Crée un nouveau livre
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               auteur:
 *                 type: string
 *     responses:
 *       200:
 *         description: Livre créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
server.post("/books/create", (req, res) => {
    const {title} = req.body;
    const {synopsis} = req.body;
    const {authorId} = req.body;
    const {price} = req.body;
    const {isbn} = req.body;
    const {pageNum} = req.body;
    const {categoryId} = req.body;

    let sql = "INSERT INTO Books (title, synopsis, authorId, price, isbn, pageNum, categoryId) VALUES (?,?,?,?,?,?,?)"
    db.query(sql, [title, synopsis, authorId, price, isbn, pageNum, categoryId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            console.log(result);
            res.status(200).send(result);
        }
    })
});

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Récupère tous les livres disponibles
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Liste de tous les livres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   titre:
 *                     type: string
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
server.get("/books", (req, res) => {
    let sql = "SELECT * FROM Books";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            console.log(result);
            res.status(200).send(result);
        }
    })
});


/**
 * @swagger
 * /books/edit:
 *   put:
 *     summary: Édite toutes les données du livre
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 titre:
 *                   type: string
 *                 auteur:
 *                   type: string
 *     responses:
 *       200:
 *         description: Toutes les données de livres ont été éditées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
server.put("/books/edit", (req, res) => {
    const {id} = req.body;
    const {title} = req.body;
    const {synopsis} = req.body;
    const {authorId} = req.body;
    const {price} = req.body;
    const {isbn} = req.body;
    const {pageNum} = req.body;
    const {categoryId} = req.body;

    let sql = "UPDATE Books SET title = ?, synopsis = ?, authorId = ?, price = ?, isbn = ?, pageNum = ?, categoryId = ? WHERE id = ?";
    db.query(sql, [title, synopsis, authorId, price, isbn, pageNum, categoryId, id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            console.log(result);
            res.status(200).send(result);
        }
    })
});

/**
 * @swagger
 * /books/delete:{index}:
 *   delete:
 *     summary: Supprime un livre spécifique
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: index
 *         required: true
 *         schema:
 *           type: integer
 *         description: Index du livre à supprimer
 *     responses:
 *       200:
 *         description: Livre supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
server.delete("/books/delete/:index", (req, res) => {
    const {index} = req.params

    let sql = "DELETE FROM Books WHERE id = ?"
    db.query(sql, [index], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            console.log(result);
            res.status(200).send(result);
        }
    })
})
server.listen(3001, () =>
    console.log("Running in the port 3001")
);