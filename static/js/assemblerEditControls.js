(function () {

    angular.module('welpCAD').directive('assemblerEditControls', function($rootScope){
      return {
        //scope allows us to setup variable bindings to the parent scope. By default, we share the parent scope. For an isolated one, we should
        //pass an object as the scope attribute which has a dict of the variable name for us, and a string describing where and how to bind it.
        //scope: {color: '@colorAttr'} binds 'color' to the value of color-attr with a one way binding. Only strings supported here: color-attr="{{color}}"
        //scope: {color: '=color'} binds 'color' two way. Pass the object here: color="color".
        scope: {

        },
        //restrict E means its can only be used as an element.
        restrict: 'E',
        templateUrl: function(elem, attr){
          return "/assemblerEditControls.html?cache=1"
        },
        link: function($scope, elem, attrs) {
          // scope = either parent scope or its own child scope if scope set.
          // elem = jqLite wrapped element of: root object inside the template, so we can setup event handlers etc
        },
        controller: function($scope) {
          $scope.obj = null;
          $scope.selection = null;

          $scope.componentSelected = function(){
            return $scope.selection && $scope.obj;
          }

          $scope.increaseX = function(amt){
            $scope.obj.x += amt;
            $rootScope.$broadcast('assembly-translate-object', {x: amt, name: $scope.selection});
          }
          $scope.increaseY = function(amt){
            $scope.obj.y += amt;
            $rootScope.$broadcast('assembly-translate-object', {y: amt, name: $scope.selection});
          }
          $scope.increaseZ = function(amt){
            $scope.obj.z += amt;
            $rootScope.$broadcast('assembly-translate-object', {z: amt, name: $scope.selection});
          }
          $scope.rotateX = function(theta){
            var val = THREE.Math.degToRad(theta);
            $scope.obj.orientationx += val;
            $rootScope.$broadcast('assembly-rotate-object', {x: val, name: $scope.selection});
          }
          $scope.rotateY = function(theta){
            var val = THREE.Math.degToRad(theta);
            $scope.obj.orientationy += val;
            $rootScope.$broadcast('assembly-rotate-object', {y: val, name: $scope.selection});
          }
          $scope.rotateZ = function(theta){
            var val = THREE.Math.degToRad(theta);
            $scope.obj.orientationz += val;
            $rootScope.$broadcast('assembly-rotate-object', {z: val, name: $scope.selection});
          }
          $scope.conv = function(c){
            return THREE.Math.radToDeg(c);
          }

          $scope.delete = function(){
            $rootScope.$broadcast('assembly-delete-object', {name: $scope.selection});
            $scope.obj = null;
            $scope.selection = null;
          }

          $scope.name = function(){
            var newName = prompt("Enter the new name for '" + $scope.obj.name + "'");
            if (newName) {
              $rootScope.$broadcast('assembly-rename-object', {newName: newName, name: $scope.selection});
              $scope.obj = null;
              $scope.selection = null;
            }
          }

          $scope.editX = function(){
            $rootScope.$broadcast('assembler-edit-coordinates', {title: 'Edit X Co-ordinates',
            pos: $scope.obj.x,
            rot: THREE.Math.radToDeg($scope.obj.orientationx),
            coordName: "X",
            onAction: function(pos, rot){
              $scope.obj.x = pos;
              $scope.obj.orientationx = THREE.Math.degToRad(rot);
              $rootScope.$broadcast('assembly-coords-changed-object', {name: $scope.selection});
            }});
          }

          $scope.editY = function(){
            $rootScope.$broadcast('assembler-edit-coordinates', {title: 'Edit Y Co-ordinates',
            pos: $scope.obj.y,
            rot: THREE.Math.radToDeg($scope.obj.orientationy),
            coordName: "Y",
            onAction: function(pos, rot){
              $scope.obj.y = pos;
              $scope.obj.orientationy = THREE.Math.degToRad(rot);
              $rootScope.$broadcast('assembly-coords-changed-object', {name: $scope.selection});
            }});
          }

          $scope.editZ = function(){
            $rootScope.$broadcast('assembler-edit-coordinates', {title: 'Edit Z Co-ordinates',
            pos: $scope.obj.z,
            rot: THREE.Math.radToDeg($scope.obj.orientationz),
            coordName: "Z",
            onAction: function(pos, rot){
              $scope.obj.x = pos;
              $scope.obj.orientationz = THREE.Math.degToRad(rot);
              $rootScope.$broadcast('assembly-coords-changed-object', {name: $scope.selection});
            }});
          }

          $scope.$on('assembly-selection-changed', function(event, args){
            console.log('assembly-selection-changed');
            $scope.selection = args.name;
            $scope.obj = args.obj;
          });
        }
      };
  });
})();
