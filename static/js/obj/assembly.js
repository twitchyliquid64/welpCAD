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


Assembly.prototype.getObjs = function(){
  return this.components;
}

Assembly.prototype.getByName = function(name){
  for(var i = 0;i < this.components.length; i++){
    if (this.components[i].name == name) {
      return this.components[i];
    }
  }
}

Assembly.prototype.deleteByName = function(name){
  for(var i = 0;i < this.components.length; i++){
    if (this.components[i].name == name) {
      this.components.splice(i, 1);
      return;
    }
  }
}

Assembly.prototype.renameByName = function(name, newName){
  for(var i = 0;i < this.components.length; i++){
    if (this.components[i].name == name) {
      this.components[i].setName(newName);
      return;
    }
  }
}

Assembly.prototype.add = function(component){
  this.components.push(component);
}


function buildAssemblyComponentFromSpec(spec) {
  switch (spec.cType){
    case 'documentReference':
      return new DocumentReference(...spec.parameters);
    case 'objectReference':
      return new ObjectReference(...spec.parameters);
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

function meshFromPath(path, color, thickness){
  var shapes = path.toShapes(true);
  var localMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0,
    roughness: 0,
  });
  var solid = new THREE.ExtrudeGeometry(shapes, { amount: thickness, bevelEnabled: false });
  return new THREE.SceneUtils.createMultiMaterialObject(solid, [localMaterial]);
}
