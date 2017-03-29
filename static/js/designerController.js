(function () {

    angular.module('welpCAD')
        .controller('designerController', ['$scope', 'dataService', designerController]);

    function designerController($scope, dataService) {
      var self = this;
      $scope.dataService = dataService;

      self.canvas = document.getElementById('designerCanvas');
      self.paperSurface = new paper.PaperScope();
      self.paperSurface.setup(self.canvas);
      self.paperSurface.settings.insertItems = false;

      $scope.newObjectModalOpen = false;

      $scope.newObj = function(){
        $scope.newObjectModalOpen = true;
      }
    }
})();
