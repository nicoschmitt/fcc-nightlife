(function(){
    
    var mongoose = require('mongoose');
    var shortid = require("shortid");

    var Rsvp = mongoose.model("Rsvp", new mongoose.Schema({ 
        _id: {
            type: String,
            unique: true,
            'default': shortid.generate
        },
        when: String,
        bar: { type: String, index: true },
        attending: [String],
    }));
        
    module.exports = Rsvp;
    
}());
