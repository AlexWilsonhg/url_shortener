const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const validURL = require('valid-url');
const app = express();
require('dotenv').config();

mongoose.connect(process.env.MONGO_DB)

const squishedURLSchema = new mongoose.Schema({
	target_url: String,
});

const SquishedURL = mongoose.model("Squished Url", squishedURLSchema);


app.get("/api/squish", (req, res) => {

	let response = { error : null, url : null };

	if(!req.query.url)
	{
		response.error = "Missing URL parameter.";
	}
	else
	{
		//check if target url is a valid url
		if(validURL.isUri(req.query.url))
		{
			const squished = new SquishedURL({ target_url   : req.query.url});
			squished.save();
			response.url = `${req.headers.host}/api/${squished.id}`
		}
		else
		{
			response.error = "Not a valid URL.";
		}
	}
	res.json(response);
})


app.get("/api/:id", (req, res) => {
	// we're using mongodb ID as url path so check length to avoid db lookup errors
	if(req.params.id.length != 24)
	{
		res.json({ error : "couldnt find url", url : null })
	}
	else 
	{
		SquishedURL.findById(String(req.params.id))
		.then((data) => {
			if(data) 
			{
				res.json({ error : null, url : data.target_url});
			}
			else 
			{
				res.json({ error : "couldnt find url", url : null})
			}
		})
	}
})

app.all("*", (req, res) => {
	res.json({ error : "invalid endpoint"})
})

// Server Init

const hostname = 'localhost';
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, process.env.IP);