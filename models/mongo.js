var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/ifs");

// create Schema instance
var mongo_Schema = mongoose.Schema;
var geodata_Schema = {
	"type" : String,
	"coordinates" : Array
};

// create model if none exists
module.exports = mongoose.model("geodata", geodata_Schema);
