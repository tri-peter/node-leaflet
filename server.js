var express = require("express");
var app = express();
var body_Parser = require("body-parser");
var router = express.Router();
var mongo_Op = require("./models/mongo");

app.use(body_Parser.json());
app.use(body_Parser.urlencoded({"extended" : false}));

router.get("/", function(req, res){
	res.sendfile("./public/index.html");
});

router.route("/coords")
	.get(function(req, res){
		var response = {};
		// fetch all data from collection
		mongo_Op.find({}, function(err, data){
			if(err){
				response = {"error" : true, "message" : "Error fetching data."};
			}else{
				response = {"error" : false, "message" : data};
			}
			res.json(response);
		});
	})
	.post(function(req, res){
		var db = new mongo_Op();
		var response = {};
		// fetch REST request
		db.type = req.body.type;
		db.coordinates = req.body.coordinates
		// save() will run insert() command of MongoDB
		// it will add new data to collection
		db.save(function(err){
			if(err){
				response = {"error" : true, "message" : "Error adding data"};
			} else {
				response = {"error" : false, "message" : "Data added successfully."};
			}
			res.json(response);
		});
	});

router.route("/coords/:id")
	.get(function(req, res){
		var response = {};
		// this runs a Mongo Query to fetch data based on ID
		mongo_Op.findById(req.params.id, function(err, data){
			if(err){
				response = {"error" : true, "message" : "Error fetching data."};
			}else{
				response = {"error" : false, "message" : data};
			}
			res.json(response);
		});
	})
	.put(function(req, res){
		var response = {};
		// first check document exists
		// if exists update document
		mongo_Op.findById(req.params.id, function(err, data){
			if(err){
				response = {"error" : true, "message" : "Error fetching data"};
			}else{
				// no error
				// change data
				if(req.body.type !== undefined){
					data.type = req.body.type;
				}
				if(req.body.coordinates !== undefined){
					data.coordinates = req.body.coordinates
				}
				// save the data
				data.save(function(err){
					if(err){
						response = {"error" : true, "message" : "Error updating data"};
					}else{
						response = {"error" : false, "message" : "Data updated for " + req.params.id};
					}
					res.json(response);
				})
			}
		});
	})
	.delete(function(req, res){
		var response = {};
		// find the data
		mongo_Op.findById(req.params.id, function(err, data){
			if(err){
				response = {"error" : true, "message" : "Error fetching data"};
			}else{
				// data exists, remove it
				mongo_Op.remove({"_id" : req.params.id}, function(err){
					if(err){
						response = {"error" : true, "message" : "Error deleting data."};
					}else{
						response = {"error" : false, "message" : "Data assosciated with " + req.params.id + "has been deleted."};
					}
					res.json(response);
				});
			}
		});
	});

app.use("/", router);

var port = 3333
app.listen(port);
console.log("Listening on PORT " + port);
