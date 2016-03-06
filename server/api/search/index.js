(function(){
    
    var express = require('express');
    var router = express.Router();
    var yelp = require("node-yelp");
    
    var search = function(req, res) {
        
        var yelpclient = yelp.createClient({
            oauth: {
                consumer_key: process.env.YELP_CONSUMER_KEY,
                consumer_secret: process.env.YELP_CONSUMER_SECRET,
                token: process.env.YELP_TOKEN,
                token_secret: process.env.YELP_TOKEN_SECRET
            }
        });
        
        var request = { category_filter: "bars" };
        if (req.params.location.startsWith("ll=")) {
            request.ll =  req.params.location.substring("ll=".length);
            console.log("Search by coord: " + request.ll);
        } else {
            request.location = req.params.location;
            console.log("Search by name: " + request.location);
        }
        
        var defaultImage = "https://s3-media4.fl.yelpcdn.com/assets/srv0/yelp_styleguide/c73d296de521/assets/img/default_avatars/business_90_square.png";
        yelpclient.search(request)
            .then(function(data) {
                var bars = data.businesses.map(function(item){
                    var categories = item.categories.map(function(i) { return i[0]; }).join(", ");
                    return {
                        id: item.id,
                        name: item.name,
                        url: item.url,
                        thumbnail: item.image_url || defaultImage,
                        snippet: item.snippet_text,
                        categories: categories,
                        rating: item.rating,
                        attending: []
                    };
                });
                return res.json(bars);
            }).catch(function(err) {
               res.status(500).send(err); 
            });
    };
    
    /*
    router.get('/', controller.index);
    router.get('/start/:location', controller.startAuth);
    router.get('/:id', controller.show);
    router.post('/', controller.create);
    router.put('/:id', controller.update);
    router.patch('/:id', controller.update);
    router.delete('/:id', controller.destroy);
    */
    router.get('/:location', search);
    
    module.exports = router;
    
}());
