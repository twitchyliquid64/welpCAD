(function () {
    function validationClass(value, shouldBeNum){
      if (value == '')return ['invalid'];
      if (shouldBeNum && isNaN(value))return ['invalid'];
      return ['valid'];
    }


    angular.module('welpCAD').directive('objModal', function(){
      return {
        //scope allows us to setup variable bindings to the parent scope. By default, we share the parent scope. For an isolated one, we should
        //pass an object as the scope attribute which has a dict of the variable name for us, and a string describing where and how to bind it.
        //scope: {color: '@colorAttr'} binds 'color' to the value of color-attr with a one way binding. Only strings supported here: color-attr="{{color}}"
        //scope: {color: '=color'} binds 'color' two way. Pass the object here: color="color".
        scope: {
          open: '=',
          newObjCallback: '&',
          editObjCallback: '&',
          getSuggestedNameCallback: '&',
        },
        //restrict E means its can only be used as an element.
        restrict: 'E',
        templateUrl: function(elem, attr){
          return "/objModal.html"
        },
        link: function($scope, elem, attrs) {
          // scope = either parent scope or its own child scope if scope set.
          // elem = jqLite wrapped element of: root object inside the template, so we can setup event handlers etc
        },
        controller: function($scope) {
          $scope.typeSelected = 'rect';
          $scope.pos = {x: '', y: ''}; //For the inputs
          $scope.size = {width: '', height: ''};
          $scope.name = '';
          $scope.lastSuggestedName = '';

          //Edit mode only
          $scope.isEditMode = false;
          $scope.oldName = '';

          $scope.canvas = document.getElementById('newObjModalCanvas'); //Setup the preview
          $scope.paperSurface = new paper.PaperScope();
          $scope.paperSurface.setup($scope.canvas);
          $scope.paperSurface.settings.insertItems = true;
          $scope.paperSurface.view.onMouseDown = function(event){
            $scope.paperSurface.view.scale(0.97);
          };


          //If no name is set, pick a default one using the callback.
          //Re-paint the object preview to the canvas.
          function paint(){
            if ($scope.lastSuggestedName == $scope.name){
              $scope.name = $scope.lastSuggestedName = $scope.getSuggestedNameCallback({componentType: $scope.typeSelected});
            }

            $scope.paperSurface.project.clear();
            if ($scope.typeSelected == 'rect'){
              $scope.path = new $scope.paperSurface.Path.Rectangle([$scope.paperSurface.view.size.width/4, $scope.paperSurface.view.size.height/4], [$scope.paperSurface.view.size.width/2, 80]);
              $scope.path.strokeColor = 'black';
            }
            else if ($scope.typeSelected == 'circle'){
              $scope.path = new $scope.paperSurface.Path.Circle([$scope.paperSurface.view.size.width/2, $scope.paperSurface.view.size.height/2], 45);
              $scope.path.strokeColor = 'black';
            }
            $scope.paperSurface.project.activeLayer.addChild($scope.path);
          };


          $scope.setType = function(a){
            $scope.typeSelected = a;
            paint();
          };

          //Checks and applies validation classes. Returns true if fields are valid.
          function valid(){
            $scope.xValidation = validationClass($scope.pos.x, true);
            $scope.yValidation = validationClass($scope.pos.y, true);
            $scope.widthValidation = validationClass($scope.size.width, true);
            $scope.heightValidation = validationClass($scope.size.height, true);
            $scope.nameValidation = validationClass($scope.name, false);
            var combined = $scope.xValidation.concat($scope.yValidation, $scope.widthValidation, $scope.heightValidation, $scope.nameValidation);
            return !combined.includes('invalid');
          };

$scope.isEditMode = false;
          //Sets model back to default values
          function reset(){
            $scope.xValidation = $scope.yValidation = $scope.widthValidation = $scope.heightValidation = $scope.nameValidation = [];
            $scope.name = $scope.lastSuggestedName = $scope.getSuggestedNameCallback({componentType: $scope.typeSelected});
            $scope.pos = {x: '', y: ''};
            $scope.size = {width: '', height: ''};
            $scope.isEditMode = false;
          }

          function saveObject(obj){
            if ($scope.isEditMode){
              console.log('editSave', obj, $scope.oldName)
              $scope.editObjCallback({component: obj, oldName: $scope.oldName});
            } else {
              $scope.newObjCallback({component: obj});
            }
          }

          //Called when the 'Create' button is pressed
          $scope.done = function(){
            if (valid()){
              if ($scope.typeSelected == 'rect'){
                saveObject(new Rect($scope.name, $scope.pos, $scope.size));
              }
              $scope.open = false;
              reset();
            }
          }

          // Called when the modal is dismissed
          $scope.onModalComplete = function(){
            console.log('onModalComplete');
            reset();
          }

          // Called from the designerController when it wants us to edit an existing object
          $scope.$on('do-obj-edit', function(event, args) {
            $scope.name = $scope.oldName = args.obj.name;
            $scope.typeSelected = args.obj.componentType;
            $scope.pos = args.obj.getPosition()
            if ($scope.typeSelected == 'rect'){
              $scope.size = args.obj.getSize();
            }
            $scope.isEditMode = true;
            $scope.open = true;
          });

          paint();
        }
      };
  });
})();
