var app = angular.module('welpCAD', ['ui.materialize']);

app.controller('BodyController', ["$scope", 'dataService', function ($scope, dataService) {
    $scope.page = "home";
    $scope.dataService = dataService;
    $scope.changePage = function(pageName){
        $scope.page = pageName;
    };
}]);
