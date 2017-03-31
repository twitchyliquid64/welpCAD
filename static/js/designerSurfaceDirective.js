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
          document: '=',
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
          $scope.canvas.addEventListener('mousewheel', canvasMousewheelEvent, false);
          $scope.paperSurface = new paper.PaperScope();
          $scope.paperSurface.setup($scope.canvas);
          $scope.paperSurface.settings.insertItems = false;
          _initLayers();
          $scope.hasResized = false;
          $scope.paperSurface.view.onMouseDown = canvasMouseDownEvent;
          $scope.paperSurface.view.onMouseDrag = canvasMouseDragEvent;
          $scope.defaultDrawableOptions = {fill: '#ffe0b2'};

          function paint(){
            if(!$scope.hasResized){
              $scope.hasResized = true;
              $scope.paperSurface.view.viewSize = [document.getElementById('designerCanvas').offsetWidth, document.getElementById('designerCanvas').offsetHeight];
            }
            paintComponentLayer();
            paintMainLayer();
          }

          function paintComponentLayer(){
            var objs = $scope.document.getObjs();
            $scope.componentLayer.removeChildren();
            $scope.renderElements = {};
            for(var i = 0;i < objs.length; i++){
              var o = objs[i].getDrawable($scope.paperSurface, $scope.defaultDrawableOptions);
              o.opacity = 0;
              $scope.renderElements[objs[i].name] = o;
              $scope.componentLayer.addChild(o);
            }
          }

          function paintMainLayer(){
            var objs = $scope.document.getObjs();
            $scope.mainLayer.removeChildren();
            $scope.mainObj = undefined;
            for(var i = 0;i < objs.length; i++){
              var o = objs[i].getDrawable($scope.paperSurface, $scope.defaultDrawableOptions);
              if (!$scope.mainObj)
                $scope.mainObj = o;
              else {
                switch (objs[i].getCombinationOperation()){
                  case 'add':
                    $scope.mainObj = $scope.mainObj.unite(o);
                    break;
                }
              }
              console.log(objs[i].getCombinationOperation(), objs[i]);
            }
            if ($scope.mainObj)$scope.mainLayer.addChild($scope.mainObj);
          }

          function highlightObjectByName(objectName){
            for (var property in $scope.renderElements) {
              if ($scope.renderElements.hasOwnProperty(property)) {
                  if(property == objectName){
                    $scope.renderElements[property].selected = true;
                  } else {
                    $scope.renderElements[property].selected = false;
                  }
              }
            }
          }

          $scope.$on('document-change', function(event, args) {
            paint();
          });

          function canvasMouseDownEvent(event){
            $scope.lastPoint = $scope.paperSurface.view.projectToView(event.point);
            var hitResult = $scope.paperSurface.project.hitTest(event.point, hitOptions);
            $scope.selectedName = hitResult ? hitResult.item.name : '';
            $rootScope.$broadcast('object-selected', {objName: $scope.selectedName});
            highlightObjectByName($scope.selectedName);
          }
          function canvasMouseDragEvent(event){
            var point = $scope.paperSurface.view.projectToView(event.point);
            var last = $scope.paperSurface.view.viewToProject($scope.lastPoint);
            $scope.paperSurface.view.scrollBy(last.subtract(event.point));
            $scope.lastPoint = point;
          }
          function canvasMousewheelEvent(event){
            console.log('mousewheel', event);
            $scope.paperSurface.view.scale(1 + (-0.0009 * event.deltaY));
            //$scope.paperSurface.view.center = $scope.paperSurface.view.viewToProject(new $scope.paperSurface.Point(event.layerX, event.layerY));
            return false;
          }

          function _initLayers(){
            $scope.componentLayer = new $scope.paperSurface.Layer();
            $scope.paperSurface.project.addLayer($scope.componentLayer);
            $scope.mainLayer = new $scope.paperSurface.Layer();
            $scope.paperSurface.project.addLayer($scope.mainLayer);
            $scope.componentLayer.moveAbove($scope.mainLayer);
          }
        }
      };
  });
})();
