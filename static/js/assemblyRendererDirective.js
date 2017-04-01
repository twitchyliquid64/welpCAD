(function () {

  var diffuseColor = new THREE.Color().setHSL( 0, 0.5, 0.5 );
	var material = new THREE.MeshPhysicalMaterial( {
		color: diffuseColor,
		metalness: 0,
		roughness: 0.5,
		clearCoat:  1.0 - 0,
		clearCoatRoughness: 1.0 - 0,
		reflectivity: 1.0 - 0,
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


    angular.module('welpCAD').directive('assemblyRendererDirective', function($rootScope){
      return {
        //scope allows us to setup variable bindings to the parent scope. By default, we share the parent scope. For an isolated one, we should
        //pass an object as the scope attribute which has a dict of the variable name for us, and a string describing where and how to bind it.
        //scope: {color: '@colorAttr'} binds 'color' to the value of color-attr with a one way binding. Only strings supported here: color-attr="{{color}}"
        //scope: {color: '=color'} binds 'color' two way. Pass the object here: color="color".
        scope: {
        },
        //restrict E means its can only be used as an element.
        restrict: 'E',
        template: '<div id="assemblerRenderArea"></div>',
        link: function($scope, elem, attrs) {
          // scope = either parent scope or its own child scope if scope set.
          // elem = jqLite wrapped element of: root object inside the template, so we can setup event handlers etc
        },
        controller: function($scope) {

          function init(){
            $scope.renderArea = document.getElementById('assemblerRenderArea');
            $scope.scene = new THREE.Scene();
            $scope.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
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

            $scope.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040, 4 ) );
    				bulbLight = new THREE.PointLight( 0xffee88, 8, 2000, 2 );
            bulbLight.position.set( 6, 6, 6 );
            $scope.scene.add(bulbLight);
            $scope.camera.position.z = 5;
          }

          function render() {
          	requestAnimationFrame( render );
            $scope.controls.update();
          	$scope.renderer.render( $scope.scene, $scope.camera );
          }

          init();
          var cube = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), material );
          $scope.scene.add( cube );
          group = new THREE.Group();
          $scope.scene.add( group );
          extrudedSteps( group );
          render();
        }
      };
  });
})();
