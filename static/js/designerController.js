(function () {

    angular.module('welpCAD')
        .controller('designerController', ['$scope', 'dataService', '$rootScope', designerController]);

    function designerController($scope, dataService, $rootScope) {
      var self = this;
      $scope.dataService = dataService;

      $scope.newObjectModalOpen = false;
      $scope.document = new Document();
      $scope.selectedName = '';

      // Invoked when the Add FAB is pressed.
      $scope.newObjButtonPressed = function(){
        $scope.newObjectModalOpen = true;
      }

      // Called from modal with a new object to be added in.
      $scope.newObjectCallback = function(obj){
        console.log(obj);
        $scope.document.add(obj);
        $scope.$broadcast('document-change');
      }

      $scope.getIcon = function(obj){
        if (obj.name == $scope.selectedName){
          return 'send';
        }
        return obj.icon;
      }

      $rootScope.$on('object-selected', function(event, args) {
        console.log('selected', args);
        $scope.selectedName = args.objName;
        $scope.$digest();
      });
    }
})();
