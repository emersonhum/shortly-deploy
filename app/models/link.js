var db = require('../config');
// var crypto = require('crypto');

var Schema = db.Schema;

var linkSchema = new Schema({ 
  url: String, 
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
  createdAt: Date
});

var Link = db.model('Link', linkSchema);





module.exports = Link;








// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });
