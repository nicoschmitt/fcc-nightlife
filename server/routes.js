(function(){
    
    var register = function(app) {
      app.use('/api/search', require('./api/search'));
      app.use('/api/rsvp', require('./api/rsvp'));
    };
    
    module.exports.register = register;

}());
