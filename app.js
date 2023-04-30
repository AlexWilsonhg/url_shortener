const http = require('http');
const express = require('express');
const validURL = require('valid-url');
const app = express();
require('dotenv').config();


app.all("*", (req, res) => {
	res.json({ error : "invalid endpoint"})
})

// Server Init

const port = process.env.PORT;
const host = process.env.IP;

const server = http.createServer(app);

server.listen(port, host);