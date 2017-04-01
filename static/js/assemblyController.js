(function () {

    angular.module('welpCAD')
        .controller('assemblyController', ['$scope', 'dataService', '$rootScope', assemblyController]);

    function assemblyController($scope, dataService, $rootScope) {
      var self = this;
      $scope.dataService = dataService;
      $scope.isPreviewMode = false;

      // (DEBUG) Invoked when the fix size button is pressed
      $scope.fixSizePressed = function(){
        $scope.$broadcast('resize-assembler-renderer');
      }

      $scope.getSidebarTitle = function(){
        return $scope.isPreviewMode ? 'Preview design' : 'Objects in assembly';
      }

      $rootScope.$on('assembler-preview-path', function(event, args){
        $scope.isPreviewMode = true;
        $scope.$broadcast('render-only', {path: args.path});
      });
    }
})();
