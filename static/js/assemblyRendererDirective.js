(function () {

	var material = new THREE.MeshStandardMaterial( {
		color: '#ff0000',
		metalness: 0,
		roughness: 0,
	} );

  var extrudedSteps = function( group ) {

	    var shape = new THREE.Shape();
	    shape.moveTo( 0, 0 );
	    var numSteps = 3, stepSize = 1;

	    for ( var i = 0; i < numSteps; i ++ ) {

		    shape.lineTo( i * stepSize, ( i + 1 ) * stepSize );
		    shape.lineTo( ( i + 1 ) * stepSize, ( i + 1 ) * stepSize );
		    console.log( )

	    }

	    var extrudeSettings = { amount: 3, bevelEnabled: false };
	    var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

	    var material = new THREE.MeshLambertMaterial( {color: 0xffffff } );
	    var steps = new THREE.Mesh( geometry, material );
	    group.add( steps );

	};


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
            $scope.renderer.setSize( 550, 450 );
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

            $scope.camera.position.z = 5;
          }

          function applySize(width, height){
            $scope.camera.aspect = width /height;
        		$scope.camera.updateProjectionMatrix();
        		$scope.renderer.setSize( width, height );
          }

          function render() {
          	requestAnimationFrame( render );
            $scope.controls.update();
          	$scope.renderer.render( $scope.scene, $scope.camera );
          }

          $scope.applyRender = function(){
            var container = document.getElementById('assemblerRenderContainer');
            applySize(container.offsetWidth, container.offsetHeight);
          }

          init();

          var cube = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), material );
          $scope.scene.add( cube );
          //group = new THREE.Group();
          //$scope.scene.add( group );
          //extrudedSteps( group );

          render();
        }
      };
  });
})();
