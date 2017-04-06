function Assembly (name, components, nameRegister) {
    this.name = name || null;
    this.components = components || [];
    this.nameRegister = nameRegister || {};
}

// Sets its name - takes a string
Assembly.prototype.setName = function(name) {
  this.name = name;
}
Assembly.prototype.getName = function() {
  return this.name;
}
// Gets a name which has not be taken yet.
Assembly.prototype.suggestName = function(componentType) {
  if (!(componentType in this.nameRegister)){
    this.nameRegister[componentType] = 0;
  }
  return componentType + '-' + (this.nameRegister[componentType]+1);
}

Assembly.prototype.getRenderables = function(dataProvider, opts){
  var output = [];
  for(var i = 0;i < this.components.length; i++){
    output.push(this.components[i].getRenderable(dataProvider, opts));
  }
  return output;
}

Assembly.prototype.getSerializable = function(){
  var c = [];
  for(var i = 0;i < this.components.length; i++){
    c[c.length] = {cType: this.components[i].componentType, parameters: this.components[i].getSerializable()};
  }

  return {
    name: this.name,
    components: c,
    nameRegister: this.nameRegister,
  };
}


Assembly.prototype.add = function(component){
  this.components.push(component);
}


function buildAssemblyComponentFromSpec(spec) {
  switch (spec.cType){
    case 'documentReference':
      return new DocumentReference(...spec.parameters);
  }
}

function loadAssemblyFromObj(d){
  var components = [];
  for (var i = 0; i < d.components.length; i++){
    components[components.length] = buildAssemblyComponentFromSpec(d.components[i]);
  }
  return new Assembly(d.name, components, d.nameRegister);
}

function loadAssemblyFromJsonData(jsonData) {
  var d = JSON.parse(jsonData);
  return loadAssemblyFromObj(d);
}
