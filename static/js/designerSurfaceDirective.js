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
          $scope.paperSurface.view.onKeyDown = canvasKeyDownEvent;
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
            for(var i = 0;i < objs.length; i++){ //iterate through each object in the drawable and paint on an invisible top layer
              var o = objs[i].getDrawable($scope.paperSurface, $scope.defaultDrawableOptions);
              o.opacity = 0;
              if ($scope.selectedName == objs[i].name)o.selected = true;
              $scope.renderElements[objs[i].name] = o;
              $scope.componentLayer.addChild(o);
            }
          }

          function paintMainLayer(){
            $scope.mainLayer.removeChildren();
            $scope.mainObj = $scope.document.getDrawable($scope.paperSurface, $scope.defaultDrawableOptions);
            if ($scope.mainObj)
              $scope.mainLayer.addChild($scope.mainObj);
          }

          function setSelected(objName){
            $scope.selectedName = objName;
            $rootScope.$broadcast('object-selected', {objName: $scope.selectedName});
            highlightObjectByName($scope.selectedName);
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

          function sizeObject(xMove, yMove){
            var o = $scope.document.getObjectByName($scope.selectedName);
            if (!o.getSize)return; // does not support changing the size
            if (yMove) {
              if (!isNaN(o.getSize().height)){
                var size = o.getSize();
                size.height -= -yMove;
                o.setSize(size);
              }
            }
            if (xMove) {
              if (!isNaN(o.getSize().width)){
                var size = o.getSize();
                size.width -= -xMove;
                o.setSize(size);
              }
            }
            console.log(o);
            $scope.$broadcast('document-change');
            $rootScope.$digest();
          }

          function moveObject(xMove, yMove){
            var o = $scope.document.getObjectByName($scope.selectedName);
            if (yMove) {
              if (!isNaN(o.getPosition().y)){
                var pos = o.getPosition();
                pos.y -= -yMove;
                o.setPosition(pos);
              }
            }
            if (xMove) {
              if (!isNaN(o.getPosition().x)){
                var pos = o.getPosition();
                pos.x -= -xMove;
                o.setPosition(pos);
              }
            }
            $scope.$broadcast('document-change');
            $rootScope.$digest();
          }

          $scope.$on('document-change', function(event, args) {
            paint();
          });

          function canvasMouseDownEvent(event){
            $scope.lastPoint = $scope.paperSurface.view.projectToView(event.point);
            var hitResult = $scope.paperSurface.project.hitTest(event.point, hitOptions);
            setSelected(hitResult ? hitResult.item.name : '');
          }
          function canvasMouseDragEvent(event){
            var point = $scope.paperSurface.view.projectToView(event.point);
            var last = $scope.paperSurface.view.viewToProject($scope.lastPoint);
            $scope.paperSurface.view.scrollBy(last.subtract(event.point));
            $scope.lastPoint = point;
          }
          function canvasMousewheelEvent(event){
            $scope.paperSurface.view.scale(1 + (-0.0009 * event.deltaY));
            //$scope.paperSurface.view.center = $scope.paperSurface.view.viewToProject(new $scope.paperSurface.Point(event.layerX, event.layerY));
            return false;
          }
          function canvasKeyDownEvent(event){
            if (!$scope.selectedName)return;
            console.log(event);
            switch (event.key){
              case 'escape': //escape - deselect current element
                setSelected('');
                return;
              case 'e': //edit current element
                var o = $scope.document.getObjectByName($scope.selectedName);
                console.log(o);
                $rootScope.$broadcast('do-obj-edit', {obj: o});
                setSelected('');
                $rootScope.$digest();
                return;
              case 'up':
                event.modifiers.shift
                  ? sizeObject(0, event.modifiers.control ? -1 : -5)
                  : moveObject(0, event.modifiers.control ? -1 : -5)
                return;
              case 'down':
                event.modifiers.shift
                  ? sizeObject(0, event.modifiers.control ?  1 :  5)
                  : moveObject(0, event.modifiers.control ?  1 :  5)
                return;
              case 'left':
                event.modifiers.shift
                  ? sizeObject(event.modifiers.control ? -1 : -5)
                  : moveObject(event.modifiers.control ? -1 : -5)
                return;
              case 'right':
                event.modifiers.shift
                  ? sizeObject(event.modifiers.control ?  1 :  5)
                  : moveObject(event.modifiers.control ?  1 :  5)
                return;
            }
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
