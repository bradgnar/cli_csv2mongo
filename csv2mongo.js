#!/usr/bin/env node

//this is the base setup for the program.  It first reads in the arguments from the user and if not supplied gives
//default namings
console.log('csv2mongo has started');
var userArguments = process.argv.slice(2),
	settings;


if (userArguments.length > 3) {
    throw new Error('Max three arguments may be specified (the full file directory that you want to load in the db)');
}else if(userArguments.length <= 0){
	throw new Error('There needs to be at least a file path specified');
}

settings = {
	file_to_read: userArguments[0],
	db_name: userArguments[1] || 'csv2mongo_db',
	collection_name: userArguments[2] || 'csv2mongo_item'
};



var Mongo = require("mongodb"),
	csv = require("csv"),
	fs = require("fs"),
	mongoose = require("mongoose"),
	MongoClient = Mongo.MongoClient;
settings.schema = mongoose.Schema({
		Column: String,
		D8te: String,
		Time: String,
		Latitude: String,
		Longitude: String,
		WLDepth: String,
		Speed: String,
		Draft: String,
		Temp: String,
		Vessel: String,
		Prev: String,
		Next: String,
		TimeBefore: String,
		TimeAfter: String,
		Pred: String,
		DTBefore: String,
		DTAfter: String,
		DTCurrent: String,
		Loc: String
	}),
	collection = mongoose.model(settings.collection_name, settings.schema);

	mongoose.connect('mongodb://localhost/' + settings.db_name);
	var db = mongoose.connection
	db.on('error', console.error.bind(console, 'connection error'));
	db.once('open', function callback(){
		console.log('connection open');

		csv().from.stream(fs.createReadStream(settings.file_to_read), {columns:true})
			.transform(function(row){
				//console.log(row);
				return row;
			})
			.on('record', function(row, index){



				var newItem = new collection(row);
				newItem.save(function(err, newItem){
					if(err) {
						console.log(err.message);
						return
					}
					console.log('item saved');
				})
				
			})
			.on('end', function(){

				console.log('end hit ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;');

				//this is just to check to see if the Bath data items are getting read in correctly
				collection.find({}, function(err, dataPiece){
					if(err) {console.log(err.message); return;}
					console.log('ITEM FOUND');
					console.log(dataPiece);
				});
			});
	});

	