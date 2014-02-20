#!/usr/bin/env node
console.log('csv2mongo has started');
var userArguments = process.argv.slice(2),
	db_name, file_to_read; 

if (userArguments.length > 2) {
    throw new Error('Max two argument may be specified (the full file directory that you want to load in the db)');
}else if(userArguments.length === 2){
	db_name = userArguments[0];
	file_to_read = userArguments[1];
}else if (userArguments.length === 1) {
	db_name = 'csv2mongo_db';
	file_to_read = userArguments[0];
}else{
	throw new Error('There needs to be at least a file path specified');
}


var Mongo = require("mongodb"),
	csv = require("csv"),
	fs = require("fs"),
	mongoose = require("mongoose"),
	MongoClient = Mongo.MongoClient,
	bathSchema = mongoose.Schema({
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
	BathDataItem = mongoose.model('BathDataItem', bathSchema);

	mongoose.connect('mongodb://localhost/' + db_name);
	var db = mongoose.connection
	db.on('error', console.error.bind(console, 'connection error'));
	db.once('open', function callback(){
		console.log('connection open');

		csv().from.stream(fs.createReadStream(file_to_read), {columns:true})
			.transform(function(row){
				//console.log(row);
				return row;
			})
			.on('record', function(row, index){

				var newItem = new BathDataItem(row);
				newItem.save(function(err, newItem){
					if(err) {
						console.log(err.message);
						return
					}
					console.log('item saved');
				})
				// var query = {Column: row.Column};
				// row.Vessel = "zzzzzzzzzzzzzzzzzzzzzzzzzzz";
				// console.log(row);
				// BathDataItem.update(query, row, {upsert: true},function(err, numEff){
				// 	if(err) console.log(err.message);

				// 	console.log(numEff);
				// });
			})
			.on('end', function(){

				console.log('end hit ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;');

				//this is just to check to see if the Bath data items are getting read in correctly
				BathDataItem.find({}, function(err, dataPiece){
					if(err) {console.log(err.message); return;}
					console.log('ITEM FOUND');
					console.log(dataPiece);
				});
			});
	});

	