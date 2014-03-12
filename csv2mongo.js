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
	collection_name: userArguments[2] || 'csv2mongo_item',
	schema: undefined
};

//After getting the basic settings the user will be prompted to enter in a schema
// if the user does not enter in a schema the program will try to make a default schema



var Mongo = require("mongodb"),
	csv = require("csv"),
	fs = require("fs"),
	mongoose = require("mongoose"),
	MongoClient = Mongo.MongoClient,
	collection;// = mongoose.model(settings.collection_name, settings.schema);

	mongoose.connect('mongodb://localhost/' + settings.db_name);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error'));
	db.once('open', function callback(){
		console.log('connection open');

		csv().from.stream(fs.createReadStream(settings.file_to_read), {columns:true})			
			.transform(function(row){				
				return row;
			})
			.once('record', function(row, index){				
				if(!settings.schema){
					console.log('creating schema');

					settings.schema = {};					
					for(k in row){
					 	settings.schema[k] = String;
					}
					collection = mongoose.model(settings.collection_name, settings.schema);
				}
				

			})
			.on('record', function(row, index){

				var newItem = new collection(row);
				newItem.save(function(err, newItem){
					if(err) {
						console.log(err.message);
						return
					}
					//console.log('item saved');
				});
				
			})
			.on('end', function(){
				console.log('end hit ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;');

				//this is just to check to see if the Bath data items are getting read in correctly
				collection.find({}, function(err, dataPiece){
					if(err) {console.log(err.message); return;}
					// console.log('ITEM FOUND');
					// console.log(dataPiece);
				});
			});
	});

	