const express = require("express");
const router = express.Router();
const knex = require("../db/config");

/**  
  * @swagger
  * components:
  *     schemas:
  *         Book:
  *             type: object
  *             required:
  *                 - title
  *                 - author
  *             properties:
  *                 id:
  *                     type: string
  *                     description: The auto-generated ID of the book.
  *                 title:
  *                     type: string
  *                     description: The book title
  *                 author:
  *                     type: string
  *                     description: The book author
  *             example:
  *                 title: The Subtle Art of Not Giving a F.
  *                 author: Mark Manson
  */

/**
 * @swagger
 * tags:
 *  name: Books
 *  description: The books managing API.
 */ 

/**
 * @swagger
 * /books:
 *      get:
 *          summary: Returns the list of all the books.
 *          tags: [Books]
 *          responses:
 *              200:
 *                  description: The list of the books.
 *              500:
 *                  description: Internal server error.
 *  
 */ 

router.get("/", (req, res) => {
    knex.select().from("books").then((books, err) => {
        if(err) return res.send(err);
        return res.send(books);
    })
});

/**
 * @swagger
 * /books/{id}:
 *  get:
 *      summary: Get the book by ID.
 *      tags: [Books]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The book ID.
 *      responses:
 *          200: 
 *              description: The book description by ID.
 *              contents:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Book'
 *          404:
 *              description: The book was not found.
 *          500:
 *              description: Internal server error.
 * 
 */ 

router.get("/:id", (req, res) => {
    knex.select().from("books").where({id: req.params.id}).then((book, err) => {
        if(err) return res.status(500).send(err);
        if(book.length === 0) return res.status(404).send("Book not found.");
        return res.send(book);
    })
});

/**
 * @swagger
 * /books:
 *  post:
 *      summary: Create a new book.
 *      tags: [Books]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Book'
 *      responses:
 *          201:
 *              description: The book was successfully created.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Book'
 *          500:
 *              description: Internal server error.
 */  

router.post("/", (req, res) => {
    return knex("books").insert({
        title: req.body.title,
        author: req.body.author
    })
    .then((saved, err) => {
        if(err) return res.status(500).send(err);
        return res.status(201).send(`${req.body.title} added!`);
    });
});

/**
 * @swagger
 * /books/{id}:
 *  put:
 *      summary: Update the book by the ID.
 *      tags: [Books]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The book ID.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Book'
 *      responses:
 *          201:
 *              description: The book was updated.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Book'
 *          404:
 *              description: The book was not found.
 *          500:
 *              description: Internal server error.
 * 
 */

router.put("/:id", async (req, res) => {
    const bookRecord = await knex.select().from("books").where({ id: req.params.id })

    if(bookRecord.length === 0){
        return res.status(400).send("Book not found.");
    }

    return knex("books").update({
        title: req.body.title,
        author: req.body.author
    })
    .where({id: bookRecord[0].id})
    .then((saved, err) => {
        if(err) return res.status(500).send(err);
        return res.status(201).send(req.body)
    })
});

/**
 * @swagger
 * /books/{id}:
 *  delete:
 *      summary: Remove the book by ID.
 *      tags: [Books]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The book ID.
 *      responses:
 *          200:
 *              description: The book was deleted.
 *          404:
 *              description: The book was not found.
 *          500:
 *              description: Internal server error.
 * 
 */

router.delete("/:id", async (req, res) => {
    const bookRecord = await knex.select().from("books").where({ id: req.params.id })

    if(bookRecord.length === 0){
        return res.status(404).send("Book not found.");
    }

    return knex("books").del().where({id: req.params.id}).then((book, err) => {
        if(err) return res.status(500).send(err)
        return res.status(201).send("Book has been deleted")
    })
})

module.exports = router;