var mongoose = require("mongoose"),
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


	BathDataItem.find({Column: /^5/}, function(err, dataPiece){
		if(err) {console.log(err.message); return;}
		console.log('ITEM FOUND');
		console.log(dataPiece);
	});
});