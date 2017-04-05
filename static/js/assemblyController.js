(function () {

    angular.module('welpCAD')
        .controller('assemblyController', ['$scope', 'dataService', '$rootScope', assemblyController]);

    function assemblyController($scope, dataService, $rootScope) {
      var self = this;
      $scope.dataService = dataService;
      $scope.isPreviewMode = false;
      $scope.assembly = null;

      // (DEBUG) Invoked when the fix size button is pressed
      $scope.fixSizePressed = function(){
        $scope.$broadcast('resize-assembler-renderer');
      }

      $scope.getSidebarTitle = function(){
        return $scope.isPreviewMode ? 'Preview design' : ($scope.assembly ? 'Objects in assembly' : 'No assembly');
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
    }
})();
