(function() {

    var app = angular.module('welpCAD').factory('dataService', ['$rootScope', '$http', '$interval', '$window', dataService]);

    function dataService($rootScope, $http, $interval, $window){
      var self = this;

      //$interval(self.fetchAndApplyDiff, 2000);
      //self.updateComponent('all');
      return self;
    };

})();
