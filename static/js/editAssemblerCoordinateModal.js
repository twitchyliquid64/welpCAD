(function () {

    angular.module('welpCAD').directive('editAssemblerCoordinateModal', function($rootScope){
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
          return "/editAssemblerCoordinateModal.html"
        },
        link: function($scope, elem, attrs) {
          // scope = either parent scope or its own child scope if scope set.
          // elem = jqLite wrapped element of: root object inside the template, so we can setup event handlers etc
        },
        controller: function($scope) {
          $scope.open = false;
          $scope.title = 'Edit Coordinate';
          $scope.content = '';
          $scope.coordName = '';
          $scope.pos = 0;
          $scope.rot = 0;

          $rootScope.$on('assembler-edit-coordinates', function(event, args) {
            if (args.title)$scope.title = args.title;
            if (args.content)$scope.content = args.content;
            if (args.onAction)$scope.onAction = args.onAction;

            if (args.pos)$scope.pos = args.pos;
            if (args.rot)$scope.rot = args.rot;
            if (args.coordName)$scope.coordName = args.coordName;
            $scope.open = true;
          });

          $scope.onPress = function(){
            if ($scope.onAction)
              $scope.onAction(Number($scope.pos), Number($scope.rot));
            $scope.onCancel();
          }

          $scope.onCancel = function(){
            $scope.open = false;
            $scope.title = 'Edit Coordinate';
            $scope.content = '';
            $scope.pos = 0;
            $scope.rot = 0;
            $scope.coordName = '';
          }
        }
      };
  });
})();
