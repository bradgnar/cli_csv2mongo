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

	mongoose.connect('mongodb://localhost/test');
	var db = mongoose.connection
	db.on('error', console.error.bind(console, 'connection error'));
	db.once('open', function callback(){
		console.log('connection open');

		csv().from.stream(fs.createReadStream('/home/bradgnar/grad_project/cli_csv2mongo/smallDB5.csv'), {columns:true})
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
			})
			.on('end', function(){
				//this is just to check to see if the Bath data items are getting read in correctly
				BathDataItem.find({Column: /^5/}, function(err, dataPiece){
					if(err) {console.log(err.message); return;}
					console.log('ITEM FOUND');
					console.log(dataPiece);
				});
			});
	});

	