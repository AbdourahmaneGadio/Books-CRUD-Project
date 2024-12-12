// Source : https://github.com/nailtonvital/react-node-mysql-crud/blob/master/server/index.js

const express = require('express');
const server = express();
const mysql = require('mysql');
const cors = require('cors');

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "nailton123",
    database: process.env.DB_NAME || "crudgames",
});

server.use(express.json());
server.use(cors());

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