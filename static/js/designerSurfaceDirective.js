(function () {

    var hitOptions = {
    	segments: true,
    	stroke: true,
    	fill: true,
    	tolerance: 5
    };

    angular.module('welpCAD').directive('designerSurfaceDirective', function($rootScope){
      return {
        //scope allows us to setup variable bindings to the parent scope. By default, we share the parent scope. For an isolated one, we should
        //pass an object as the scope attribute which has a dict of the variable name for us, and a string describing where and how to bind it.
        //scope: {color: '@colorAttr'} binds 'color' to the value of color-attr with a one way binding. Only strings supported here: color-attr="{{color}}"
        //scope: {color: '=color'} binds 'color' two way. Pass the object here: color="color".
        scope: {
          objs: '=',
        },
        //restrict E means its can only be used as an element.
        restrict: 'E',
        templateUrl: function(elem, attr){
          return "/designerSurfaceDirective.html"
        },
        link: function($scope, elem, attrs) {
          // scope = either parent scope or its own child scope if scope set.
          // elem = jqLite wrapped element of: root object inside the template, so we can setup event handlers etc
        },
        controller: function($scope) {
          $scope.canvas = document.getElementById('designerCanvas');
          $scope.canvas.style.width ='100%';
          $scope.canvas.style.height='100%';
          $scope.paperSurface = new paper.PaperScope();
          $scope.paperSurface.setup($scope.canvas);
          $scope.paperSurface.settings.insertItems = false;
          $scope.hasResized = false;
          $scope.paperSurface.view.onMouseDown = function(event) {
            var hitResult = $scope.paperSurface.project.hitTest(event.point, hitOptions);
            $scope.selectedName = hitResult ? $scope.namesById[hitResult.item._id] : '';
            $rootScope.$broadcast('object-selected', {objName: $scope.selectedName});
          }

          function paint(){
            if(!$scope.hasResized){
              $scope.hasResized = true;
              $scope.paperSurface.view.viewSize = [document.getElementById('designerCanvas').offsetWidth, document.getElementById('designerCanvas').offsetHeight];
            }

            $scope.paperSurface.project.clear();
            $scope.renderElements = {};
            $scope.namesById = {};
            for(var i = 0;i < $scope.objs.length; i++){
              var o = $scope.objs[i].getDrawable($scope.paperSurface);
              $scope.renderElements[$scope.objs[i].name] = o;
              $scope.namesById[o._id] = $scope.objs[i].name;
              $scope.paperSurface.project.activeLayer.addChild(o);
            }
          }

          $scope.$on('document-change', function(event, args) {
            paint();
          });
        }
      };
  });
})();
