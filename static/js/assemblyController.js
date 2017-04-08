(function () {

    angular.module('welpCAD')
        .controller('assemblyController', ['$scope', 'dataService', '$rootScope', '$timeout', assemblyController]);

    function assemblyController($scope, dataService, $rootScope, $timeout) {
      var self = this;
      $scope.dataService = dataService;
      $scope.isPreviewMode = false;
      $scope.assembly = null;
      $scope.selected = '';

      $scope.newPressed = function(){
        if (!$scope.isPreviewMode && $scope.assembly) {
          $rootScope.$broadcast('select-design-modal-open', {onSelect: function(name){
            $scope.assembly.add(new DocumentReference(prompt("enter a name for this object"), name))
            $scope.dirty = true;
            $scope.$broadcast('render-assembly', {assembly: $scope.assembly});
          }});
        }
      }

      $scope.newObjectPressed = function(){
        if (!$scope.isPreviewMode && $scope.assembly) {
          $rootScope.$broadcast('select-object-modal-open', {onSelect: function(name){
            $scope.assembly.add(new ObjectReference(prompt("enter a name for this object"), name))
            $scope.dirty = true;
            $scope.$broadcast('render-assembly', {assembly: $scope.assembly});
          }});
        }
      }

      $scope.paint = function(){
        $scope.$broadcast('resize-assembler-renderer');
        $scope.$broadcast('render-assembly', {assembly: $scope.assembly});
      }

      $scope.select = function(name){
        $scope.selected = name;
        $scope.$broadcast('assembly-selection-changed', {name: name, obj: $scope.assembly.getByName(name)});
      }

      $scope.savePressed = function(){
        if (!$scope.isPreviewMode && $scope.assembly) {
          $rootScope.$broadcast('assembly-save', {assembly: $scope.assembly});
          $scope.dirty = false;
        }
      }

      $scope.titleClick = function(){
        if ($scope.assembly && !$scope.isPreviewMode) {
          var n = prompt("New name for assembly:");
          if (n) {
            $scope.assembly.setName(n);
            $scope.dirty = true;
          }
        }
      }

      $scope.getSidebarTitle = function(){
        return $scope.isPreviewMode ? 'Preview design' : ($scope.assembly ? $scope.assembly.getName() : 'No assembly');
      }

      $scope.resetPreview = function(){
        $scope.isPreviewMode = false;
        $scope.changePage('designer');
        $scope.$broadcast('reset-assembly-render');
        $scope.$broadcast('assembly-selection-changed', {name: null, obj: null});
        $scope.selection = '';
        $scope.assembly = null;
      }

      $rootScope.$on('assembler-preview-path', function(event, args){
        $scope.isPreviewMode = true;
        $scope.$broadcast('render-only', {path: args.path, thickness: args.thickness, color: args.color});
      });

      $rootScope.$on('assembly-translate-object', function(event, args){
        $scope.dirty = true;
      })
      $rootScope.$on('assembly-rotate-object', function(event, args){
        $scope.dirty = true;
      })

      $rootScope.$on('assembly-delete-object', function(event, args){
        $scope.assembly.deleteByName(args.name);
        $scope.dirty = true;
        $scope.$broadcast('render-assembly', {assembly: $scope.assembly});
      })

      $rootScope.$on('assembly-rename-object', function(event, args){
        $scope.assembly.renameByName(args.name, args.newName);
        $scope.dirty = true;
        $scope.$broadcast('render-assembly', {assembly: $scope.assembly});
      })

      $rootScope.$on('assembly-coords-changed-object', function(event, args){
        $scope.dirty = true;
        $scope.$broadcast('render-assembly', {assembly: $scope.assembly});
      })

      $rootScope.$on('set-assembler-assembly', function(event, args) {
        $scope.dirty = false;
        $scope.assembly = args.assembly;
        $scope.$broadcast('render-assembly', {assembly: args.assembly});
        $scope.$broadcast('assembly-selection-changed', {name: null, obj: null});
        $scope.selection = '';
        $timeout(function(){
          $scope.$broadcast('resize-assembler-renderer');
        }, 200);
      });
    }
})();
