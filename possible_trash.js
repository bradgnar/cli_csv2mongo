function getConnection(cb) {
  MongoClient.connect("mongodb://localhost:27017", function(err, db) {
    if (err) return cb(err);
    var baserecords = db.collection("baserecords");
    // because we are searching by name, we need an index! without an index, things can get slow
    // if you want to learn more: http://docs.mongodb.org/manual/core/indexes-introduction/
    baserecords.ensureIndex({name: true}, function(err) {
      if (err) return cb(err);
      cb(null, baserecords);
    });
  });
}