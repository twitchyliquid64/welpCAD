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

      $scope.deleteDesign = function(){
        $rootScope.$broadcast('select-design-modal-open', {title: 'Delete Design', onSelect: function(name){
          $scope.dataService.deleteDesign(name);
        }});
      };

      $scope.deleteAssembly = function(){
        $rootScope.$broadcast('select-assembly-modal-open', {title: 'Delete Assembly', onSelect: function(name){
          $scope.dataService.deleteAssembly(name);
        }});
      };

      $scope.deleteObject = function(){
        $rootScope.$broadcast('select-object-modal-open', {title: 'Delete Object', onSelect: function(name){
          $scope.dataService.deleteObject(name);
        }});
      };

      $scope.deleteProject = function(){
        $rootScope.$broadcast('check-confirmation', {
          title: 'Really delete the current project?',
          content: 'You have requested to permanently delete the project ' + $scope.dataService.projectName + '. Are you fuckin sure?',
          actions: [
            {text: 'No'},
            {text: 'Yes', onAction: function(){$scope.dataService.deleteCurrent();}},
          ]
        });
      }

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

      $scope.newFastenerObject = function() {
        $rootScope.$broadcast('new-fastener-modal-open', {
          cb: function(typeSelected, name, geometry){
            console.log(typeSelected, name, geometry);
            var newObj = new ProjectObject(name, JSON.stringify(geometry.toJSON()))
            $scope.dataService.saveObject(newObj);
          }
        });
      }

      $scope.titleClick = function(){
        if ($scope.dataService.projectOpen()) {
          var n = prompt("New name for project:");
          if (n) {
            $scope.dataService.projectName = n;
          }
        }
      }

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
