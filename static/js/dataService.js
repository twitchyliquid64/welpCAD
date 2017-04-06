(function() {

    var app = angular.module('welpCAD').factory('dataService', ['$rootScope', '$http', '$interval', '$window', dataService]);

    function dataService($rootScope, $http, $interval, $window){
      var self = this;
      self.projectName = null; //Set when project is set up
      self.designs = [];
      self.assemblies = [];
      self.objects = [];
      self.saveTarget = null; //browser,cloud,file

      self.projectsInHistory = localStorage.projects ? JSON.parse(localStorage.projects) : undefined;

      // Returns true if a project is currently open.
      self.projectOpen = function(){
        return !!self.projectName;
      };

      self.init = function(name){
        self.projectName = name;
        self.designs = [];
        self.assemblies = [];
        self.objects = [];
        self.saveTarget = 'browser';
      };

      self.saveAssembly = function(assembly){
        if (!self.projectName)
          return 'Cannot save assembly - project not setup';
        if (!assembly.getName())
          return 'Cannot save unnamed assembly';

        var index = self._getAssemblyIndex(assembly.getName());
        if (index == -1) { //No assembly by that name exists
          self.assemblies.push(assembly);
        } else {
          self.assemblies[index] = assembly;
        }
        self._storageModelChanged();
        return false;
      };

      self._getAssemblyIndex = function(name){
        for(var i = 0; i < self.assemblies.length; i++)
          if (self.assemblies[i].getName() == name)
            return i;
        return -1;
      };

      // Called from designer by event to commit an updated version of the design with that name.
      // Creates if it does not exist.
      self.saveDesign = function(design){
        if (!self.projectName)
          return 'Cannot save design - project not setup';
        if (!design.getName())
          return 'Cannot save unnamed design';

        var index = self._getDesignIndex(design.getName());
        if (index == -1) { //No design by that name exists
          self.designs.push(design);
        } else {
          self.designs[index] = design;
        }
        self._storageModelChanged();
        return false;
      };

      self._getDesignIndex = function(name){
        for(var i = 0; i < self.designs.length; i++)
          if (self.designs[i].getName() == name)
            return i;
        return -1;
      };

      self._storageModelChanged = function(){
        if (self.saveTarget == 'browser' && self.projectName) {
          var ls = self.projectsInHistory || {};
          ls[self.projectName] = self._getProjectSerialized();
          localStorage.projects = JSON.stringify(ls);
        }
      };

      self._getProjectSerialized = function(){
        var output = {
          projectName: self.projectName,
          saveTarget: self.saveTarget,
          designs: [],
          assemblies: [],
          objects: [],
        };

        for(var i = 0; i < self.designs.length; i++) {
          output.designs.push(self.designs[i].getSerializable());
        }

        for(var i = 0; i < self.assemblies.length; i++) {
          output.assemblies.push(self.assemblies[i].getSerializable());
        }

        return output;
      };

      // Save the current project to persistant storage if one exists.
      self.save = function(){
        self._storageModelChanged();
      };

      self._deserializeToModel = function(obj) {
        self.projectName = obj.projectName;
        self.saveTarget = obj.saveTarget;
        self.designs = [];
        for (var i = 0; i < obj.designs.length; i++) {
          self.designs.push(loadDocumentFromObj(obj.designs[i]));
        }
        for (var i = 0; i < obj.assemblies.length; i++) {
          self.assemblies.push(loadAssemblyFromObj(obj.assemblies[i]));
        }
      };

      // Load in the project with the given name from history (normally localStorage)
      self.loadFromHistory = function(name) {
        var p = self.projectsInHistory[name];
        self._deserializeToModel(p);
      };

      // Called from UI to switch the designer to a specific design.
      self.loadDesign = function(designName) {
        var index = self._getDesignIndex(designName);
        if (index != -1){
          $rootScope.$broadcast('set-designer-design', {
            design: self.designs[index],
          });
          return true;
        }
        return false;
      };

      // Called from UI to switch the assembler to a specific assembly.
      self.loadAssembly = function(assemblyName) {
        var index = self._getAssemblyIndex(assemblyName);
        if (index != -1){
          $rootScope.$broadcast('set-assembler-assembly', {
            assembly: self.assemblies[index],
          });
          return true;
        }
        return false;
      };

      $rootScope.$on('design-save', function(event, args){
        self.saveDesign(args.design);
      });
      $rootScope.$on('assembly-save', function(event, args){
        self.saveAssembly(args.assembly);
      });

      //$interval(self.fetchAndApplyDiff, 2000);
      //self.updateComponent('all');
      return self;
    }
})();
