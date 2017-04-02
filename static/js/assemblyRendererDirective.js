(function () {

		var material = new THREE.MeshStandardMaterial( {
			color: '#ff0000',
			metalness: 0,
			roughness: 0,
		} );

    angular.module('welpCAD').directive('assemblyRendererDirective', function($rootScope, $timeout){
      return {
        //scope allows us to setup variable bindings to the parent scope. By default, we share the parent scope. For an isolated one, we should
        //pass an object as the scope attribute which has a dict of the variable name for us, and a string describing where and how to bind it.
        //scope: {color: '@colorAttr'} binds 'color' to the value of color-attr with a one way binding. Only strings supported here: color-attr="{{color}}"
        //scope: {color: '=color'} binds 'color' two way. Pass the object here: color="color".
        scope: {
        },
        //restrict E means its can only be used as an element.
        restrict: 'E',
        template: '<div id="assemblerRenderContainer" style="height: 80%;"><div id="assemblerRenderArea"></div></div>',
        link: function($scope, elem, attrs) {
          // scope = either parent scope or its own child scope if scope set.
          // elem = jqLite wrapped element of: root object inside the template, so we can setup event handlers etc
        },
        controller: function($scope) {

          function init(){
            $scope.renderArea = document.getElementById('assemblerRenderArea');
            $scope.scene = new THREE.Scene();
            $scope.camera = new THREE.PerspectiveCamera( 75, 550 / 450.0, 0.1, 1000 );
            $scope.renderer = new THREE.WebGLRenderer({ antialias: true });
            //$scope.renderer.setSize( 550, 450 );
            $scope.renderer.setClearColor( 0xffffff );
            $scope.renderer.gammaInput = true;
    				$scope.renderer.gammaOutput = true;
    				$scope.renderer.toneMapping = THREE.ReinhardToneMapping;
            $scope.renderer.physicallyCorrectLights = true;
    				$scope.renderer.toneMappingExposure = 3;
            $scope.renderArea.appendChild( $scope.renderer.domElement );

            $scope.controls = new THREE.TrackballControls( $scope.camera, $scope.renderer.domElement );
    				//$scope.controls.minDistance = 200; //$scope.controls.maxDistance = 500;

            $scope.ambientLight = new THREE.AmbientLight( 0x000000 );
      			$scope.scene.add( $scope.ambientLight );

      			$scope.lights = [];
      			$scope.lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
      			$scope.lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
      			$scope.lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );
      			$scope.lights[ 0 ].position.set( 0, 200, 0 );
      			$scope.lights[ 1 ].position.set( 100, 200, 100 );
      			$scope.lights[ 2 ].position.set( - 100, - 200, - 100 );
      			$scope.scene.add( $scope.lights[ 0 ] );
      			$scope.scene.add( $scope.lights[ 1 ] );
      			$scope.scene.add( $scope.lights[ 2 ] );

            $scope.camera.position.z = 550;
            $scope.mainMeshes = new THREE.Group();
            $scope.scene.add( $scope.mainMeshes );
          }

          function applySize(width, height){
            $scope.camera.aspect = width /height;
        		$scope.camera.updateProjectionMatrix();
        		$scope.renderer.setSize( width, height );
          }

          function render() {
          	requestAnimationFrame( render );
            $scope.controls.update();
            if ($scope.startingGraphic)
              $scope.startingGraphic.rotation.y += 0.01;
          	$scope.renderer.render( $scope.scene, $scope.camera );
          }

          //Called with meshes to render
          $scope.applyRender = function(meshes){
            if ($scope.startingGraphic){
              $scope.scene.remove($scope.startingGraphic);
              $scope.startingGraphic = undefined;
							$timeout(function(){
								var container = document.getElementById('assemblerRenderContainer');
								applySize(container.offsetWidth, container.offsetHeight);
							}, 500);
            }

            for (var i = $scope.mainMeshes.children.length - 1; i >= 0; i--) {
                $scope.mainMeshes.remove($scope.mainMeshes.children[i]);
            }
            for (var i = 0; i < meshes.length; i++)
              $scope.mainMeshes.add(meshes[i]);
          }



          $scope.$on('resize-assembler-renderer', function(event, args) {
            var container = document.getElementById('assemblerRenderContainer');
            applySize(container.offsetWidth, container.offsetHeight);
          });
          $scope.$on('render-only', function(event, args) {
            var shapes = args.path.toShapes(true);
            var solid = new THREE.ExtrudeGeometry(shapes, { amount: args.amount || 3, bevelEnabled: false });
            var mesh = new THREE.SceneUtils.createMultiMaterialObject(solid, [material]);
            $scope.applyRender([mesh]);
          });




          init();

          var loader = new THREE.FontLoader();
         loader.load('/fonts/helvetiker_regular.typeface.json', function (res) {
           var tx = new THREE.TextGeometry('welpCAD', {font: res});
           THREE.GeometryUtils.center( tx );
           $scope.startingGraphic = new THREE.Mesh( tx, material );
           $scope.scene.add( $scope.startingGraphic );
         });

          render();
        }
      };
  });
})();
