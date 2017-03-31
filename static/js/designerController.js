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
      // Called from modal when an edit operation has completed.
      $scope.editObjectCallback = function(component, oldName){
        console.log(component, oldName);
        $scope.document.applyEdit(oldName, component);
        $scope.$broadcast('document-change');
      }

      // Called when the edit button of a component is pressed.
      $scope.edit = function(obj) {
        $scope.$broadcast('do-obj-edit', {obj: obj});
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
