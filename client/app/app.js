/* global angular */
(function() {
  var app = angular.module('votingApp', [ 'ngRoute', 'AdalAngular', "ngAnimate", "mgcrea.ngStrap" ]);
  
  app.config(["adalAppId", '$routeProvider','$httpProvider', 'adalAuthenticationServiceProvider',
    function (adalAppId, $routeProvider, $httpProvider, adalProvider) {
   
      $routeProvider.when("/Home", {
        templateUrl: "/app/views/search.html",
        controller: "searchCtrl",
        controllerAs: "vm"

      }).otherwise({ redirectTo: "/Home" });
      
      adalProvider.init({
        instance: 'https://login.microsoftonline.com/', 
        tenant: 'common',
        clientId: adalAppId
    }, $httpProvider );

  }]);

  fetchData().then(launchApplication);

  function fetchData() {
    var initInjector = angular.injector(["ng"]);
    var $http = initInjector.get("$http");
    return $http.get("/api/config").then(function(resp){
      app.constant("adalAppId", resp.data.adalAppId);
    });
  };

  function launchApplication() {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ["votingApp"]);
    });
  };

}());
