cli_csv2mongo
=============

This will be a command line interface that will take a csv file from somewhere in the system and load it into mongodb as json objects

You can run the program with the command

	node csv2mongo

It will need at least one, but most likely 3 arguments.
	
	ARGUMENTS:
		1) The first argument should be the full file path for the file you want to read in -NOTE: it must be a csv file.
		2) The second argument is the db name for file.  If you don't enter this argument it will default to csv2mongo_db.
		3) The third argument is the name of the collection. This should be singular, but note that when you look up the collection it will be changed to the plural form of whatever you wrote.  This is because csv2mongo uses mongoose and mongoose automatically pluralizes the "model" name.  If you do not enter this argument it will automatically be defaulted to csv2mongo_item, and will show up in the db as a collection named csv2mongo_items.


