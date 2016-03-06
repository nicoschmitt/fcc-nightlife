(function() {
    
    var app = angular.module('votingApp');
  
    app.controller('searchCtrl', ["$scope", '$http', "$location", "$alert", "adalAuthenticationService",
        function ($scope, $http, $location, $alert, adal) {
            var vm = this;
            
            var user = adal.userInfo.profile.email;
            vm.loading = true;
            vm.bars = [];
            vm.message = "";
            
            vm.search = function(location) {
                console.log("Search " + location);
                localStorage.setItem("nico-bar-location", location);
                
                vm.bars = [];
                vm.message = "";
                vm.loading = true;
                
                $http.get("/api/search/" + location).then(function(resp) {
                    // Success
                    vm.loading = false;
                    vm.bars = resp.data;
                    
                    vm.bars.forEach(function(bar) {
                       $http.get("/api/rsvp/" + bar.id).then(function(resp) {
                           // Success
                           console.log(resp.data.detail);
                           bar.attending = resp.data.detail;
                           if (bar.attending.indexOf(user) >= 0) bar.imgoing = true;
                           
                       }, function(resp) {
                           // Error
                           console.log(resp.data);
                           
                       }) 
                    });
                    
                }, function(resp) {
                    // Error
                    vm.loading = false;
                    vm.message = resp.data;
                    console.log(resp.data);
                    
                });  
            };
            
            vm.letsgo = function(bar) {
                console.log("Update rsvp for " + bar.id);
                if (bar.imgoing) {
                    $http.delete("/api/rsvp/" + bar.id).then(function(resp) {
                       // success
                       bar.imgoing = false;
                       bar.attending = resp.data.detail;
                       
                    }, function(resp) {
                       // error
                       console.log(resp.data);
                       
                    });
                } else {
                    $http.put("/api/rsvp/" + bar.id).then(function(resp) {
                       // success
                       bar.imgoing = true;
                       bar.attending = resp.data.detail;
                       
                    }, function(resp) {
                       // error
                       console.log(resp.data);
                       
                    });
                }
            };
            
            var previous = localStorage.getItem("nico-bar-location");
            if (previous) {
                // user has already done a search, let's search on the same location
                vm.search(previous);
            } else if ("geolocation" in navigator) {
                // try to get user location
                navigator.geolocation.getCurrentPosition(function(pos) {
                    var loc = "ll=" + pos.coords.latitude + "," + pos.coords.longitude;
                    vm.search(loc);
                });
            }
            
            $scope.$on("search", function(event, args) {
                vm.search(args);
            })
        }
    ]);
  
}());
