(function () {

    angular.module('welpCAD')
        .controller('designerController', ['$scope', 'dataService', '$rootScope', '$timeout', designerController]);

    function designerController($scope, dataService, $rootScope, $timeout) {
      var self = this;
      $scope.dataService = dataService;

      $scope.document = new Document();
      $scope.selectedName = '';
      $scope.dirty = false;


      // Called from modal with a new object to be added in.
      $scope.newObjectCallback = function(obj){
        console.log(obj);
        $scope.document.add(obj);
        $scope.$broadcast('document-change');
        $scope.dirty = true;
      }
      // Called from modal when an edit operation has completed.
      $scope.editObjectCallback = function(component, oldName){
        console.log(component, oldName);
        $scope.document.applyEdit(oldName, component);
        $scope.$broadcast('document-change');
        $scope.dirty = true;
      }
      // Called from modal when edit wants a name for a given componentType.
      $scope.suggestNameCallback = function(component){
        return $scope.document.suggestName(component);
      }



      // Invoked when the Add FAB is pressed.
      $scope.newObjButtonPressed = function(){
        $rootScope.$broadcast('open-new-object-modal', {});
      }
      // Invoked when the export DXF FAB is pressed.
      $scope.exportDXFPressed = function(){
        $rootScope.$broadcast('export-design-modal-open', {document: $scope.document});
      }
      // Invoked when the preview button FAB is pressed.
      $scope.previewPressed = function(){
        $rootScope.$broadcast('assembler-preview-path', {
          path: $scope.document.getRenderable({fill: '#ffe0b2'}, {fill: '#ffe0b2'}),
          thickness: $scope.document.thickness || 3,
          color: $scope.document.renderColor || '#ff0000',
        });
        $scope.changePage('assembler');
      }
      // Invoked when the save button FAB is pressed - save to dataService.
      $scope.savePressed = function(){
        $rootScope.$broadcast('design-save', {design: $scope.document});
        $scope.dirty = false;
      }
      // Invoked when the import button FAB is pressed - load JSON design from file.
      $scope.importPressed = function(){
        console.log('a');
        $rootScope.$broadcast('file-open-request', {
          title: 'Open Design',
          onOpen: function(fileObj){
            var obj = loadDocumentFromJsonData(fileObj);
            console.log(obj);
            $scope.document = obj;
            $scope.dirty = true;
            $timeout(function(){
              $scope.$broadcast('document-change');
            }, 400);
          },
        });
      }
      // Invoked when the export button FAB is pressed - save JSON to disk
      $scope.exportPressed = function(){
        var e = $scope.document.getSerializable();
        console.log(e);
        var blob = new Blob([JSON.stringify(e)], {type: "application/json;charset=utf-8"});

        if (!$scope.document.name){
          $rootScope.$broadcast('check-confirmation', {
            title: 'Your Design is unnamed',
            content: 'You have requested an export of a document which has no name. You can set the name in the design menu, which can be accessed with the edit button in the top right of the designer. Would you like to export without a name anyway?',
            actions: [
              {text: 'No'},
              {text: 'Yes', onAction: function(){saveAs(blob, "design.json");}},
              {text: 'Goto Design Menu', onAction: $scope.editDocument},
            ]
          });
        }else {
          saveAs(blob, $scope.document.name + ".json");
        }
      }
      // Invoked when the edit button is pressed on the top right of the page.
      $scope.editDocument = function() {
        $scope.$broadcast('edit-design-open', {});
      }
      // Called when the edit button of a component is pressed.
      $scope.editComponent = function(obj) {
        $scope.$broadcast('do-obj-edit', {obj: obj});
      }
      // Called when the operation indicator is pressed.
      $scope.cycleCombinationOperations = function(obj){
        if ($scope.document.isBaseObject(obj)){
          console.log("Base object must be addition type");
          return;
        }
        $scope.dirty = true;

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
      $rootScope.$on('document-change-model', function(event, args) {
        $scope.dirty = true;
      });
      $rootScope.$on('document-do-save', function(event, args) {
        $scope.savePressed();
        $scope.$digest();
      });

      $rootScope.$on('designer-delete-component', function(event, args) {
        $scope.dirty = true;
        $scope.document.delete(args.name);
        $scope.$broadcast('document-change');
      });

      $rootScope.$on('set-designer-design', function(event, args) {
        $scope.dirty = false;
        $scope.document = args.design;
        $timeout(function(){
          $scope.$broadcast('document-change');
        }, 400);
      });
    }
})();
