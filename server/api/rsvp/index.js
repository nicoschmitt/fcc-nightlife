(function(){
    
    var express = require('express');
    var passport = require('passport');
    var router = express.Router();
    var moment = require("moment");
    
    // register routes
    
    // clean database
    var Rsvp = require('./rsvp.model');
    var today = moment().format("YYYY-MM-DD");
    Rsvp.remove({ when: { $ne: today }}, function(){
        
    })
    
    var getAttending = function(req, res) {
        console.log("Get attending for bar " + req.params.barid);
        
        var barid = req.params.barid;
        Rsvp.findOne({bar: barid, when: today}, function(err, rsvp) {
            if (err) res.status(500).send(err);
            else if (rsvp == null) res.json({ number: 0, detail: [] }); 
            else res.json({ number: rsvp.attending.length, detail: rsvp.attending }); 
        });
    }
    
    var updateAttending = function(req, res) {
        console.log("Update attending for bar " + req.params.barid);
        console.log(req.body);
        
        var barid = req.params.barid;
        Rsvp.findOne({bar: barid, when: today}, function(err, rsvp) {
            if (err) res.status(500).send(err);
            else if  (rsvp == null) {
                rsvp = {
                  bar: barid,
                  when: today,
                  attending: [ req.user.email ]
                };
                Rsvp.create(rsvp, function(err, obj) {
                  if (err) res.status(500).send(err);
                  else res.json({ number: 1, detail: rsvp.attending });
                });
            } else {
                if (rsvp.attending.indexOf(req.user.email) < 0) rsvp.attending.push(req.user.email);
                rsvp.save();
                res.json({ number: rsvp.attending.length, detail: rsvp.attending }); 
            }
        });
    }
    
    var removeAttending = function(req, res) {
        console.log("Remove attending for bar " + req.params.barid);
        console.log(req.body);
        
        var barid = req.params.barid;
        Rsvp.findOne({bar: barid, when: today}, function(err, rsvp) {
            if (err) res.status(500).send(err);
            else if  (rsvp == null) res.json({ number: 0, detail: [] }); 
            else {
                var idx = rsvp.attending.indexOf(req.user.email);
                if (idx >= 0) rsvp.attending.splice(idx, 1);
                rsvp.save();
                res.json({ number: rsvp.attending.length, detail: rsvp.attending }); 
            }
        });
    }
    
    router.get('/:barid', getAttending);
    router.put('/:barid', passport.authenticate('oauth-bearer', { session: false }), updateAttending);
    router.delete('/:barid', passport.authenticate('oauth-bearer', { session: false }), removeAttending);
    /*
    router.get('/start/:location', controller.startAuth);
    router.get('/:id', controller.show);
    router.post('/', controller.create);
    router.patch('/:id', controller.update);
    */
    
    module.exports = router;
    
}());
