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
          $scope.typeSelected = 'rectangle';

          $scope.pos = {x: '', y: ''}; //For the inputs
          $scope.size = {width: '', height: ''};
          $scope.name = '';

          $scope.canvas = document.getElementById('newObjModalCanvas'); //Setup the preview
          $scope.paperSurface = new paper.PaperScope();
          $scope.paperSurface.setup($scope.canvas);

          function paint(){ //For the preview
            $scope.paperSurface.project.clear();
            if ($scope.typeSelected == 'rectangle'){
              $scope.path = new $scope.paperSurface.Path.Rectangle([$scope.paperSurface.view.size.width/4, $scope.paperSurface.view.size.height/4], [$scope.paperSurface.view.size.width/2, 80]);
              $scope.path.strokeColor = 'black';
            }
            else if ($scope.typeSelected == 'circle'){
              $scope.path = new $scope.paperSurface.Path.Circle([$scope.paperSurface.view.size.width/2, 60], 45);
              $scope.path.strokeColor = 'black';
            }
          };
          $scope.paperSurface.view.onMouseDown = function(event){
            $scope.paperSurface.view.scale(0.97);
          };


          $scope.setType = function(a){
            $scope.typeSelected = a;
            paint();
          };

          $scope.done = function(){
            $scope.xValidation = validationClass($scope.pos.x, true);
            $scope.yValidation = validationClass($scope.pos.y, true);
            $scope.widthValidation = validationClass($scope.size.width, true);
            $scope.heightValidation = validationClass($scope.size.height, true);
            $scope.nameValidation = validationClass($scope.name, false);
            var combined = $scope.xValidation.concat($scope.yValidation, $scope.widthValidation, $scope.heightValidation, $scope.nameValidation);
            if (!combined.includes('invalid')){
              //Do callback
              $scope.open = false;
            }
          }

          paint();
        }
      };
  });
})();
