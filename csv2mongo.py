import csv
from pymongo import MongoClient, GEO2D 

client = MongoClient('localhost', 27017)
db = client.project_db
db.soundings.remove()
db.soundings.create_index([("loc", GEO2D)])


def createSoundingObj(row):
	return {
		"loc": map(float,[row[4],row[3]]),
		"Column": row[0],
		"Date": row[1],
		"Time": row[2],
		"WLDepth": row[5],
		"Speed": row[6],
		"Draft": row[7],
		"Temp": row[8],
		"Vessel": row[9],
		"Prev": row[10],
		"Next": row[11],
		"TimeBefore": row[12],
		"TimeAfter": row[13],
		"Pred": row[14],
		"DTBefore": row[15],
		"DTAfter": row[16],
		"DTCurrent": row[17],
		}

with open('/home/bradgnar/grad_project/DB5_Baltimore_calc.csv', 'rb') as csvfile:
    csvreader = csv.reader(csvfile, delimiter=',')
    for row in csvreader:
    		obj = createSoundingObj(row)
    		db.soundings.insert(obj)