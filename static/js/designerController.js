(function () {

    angular.module('welpCAD')
        .controller('designerController', ['$scope', 'dataService', '$rootScope', designerController]);

    function designerController($scope, dataService, $rootScope) {
      var self = this;
      $scope.dataService = dataService;

      $scope.newObjectModalOpen = false;
      $scope.document = new Document();
      $scope.selectedName = '';


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



      // Invoked when the Add FAB is pressed.
      $scope.newObjButtonPressed = function(){
        $scope.newObjectModalOpen = true;
      }
      // Invoked when the preview button is pressed.
      $scope.previewPressed = function(){
        $rootScope.$broadcast('assembler-preview-path', {path: $scope.document.getRenderable({fill: '#ffe0b2'}, {fill: '#ffe0b2'})});
        $scope.changePage('assembler');
      }
      // Invoked when the save button is pressed - save to dataService.
      $scope.savePressed = function(){
        var e = $scope.document.getSerializable();
        console.log(e);
        $rootScope.$broadcast('design-save', {design: e});
      }
      // Invoked when the export button is pressed - save to disk
      $scope.exportPressed = function(){
        var e = $scope.document.getSerializable();
        console.log(e);
        var blob = new Blob([JSON.stringify(e)], {type: "application/json;charset=utf-8"});
        saveAs(blob, $scope.document.name + ".json");
      }
      // Called when the edit button of a component is pressed.
      $scope.edit = function(obj) {
        $scope.$broadcast('do-obj-edit', {obj: obj});
      }
      // Called when the operation indicator is pressed.
      $scope.cycleCombinationOperations = function(obj){
        if ($scope.document.isBaseObject(obj)){
          console.log("Base object must be addition type");
          return;
        }

        switch (obj.combinationOperation){
          case "add":
            obj.combinationOperation = 'sub';
            break;
          case "sub":
            obj.combinationOperation = 'add';
            break;
        }
        $scope.$broadcast('document-change');
      }

      $scope.getIcon = function(obj){
        if (obj.name == $scope.selectedName){
          return 'play_arrow';
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
