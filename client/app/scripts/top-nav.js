(function() {
    
  var app = angular.module('votingApp');
  
  app.directive("topNav", ['adalAuthenticationService', "$location", "$rootScope",
    function (adalProvider, $location, $rootScope) {
        
        var topNavCtrl = function() {
          var vm = this;
          
          vm.searchText = "";
          
          vm.login = function() {
            adalProvider.login();
          };
          
          vm.logout = function() {
            adalProvider.logout();
          };
          
          vm.getUsername = function() {
              var auth = adalProvider.userInfo.isAuthenticated;
              return (auth && adalProvider.userInfo.profile.name) || "";
          };
               
          vm.isActive = function(viewLocation) { 
            return viewLocation === $location.path();
          };
          
          vm.search = function() {
            $rootScope.$broadcast("search", vm.searchText);
          };
        };
        
        return {
           restrict: 'E',
           templateUrl: "/app/views/top-nav.html",
           controller: topNavCtrl,
           controllerAs: "nav"
        };
  }]);
  
  
}());
