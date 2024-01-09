const express = require('express');
const morgan = require('morgan');
const oracledb = require('oracledb');
const router = require('express-promise-router')();
oracledb.outFormat = oracledb.OBJECT;
oracledb.autoCommit = true;
const cors = require('cors');

// Database Connection
let connection;


async function db_query(query, params) {
    try {
        if (!connection) {
            connection = await oracledb.getConnection({
                user: 'C##APURBO',
                password: 'BUET2105057',
                connectString: 'localhost/orcl'
            });
        }

        let result = await connection.execute(query, params);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}



const app = express();
app.use(express.json());
app.use(router);
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
    res.json("Hello, this is the backend");
    console.log("Client connected");
});


app.get('/books', async (req, res) => {
    console.log("Sending books");
    const q = "SELECT * FROM C##APURBO.BOOK";
    const params = [];

    try {
        const result = await db_query(q, params);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



app.post('/books', async (req, res) => {

    console.log("Inserting books");
    const q = "INSERT INTO C##APURBO.BOOK(ID,NAME,GENRE,PRICE,IMAGE) VALUES(:ID,:NAME,:GENRE,:PRICE,:IMAGE)";


    const params = {
        ID: req.body.ID,
        NAME : req.body.NAME,
        GENRE: req.body.GENRE,
        PRICE: req.body.PRICE,
        IMAGE: req.body.IMAGE
    };

    connection = await oracledb.getConnection({
        user: 'C##APURBO',
        password: 'BUET2105057',
        connectString: 'localhost/orcl'
    });


    connection.execute(q, params);
    // connection.commit();
    res.json("inserted");
    console.log("inserted");
});

app.delete('/books/:id', async (req, res) => {
    console.log("Deleting book with id: " + req.params.id);
    const q = "DELETE FROM C##APURBO.BOOK WHERE ID = :ID";

    const binds = {
        ID: req.params.id
    }


    connection = await oracledb.getConnection({
        user: 'C##APURBO',
        password: 'BUET2105057',
        connectString: 'localhost/orcl'
    });

    connection.execute(q, binds);

    res.json("deleted");
    console.log("deleted");

});



app.put('/books/:id',async(req,res)=>{
    console.log("Updating book with id: "+req.params.id);
    const q = "UPDATE C##APURBO.BOOK SET NAME=:NAME,GENRE = :GENRE, PRICE = :PRICE, IMAGE = :IMAGE WHERE ID = :ID";

    const binds = {
        ID: req.params.id,
        NAME: req.body.NAME,
        GENRE: req.body.GENRE,
        PRICE: req.body.PRICE,
        IMAGE: req.body.IMAGE
    }



    connection = await oracledb.getConnection({
        user: 'C##APURBO',
        password: 'BUET2105057',
        connectString: 'localhost/orcl'
    });

    connection.execute(q, binds);

    res.json("updated");
    console.log("updated");

});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});





