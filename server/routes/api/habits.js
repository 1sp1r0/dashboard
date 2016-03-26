'use strict';

// Load the module dependencies
var habit = require('../../controllers/api/habits.js');


// Define the routes module' method
module.exports = function(app) {

  app.post('/habit', habit.create);
  app.get('/habits', habit.list);

}
