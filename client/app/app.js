(function() {
  var app = angular.module('votingApp', [ 'ngRoute', 'AdalAngular', "ngAnimate", "mgcrea.ngStrap" ]);
  
  app.config(['$routeProvider','$httpProvider', 'adalAuthenticationServiceProvider',
    function ($routeProvider, $httpProvider, adalProvider) {
   
      $routeProvider.when("/Home", {
        templateUrl: "/app/views/search.html",
        controller: "searchCtrl",
        controllerAs: "vm"

      }).otherwise({ redirectTo: "/Home" });

      adalProvider.init({
          instance: 'https://login.microsoftonline.com/', 
          tenant: 'common',
          clientId: '1df5b6d8-8dba-4d27-9ee9-8c83cfc4e798'
      }, $httpProvider );
        
  }]);
  
}());
