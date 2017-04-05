function Assembly (name, components) {
    this.name = name || null;
    this.components = components || [];
}

// Sets its name - takes a string
Assembly.prototype.setName = function(name) {
  this.name = name;
}
Assembly.prototype.getName = function() {
  return this.name;
}


Assembly.prototype.getSerializable = function(){
  var c = [];
  for(var i = 0;i < this.components.length; i++){
    c[c.length] = {cType: this.components[i].componentType, parameters: this.components[i].getSerializable()};
  }

  return {
    name: this.name,
    components: c,
  };
}

function loadAssemblyFromObj(d){
  var components = [];
  for (var i = 0; i < d.components.length; i++){
    components[components.length] = buildAssemblyComponentFromSpec(d.components[i]);
  }
  return new Assembly(d.name, components);
}

function loadAssemblyFromJsonData(jsonData) {
  var d = JSON.parse(jsonData);
  return loadAssemblyFromObj(d);
}
