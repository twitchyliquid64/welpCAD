(function () {

    angular.module('welpCAD')
        .controller('homeController', ['$scope', 'dataService', '$rootScope', homeController]);

    function homeController($scope, dataService, $rootScope) {
      $scope.dataService = dataService;

      $scope.projectsInHistory = function() {
        return $scope.dataService.projectsInHistory;
      };

      $scope.loadProject = function(name) {
        $scope.dataService.loadFromHistory(name);
      };

      $scope.loadDesign = function(designName){
        if ($scope.dataService.loadDesign(designName))
          $scope.changePage('designer');
      };

      $scope.loadAssembly = function(assemblyName){
        if ($scope.dataService.loadAssembly(assemblyName))
          $scope.changePage('assembler');
      };

      $scope.importPressed = function(){
        $rootScope.$broadcast('file-open-request', {
          title: 'Open Project',
          content: 'If a project is already open, it will be closed.',
          onOpen: function(fileObj){
            $scope.dataService._deserializeToModel(JSON.parse(fileObj));
          },
        });
      };

      $scope.exportPressed = function() {
        var blob = new Blob([JSON.stringify($scope.dataService._getProjectSerialized())], {type: "application/json;charset=utf-8"});
        saveAs(blob, $scope.dataService.projectName + ".json");
      };

      $scope.newDesign = function() {
        var name = prompt("Enter a name for your design");
        if (!name)return;
        $scope.dataService.saveDesign(new Document(name));
        $scope.dataService.loadDesign(name);
        $scope.changePage('designer');
      };

      $scope.newAssembly = function() {
        var name = prompt("Enter a name for your assembly");
        if (!name)return;
        $scope.dataService.saveAssembly(new Assembly(name));
      };

      $scope.newProject = function() {
        if ($scope.dataService.projectOpen()) {
          $scope.dataService.save();
        }
        var name = prompt($scope.dataService.projectOpen() ? "Enter a name for your project. NOTE: This will save and close your current project." : "Enter a name for your project.");
        if (!name)return;
        $scope.dataService.init(name);
        $scope.dataService.save();
      };
    }
})();
