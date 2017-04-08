function ProjectObject (name, geometryJSON, color) {
    this.name = name || null;
    this.geometryJSON = geometryJSON || '';
    this.color = color || '#0000A0';
    this.componentType = 'object';

    this.cachedGeometry = undefined;
    var parsed = JSON.parse(this.geometryJSON)
    parsed.type = 'Geometry';
    var loader = new THREE.ObjectLoader();
    console.log(parsed);
    var geo = loader.parseGeometries([parsed]);
    this.cachedGeometry = geo[parsed.uuid];
    console.log(this.cachedGeometry);
}

// Sets its name - takes a string
ProjectObject.prototype.setName = function(name) {
  this.name = name;
}
ProjectObject.prototype.getName = function() {
  return this.name;
}

ProjectObject.prototype.getRenderable = function(opts){
  var localMaterial = new THREE.MeshStandardMaterial({
    color: this.color,
    metalness: 0,
    roughness: 0,
  });

  var p = THREE.SceneUtils.createMultiMaterialObject(this.cachedGeometry, [localMaterial]);
  return p;
}

ProjectObject.prototype.getSerializable = function(){
  return [this.name, this.geometryJSON, this.color];
};

function loadProjectObjectFromObj(d){
  return new ProjectObject(...d);
}
