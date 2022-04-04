const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect("")

const squishedURLSchema = new mongoose.Schema({
	target_url: String,
	squished_url: String
});

const SquishedURL = mongoose.model("Squished Url", squishedURLSchema);

// Request routing

/* 
PATH: /squish
PARAMS: target url to shorten
RETURN: shortened url as json

Look up target url in database
If we find it, return its corresponding shorted url
Else create a new entry in the database with shortened url as uniquely generated id
return shortened url
*/

app.get("/squish", (req, res) => {
	if(!req.query.url)
	{
		res.json({ error : "missing URL parameter" });
	}
	else
	{
		//check if target url is a valid url
		//check if its already in db, return it if so
		//else create new db entry, return squished url
		const id = Math.floor(Math.random()*1000);
		const squished = new SquishedURL({ target_url   : req.query.url, 
										   squished_url : id });
		squished.save();
		res.json({ url : id});
	}
})

app.get("/:id", (req, res) => {
	SquishedURL.findOne({ squished_url : req.params.id })
	.then((data) => {
		if(data) {
			res.json({ url : data.target_url})
		}
		else {
			res.json({ error : "couldnt find url"})
		}
	})
})

// Server Init

const hostname = 'localhost';
const port = 3000;

const server = http.createServer(app);

server.listen(port, hostname);
