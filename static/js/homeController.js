(function () {

    angular.module('welpCAD')
        .controller('homeController', ['$scope', 'dataService', homeController]);

    function homeController($scope, dataService) {
      var self = this;
      $scope.dataService = dataService;
    }
})();
