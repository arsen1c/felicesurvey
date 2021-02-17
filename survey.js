const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// [+] MiddleWares [+]
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
// accept application/json format
app.use(bodyParser.json());

// MySQL config
const pool = mysql.createPool({
	connectionLimit: 10,
	host            : process.env.DB_HOST_LOCAL,
    user            : process.env.DB_USER_LOCAL,
    password        : process.env.DB_PASS_LOCAL,
    database        : process.env.DB_LOCAL
});

// Root
app.get('', (req, res) => {
	res.render('index');
})

// Get All Surveys
app.get('/survey/all', (req, res) => {
	if (req.query.admin === 'true') {
		pool.getConnection((err, connection) => {
			if (err) throw err;
			console.log(`connected as id ${connection.threadId}`);

			connection.query('SELECT * FROM surveys', (err, rows) => {
				connection.release() // return the connection to the pool
				// rows.forEach(survey => console.log(survey));
				if (!err) {
					res.render('all', { data: rows });
				} else {
					console.log(err);
					res.render('all', { err: 'Failed to load surveys' })
				}
			});
		});
	} else {
		res.send("UNAUTHORIZED!")
	}
});


// Get a survery by id
app.get('/survey/id/:id', (req, res) => {
	// Look for "?admin" parameter in the URL
	const isAdmin = req.query.admin;
	if (isAdmin === 'true') {
			pool.getConnection((err, connection) => {
			if (err) throw err;
			console.log(`connected as id ${connection.threadId}`);

			connection.query('SELECT * FROM surveys WHERE id = ?', [req.params.id], (err, rows) => {
				connection.release();

				if (!err) {
					res.render('single', { survey: rows });
				} else {
					console.log("ERROR GETTING SURVERY BY ID: ", err);
				}
			});
		});
	} else {
		res.send("Unauthorized!")
	}

});


// Add a new survey
app.post('/survey/add', (req, res) => {
	// const body = req.body;
	// console.log(body);
	
	pool.getConnection((err, connection) => {
		if (err) throw err;
		console.log(`connected as id ${connection.threadId}`);

		const date = new Date();
		const params = req.body;
		params.created_at = date;
		console.log(params);
		console.log("PARAMS:", params);
		// Adding data into the DB
		connection.query('INSERT INTO surveys SET ?', params, (err, rows) => {
			connection.release();

			if (!err) {
				res.render("succes");
			} else {
				console.log("ERRO ADDING NEW SURVEY: ", err);
				res.send("There was an error adding your feedback!");
			}
		})
	});
});


// Delete a survey
app.delete("/delete/survey/id/:id", (req, res) => {
	pool.getConnection((err, connection) => {
		if (err) throw err;
		console.log(`connected as id ${connection.threadId}`);

		connection.query("DELETE FROM surveys WHERE id = ?", [req.params.id], (err, rows) => {
			connection.release(); 

			if (!err) {
				res.send(`Survey with the record id ${req.params.id} deleted`)
				// res.redirect('/sruveys/all');
			} else {
				console.log("ERROR DELETING:", err);
				// res.render('all', { message: 'Error Deleting the Survey!' });
			}
		})
	})
})

// Send 404 if endpoint is invalid
app.use((req, res) => {
	res.status(404).render('404')
})

// Run the server
app.listen(port, () => {
	console.log('Listening on port 3000!');
})