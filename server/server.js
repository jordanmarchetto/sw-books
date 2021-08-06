const Koa = require('koa');
const KoaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const KoaJson = require('koa-json');
const { Pool } = require('pg');

//sample db
const DB = { BOOKS: [{ title: "book 1", author: "author lname", completed: true, rating: 2 }, { title: "book 2", author: "fname author", completed: false }] };
//table to reference in db
const TABLE_NAME = "books";

//setup server/router
const server = new Koa();
const router = new KoaRouter();

//load json module, makes output prettier
server.use(KoaJson());
//parser middleware, to parse ctx
server.use(bodyParser());
//router middleware, allow routes
server.use(router.routes()).use(router.allowedMethods());

//set up db connector
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: 'postgres',
    database: 'postgres',
    password: 'postgres', // Password is empty be default
});

//make sure we're connected to the db
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack)
    }
    client.query('SELECT NOW()', (err, result) => {
        release()
        if (err) {
            return console.error('Error executing query', err.stack)
        }
        console.log(result.rows)
    })
})


//get all books from the db
const getAllBooks = async (ctx) => {
    const { rows } = await pool.query(`SELECT * FROM ${TABLE_NAME};`).catch(e => { console.error(e) })
    ctx.body = rows;
}

//get a single book from db, based on book_id
const getBook = async (book_id) => {
    const { rows } = await pool.query(`SELECT * FROM ${TABLE_NAME} WHERE book_id = ${book_id};`);
    return rows[0];
}

//remove a single book from db, based on book_id
const deleteBook = async (book_id) => {
    const { rows } = await pool.query(`DELETE FROM ${TABLE_NAME} WHERE book_id = ${book_id};`);
    return {};
}

//add a single book to the db
const addBook = async (ctx) => {
    const body = ctx.request.body;
    const { title, author, completed, rating } = body;
    const query = `INSERT INTO ${TABLE_NAME} (title, author, completed, rating) VALUES ('${title}', '${author}', '${completed}', '${rating}') RETURNING book_id;`;
    const book_id = await pool.query(query).then(res => res.rows[0].book_id);
    ctx.body = await getBook(book_id);
}

//update a single book
//expects all fields/columns to be populated
const updateBook = async (ctx) => {
    const body = ctx.request.body;
    const { title, author, completed, rating } = body;
    const book_id = ctx.params.book_id;
    const query = `UPDATE ${TABLE_NAME} SET title = '${title}', author = '${author}', completed = '${completed}', rating = '${rating}' WHERE book_id = '${book_id}'`;
    await pool.query(query);
    ctx.body = await getBook(book_id);
}

//define routes
router.get("/books", getAllBooks);
router.get("/books/:book_id", async (ctx) => ctx.body = await getBook(ctx.params.book_id));
router.put("/books/:book_id", updateBook);
router.delete("/books/:book_id", async (ctx) => ctx.body = await deleteBook(ctx.params.book_id));
router.post("/books", addBook);

//start server
const port = process.env.SERVER_PORT || 2222;
server.listen(port, () => console.log(`server listening on http://localhost:${port}`));