(function() {
  'use strict';

  var app = angular.module('application', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
   app.controller('FilmsCtrl',
  ["$scope", "$state", "$http",function($scope, $state, $http){
  $scope = genericController($scope, $state, $http, 'films', 'film');
  
  app.controller('SpeciesCtrl', function($scope, $state, $http){
  $scope = genericController($scope, $state, $http, 'species', 'specie');
})
app.controller('PlanetsCtrl', function($scope, $state, $http){
  $scope = genericController($scope, $state, $http, 'planets', 'planet');
})
app.controller('PeopleCtrl', function($scope, $state, $http){
  $scope = genericController($scope, $state, $http, 'people', 'person');
})
app.controller('StarshipsCtrl', function($scope, $state, $http){
  $scope = genericController($scope, $state, $http, 'starships', 'starship');
})

}])  // Ensure you don't end in a semicolon, because more
     // actions are to follow.
	 
	 .filter('capitalize', function() {
  // Send the results of this manipulating function
  // back to the view.
  return function (input) {
    // If input exists, replace the first letter of
    // each word with its capital equivalent.
    return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g,
      function(txt){return txt.charAt(0).toUpperCase() +
        txt.substr(1)}) : '';
  }
})
.filter('lastdir', function () {
  // Send the results of this manipulating function
  // back to the view.
  return function (input) {
    // Simple JavaScript to split and slice like a fine chef.
    return (!!input) ? input.split('/').slice(-2, -1)[0] : '';
  }
})
.directive("getProp", ['$http', '$filter', function($http, $filter) {
  return {
    // All we're going to display is the scope's property variable.
    template: "{{property}}",
    scope: {
      // Rather than hard-coding 'name' as in 'person.name', we may need
      // to access 'title' in some instances, so we use a variable (prop) instead.
      prop: "=",
      // This is the swapi.co URL that we pass to the directive.
      url: "="
    },
    link: function(scope, element, attrs) {
      // Make our 'capitalize' filter usable here
      var capitalize = $filter('capitalize');
      // Make an http request for the 'url' variable passed to this directive
      $http.get(scope.url, { cache: true }).then(function(result) {
        // Get the 'prop' property of our returned data so we can use it in the template.
        scope.property = capitalize(result.data[scope.prop]);
      }, function(err) {
        // If there's an error, just return 'Unknown'.
        scope.property = "Unknown";
      });
    }
  }
}])
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider'];
 

  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run() {
    FastClick.attach(document.body);
  }
  
  function genericController($scope, $state, $http, multiple, single) {
	  // Grab URL parameters - this is unique to FFA, not standard for
  // AngularJS. Ensure $state is included in your dependencies list
  // in the controller definition above.
  $scope.id = ($state.params.id || '');
  $scope.page = ($state.params.p || 1);

  // If we're on the first page or page is set to default
  if ($scope.page == 1) {
    if ($scope.id != '') {
      // We've got a URL parameter, so let's get the single entity's
      // data from our data source
      $http.get("http://swapi.co/api/"+multiple+"/"+$scope.id,
          {cache: true })
        .success(function(data) {
          // If the request succeeds, assign our data to the 'single'
          // variable, passed to our page through $scope
          $scope[single] = data;
        })

    } else {
      // There is no ID, so we'll show a list of all multiple.
      // We're on page 1, so the next page is 2.
      $http.get("http://swapi.co/api/"+multiple+"/", { cache: true })
        .success(function(data) {
          $scope[multiple] = data;
          if (data['next']) $scope.nextPage = 2;
        });
    }
  } else {
    // Once again, there is no ID, so we'll show a list of all multiple.
    // If there's a next page, let's add it. Otherwise just add the
    // previous page button.
    $http.get("http://swapi.co/api/"+multiple+"/?page="+$scope.page,
      { cache: true }).success(function(data) {
        $scope[multiple] = data;
        if (data['next']) $scope.nextPage = 1*$scope.page + 1;
      });
      $scope.prevPage = 1*$scope.page - 1;
  }
  return $scope;
  }

})();
