(function () {

  function validationClass(value, shouldBeNum){
    if (value === '')return ['invalid'];
    if (shouldBeNum && isNaN(value))return ['invalid'];
    return ['valid'];
  }

    angular.module('welpCAD').directive('newFastenerModal', function(dataService, $rootScope){
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
          return "/newFastenerModal.html"
        },
        link: function($scope, elem, attrs) {
          // scope = either parent scope or its own child scope if scope set.
          // elem = jqLite wrapped element of: root object inside the template, so we can setup event handlers etc
        },
        controller: function($scope) {
          $scope.open = false;
          $scope.typeSelected = 'washer';
          $scope.irVldtn = $scope.orVldtn = $scope.thkVldtn = $scope.nameVldtn = [];
          $scope.name = '';

          $rootScope.$on('new-fastener-modal-open', function(event, args) {
            if (args.typeSelected)$scope.typeSelected = args.typeSelected;
            if (args.cb)$scope.cb = args.cb;
            $scope.open = true;
          });

          $scope.setType = function(t){
            $scope.typeSelected = t;
          }

          $scope.onCancel = function(){
            $scope.open = false;
            $scope.typeSelected = 'washer';
            $scope.irVldtn = $scope.orVldtn = $scope.thkVldtn = $scope.nameVldtn = [];
            $scope.name = $scope.thickness = $scope.innerRadius = $scope.outerRadius = '';
          }

          $scope.onCreate = function(){
            if (valid()){
              var geometry = null;
              if ($scope.typeSelected == 'washer') {
                var arcShape = new THREE.Shape();
        				arcShape.moveTo(Number($scope.outerRadius), 0 );
        				arcShape.absarc( 0, 0, Number($scope.outerRadius)-Number($scope.innerRadius), 0, Math.PI*2, false );
        				var holePath = new THREE.Path();
        				holePath.moveTo( Number($scope.innerRadius), 0 );
        				holePath.absarc( 0, 0, Number($scope.innerRadius), 0, Math.PI*2, true );
        				arcShape.holes.push( holePath );

                geometry = new THREE.ExtrudeGeometry(arcShape, { amount: Number($scope.thickness), bevelEnabled: false });
              }
              $scope.cb($scope.typeSelected, $scope.name, geometry);
              $scope.onCancel();
            }
          }

          //Checks and applies validation classes. Returns true if fields are valid.
          function valid(){
            $scope.irVldtn = $scope.orVldtn = $scope.thkVldtn = $scope.nameVldtn = [];
            $scope.nameVldtn = validationClass($scope.name, false);
            if ($scope.typeSelected == 'washer'){
              $scope.orVldtn = validationClass($scope.outerRadius, true);
              $scope.irVldtn = validationClass($scope.innerRadius, true);
              $scope.thkVldtn = validationClass($scope.thickness, true);
            }
            var combined = $scope.irVldtn.concat($scope.orVldtn, $scope.thkVldtn, $scope.nameVldtn);
            return !combined.includes('invalid');
          };

        }
      };
  });
})();
