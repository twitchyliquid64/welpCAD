(function () {

    angular.module('welpCAD').directive('fileSelectModal', function($rootScope){
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
          return "/fileSelectModal.html"
        },
        link: function($scope, elem, attrs) {
          // scope = either parent scope or its own child scope if scope set.
          // elem = jqLite wrapped element of: root object inside the template, so we can setup event handlers etc
          var e = document.getElementById("file-select-modal-input");
          e.addEventListener('change', $scope.readFile, false);
        },
        controller: function($scope) {
          $scope.open = false;
          $scope.title = 'Open File';
          $scope.content = '';
          $scope.fileContents = '';
          $scope.fileRead = false;
          $scope.clientOnOpen = undefined;

          $rootScope.$on('file-open-request', function(event, args) {
            if (args.title)$scope.title = args.title;
            if (args.content)$scope.content = args.content;
            if (args.actions)$scope.actions = args.actions;
            if (args.onOpen)$scope.clientOnOpen = args.onOpen;
            $scope.open = true;
          });

          $scope.readFile = function(e) {
            var file = e.target.files[0];
            if (!file) {
              return;
            }
            var reader = new FileReader();
            reader.onload = function(e) {
              var contents = e.target.result;
              $scope.fileContents = contents;
              $scope.fileRead = true;
              console.log(contents);
              $scope.$digest();
            };
            reader.readAsText(file);
          }

          $scope.onOpen = function(){
            if (!$scope.fileRead)return;
            if ($scope.clientOnOpen)
              $scope.clientOnOpen($scope.fileContents);
            $scope.onCancel();
          }

          $scope.onCancel = function(){
            $scope.title = 'Open File';
            $scope.content = '';
            $scope.open = false;
            $scope.clientOnOpen = undefined;
          }
        }
      };
  });
})();
