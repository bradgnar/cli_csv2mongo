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
	BathDataItem = mongoose.model('BathDataItem', bathSchema)
	first = new BathDataItem({
		Column: "666",
		D8te: "666",
		Time: "666",
		Latitude: "666",
		Longitude: "666",
		WLDepth: "666",
		Speed: "666",
		Draft: "666",
		Temp: "666",
		Vessel: "666",
		Prev: "666",
		Next: "666",
		TimeBefore: "666",
		TimeAfter: "666",
		Pred: "666",
		DTBefore: "666",
		DTAfter: "666",
		DTCurrent: "666",
		Loc: "666"
	});

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
				BathDataItem.find({Column: /^5/}, function(err, dataPiece){
					if(err) {console.log(err.message); return;}
					console.log('ITEM FOUND');
					console.log(dataPiece);
				});
			});
	});

	// mongoose.connect('mongodb://localhost/test');
	// var db = mongoose.connection;
	// db.on('error', console.error.bind(console, 'connection error'));
	// db.once('open', function callback(){
	// 	console.log('connection open');

	// });

	// first.save(function(err,first){
	// 	if(err) {console.log(err.message);
	// 		return;
	// 	}		
	// 	console.log('item save');
	// });

	// BathDataItem.find({Column: /^6/},function(err, dataPiece){
	// 	if(err) {console.log(err.message);
	// 		return;
	// 	}

	// 	console.log('item found');
		
	// });

// var transform = fs.createTransformStream();


// csvThing.from.stream(fs.createReadStream('/home/bradgnar/grad_project/cli_csv2mongo/smallDB5.csv'), {columns: true})
	
// 	.to.path('/home/bradgnar/grad_project/cli_csv2mongo/smallDB5Output.out')
// 	.on('record', function(row, index){
// 		console.log('#' + index + ' ' + JSON.stringify(row));
// 	})
// 	.on('end', function(count){
// 		console.log('Number of lines:' + count);
// 	})
// 	.on('error', function(err){
// 		console.log(err.message);
// 	});


// var Converter=require("csvtojson").core.Converter;
// var csvConverter=new Converter(false); // The parameter false will turn off final result construction. It can avoid huge memory consumption while parsing. The trade off is final result will not be populated to end_parsed event.

// var readStream=require("fs").createReadStream("/home/bradgnar/grad_project/cli_csv2mongo/smallDB5.csv"); 

// var writeStream=require("fs").createWriteStream("/home/bradgnar/grad_project/cli_csv2mongo/outpuData.json");

// var started=false;
// csvConverter.on("record_parsed",function(rowJSON){
//    if (started){
//       writeStream.write(",\n");
//    }
//    writeStream.write(JSON.stringify(rowJSON));  //write parsed JSON object one by one.
//    if (started==false){
//       started=true;
//    }
// });

// writeStream.write("[\n"); //write array symbol

// csvConverter.on("end_parsed",function(){
//    writeStream.write("\n]"); //end array symbol
// });

// csvConverter.from(readStream);

// mongoose.connect('mongodb://localhost/test');
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error'));
// db.once('open', function callback(){
// 	console.log('connection open');


// 	var Converter=require("csvtojson").core.Converter;
// 	var csvConverter=new Converter(false); // The parameter false will turn off final result construction. It can avoid huge memory consumption while parsing. The trade off is final result will not be populated to end_parsed event.

// 	var readStream=require("fs").createReadStream("/home/bradgnar/grad_project/cli_csv2mongo/smallDB5.csv"); 

// 	var writeStream=require("fs").createWriteStream("/home/bradgnar/grad_project/cli_csv2mongo/outpuData2.json");

// 	var started=false;
// 	csvConverter.on("record_parsed",function(rowJSON){
// 	   if (started){
// 	      writeStream.write(",\n");
// 	   }
// 	   writeStream.write(JSON.stringify(rowJSON));  //write parsed JSON object one by one.
// 	   if (started==false){
// 	      started=true;
// 	   }
// 	});

// 	//writeStream.write("[\n"); //write array symbol

// 	csvConverter.on("end_parsed",function(){
// 	  // writeStream.write("\n]"); //end array symbol
// 	});

// 	csvConverter.from(readStream);

// });

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
	file_to_read = userArguments[0];//'/home/bradgnar/grad_project/cli_csv2mongo/smallDB5.csv'

}else{
	throw new Error('There needs to be at least a file path specified');
}

process.stdin.setEncoding('utf8')

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

	