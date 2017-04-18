function parseDetailsForMaxMin(details) {
  var minx = 0;
  var miny = 0;
  var maxx = 0;
  var maxy = 0;
  var hasHadCoords = false;

  var checkCoord = function(x,y){
    if (!hasHadCoords) {
      minx = x;
      maxx = x;
      miny = y;
      maxy = y;
    }

    hasHadCoords = true;
    if (x < minx)minx = x;
    if (x > maxx)maxx = x;
    if (y < miny)miny = y;
    if (y > maxy)maxy = y;
  }

  for (var i = 0; i < details.length; i++) {
    switch (details[i].type) {
      case 'line':
        checkCoord(details[i].start.x, details[i].start.y);
        checkCoord(details[i].end.x, details[i].end.y);
        break;
    }
  }

  return {minx: minx, maxx: maxx, miny: miny, maxy: maxy};
}


function dxf_wrapInputWithSectionDeclaration(inp){
  var out = "";
  out += "0\n";
  out += "SECTION\n";
  out += inp;
  out += "0\n";
  out += "ENDSEC\n";
  return out;
}

function genDxfHeader(bounds){
  var unit = 4;//4==mm, 1==in, 2==ft, 5==cm, 6==m.

  var out = "";
  out += "2\n";
  out += "HEADER\n";

  out += "9\n"
  out += "$INSUNITS\n";
  out += "70\n";
  out += String(unit) + "\n";

  //lmn-laser utility seems to do this:
  out += "9\n"
  out += "$MEASUREMENT\n";
  out += "70\n";
  out += "1\n";

  return dxf_wrapInputWithSectionDeclaration(out);
}

function genDxfEntityForDetail(bounds, detail){
  var s = '';
  var layer = 0;//default layer
  var op = detail;
  switch (op.type) {

    case 'line':
      s += '0\n';
      s += "LINE\n";
      s += "8\n";
      s += String(layer) + "\n";

      s += "10\n";
      s += String(op.start.x) + "\n";
      s += "20\n";
      s += String(op.start.y) + "\n";
      s += "11\n";
      s += String(op.end.x) + "\n";
      s += "21\n";
      s += String(op.end.y) + "\n";
      break;

    // case 'circle':
    //   s += '0\n';
    //   s += "CIRCLE\n";
    //   s += "8\n";
    //   s += String(layer) + "\n";
    //
    //   s += "10\n";
    //   s += String(op.x) + "\n";
    //   s += "20\n";
    //   s += String(op.y) + "\n";
    //   s += "40\n";
    //   s += String(op.radius) + "\n";
    //   break;
    //
    // case 'arc':
    //   s += '0\n';
    //   s += "ARC\n";
    //   s += "8\n";
    //   s += String(layer) + "\n";
    //
    //   s += "10\n";
    //   s += String(op.x) + "\n";
    //   s += "20\n";
    //   s += String(op.y) + "\n";
    //   s += "40\n";
    //   s += String(op.radius) + "\n";
    //
    //   //recalc the angles because of the switch from a right-down to a right-up co-ordinate system.
    //   sAng = (op.startAng + 270) % 361;
    //   eAng = (op.endAng + 270) % 361;
    //
    //   if ((op.startAng + 270) > 360)sAng += 1;
    //   if ((op.endAng + 270) > 360)eAng += 1;
    //
    //   s += "50\n";
    //   s += String(sAng) + "\n";
    //   s += "51\n";
    //   s += String(eAng) + "\n";
    //   break;
  }

  return s;
}

function genDxfTrailer(bounds) {
  return "0\nEOF";
}

function genDxfEntitiesFromDetails(bounds, details) {
  var out = "";
  out += "2\n";
  out += "ENTITIES\n";

  for (var i = 0; i < details.length; i++) {
    out += genDxfEntityForDetail(bounds, details[i]);
  }
  return dxf_wrapInputWithSectionDeclaration(out);
}

(function () {

    angular.module('welpCAD').directive('exportModal', function(dataService, $rootScope){
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
          return "/exportModal.html"
        },
        link: function($scope, elem, attrs) {
          // scope = either parent scope or its own child scope if scope set.
          // elem = jqLite wrapped element of: root object inside the template, so we can setup event handlers etc
        },
        controller: function($scope) {
          $scope.open = false;
          $scope.tolerance = 0.1;

          $rootScope.$on('export-design-modal-open', function(event, args) {
            $scope.open = true;
            $scope.document = args.document;
          });
          $scope.Dodxf = function(name){
            if(isNaN($scope.tolerance)){
              return;
            }

            var details = $scope.document.getPathDetails({fill: '#ffe0b2', flattenError: $scope.tolerance});
            var bounds = parseDetailsForMaxMin(details);
            var content_out = genDxfHeader(bounds);
            content_out += genDxfEntitiesFromDetails(bounds, details);
            content_out += genDxfTrailer(bounds);
            console.log(content_out);
            var name = $scope.document.name + ".dxf";
            if ($scope.document.revision){
              name = $scope.document.name + "_r" + $scope.document.revision + ".dxf";
            }

            var blob = new Blob([content_out], {type: "application/dxf;charset=utf-8"});
            saveAs(blob, name);
            $scope.onCancel();
          }
          $scope.onCancel = function(){
            $scope.open = false;
          }
        }
      };
  });
})();
