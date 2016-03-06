(function(){
    
    var express = require('express');
    var router = express.Router();
    
    var getConfig = function(req, res) {
      res.json({ 
          adalAppId: process.env.MS_APP_ID 
      });
    };
    
    router.get('/*', getConfig);
    
    module.exports = router;
    
}());
