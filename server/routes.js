(function(){
    
    var register = function(app) {
      app.use('/api/search', require('./api/search'));
      app.use('/api/bars', require('./api/bar'));
    };
    
    module.exports.register = register;

}());
