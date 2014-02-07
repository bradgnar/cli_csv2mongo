var Mongo = require("mongodb"),
	csv = require("csv"),
	fs = require("fs"),
	MongoClient = Mongo.MongoClient,
	csvThing = new csv();


csvThing.from.stream(fs.createReadStream('/home/bradgnar/grad_project/cli_csv2mongo/smallDB5.csv'))
	.to.path('/home/bradgnar/grad_project/cli_csv2mongo/smallDB5Output.out')
	.transform(function(row){
		row.unshift(row.pop());
		return row;
	})
	.on('record', function(row, index){
		console.log('#' + index + ' ' + JSON.stringify(row));
	})
	.on('end', function(count){
		console.log('Number of lines:' + count);
	})
	.on('error', function(err){
		console.log(err.message);
	});