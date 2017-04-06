(function () {

    angular.module('welpCAD')
        .controller('assemblyController', ['$scope', 'dataService', '$rootScope', '$timeout', assemblyController]);

    function assemblyController($scope, dataService, $rootScope, $timeout) {
      var self = this;
      $scope.dataService = dataService;
      $scope.isPreviewMode = false;
      $scope.assembly = null;

      // (DEBUG) Invoked when the fix size button is pressed
      $scope.fixSizePressed = function(){
        $scope.$broadcast('resize-assembler-renderer');
      }

      $scope.newPressed = function(){
        if (!$scope.isPreviewMode && $scope.assembly) {
          //TODO: Make Modal for selecting design from project
        }
      }

      $scope.savePressed = function(){
        if (!$scope.isPreviewMode && $scope.assembly) {
          $rootScope.$broadcast('assembly-save', {assembly: $scope.assembly});
          $scope.dirty = false;
        }
      }

      $scope.getSidebarTitle = function(){
        return $scope.isPreviewMode ? 'Preview design' : ($scope.assembly ? $scope.assembly.getName() : 'No assembly');
      }

      $scope.resetPreview = function(){
        $scope.isPreviewMode = false;
        $scope.changePage('designer');
        $scope.$broadcast('reset-assembly-render');
      }

      $rootScope.$on('assembler-preview-path', function(event, args){
        $scope.isPreviewMode = true;
        $scope.$broadcast('render-only', {path: args.path, thickness: args.thickness, color: args.color});
      });

      $rootScope.$on('set-assembler-assembly', function(event, args) {
        $scope.dirty = false;
        $scope.assembly = args.assembly;
        $scope.$broadcast('render-assembly', {assembly: args.assembly});
        $timeout(function(){
          $scope.$broadcast('resize-assembler-renderer');
        }, 200);
      });
    }
})();
