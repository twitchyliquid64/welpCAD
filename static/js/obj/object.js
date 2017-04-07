function ProjectObject (name, geometryJSON, color, position, orientation) {
    this.name = name || null;
    this.geometryJSON = geometryJSON || '';
    this.color = color || '#0000A0';
    this.componentType = 'object';
    position = position || {x: 0, y: 0, z: 0};
    this.x = position.x;
    this.y = position.y;
    this.z = position.z;
    orientation = orientation || {x: 0, y: 0, z: 0};
    this.orientationx = orientation.x;
    this.orientationy = orientation.y;
    this.orientationz = orientation.z;
}

// Sets its name - takes a string
ProjectObject.prototype.setName = function(name) {
  this.name = name;
}
ProjectObject.prototype.getName = function() {
  return this.name;
}

ProjectObject.prototype.getRenderable = function(dataProvider, opts){
  var jsonLoader = new THREE.JSONLoader();
  var result = jsonLoader.parse(this.geometryJSON);
  var localMaterial = new THREE.MeshStandardMaterial({
    color: this.color,
    metalness: 0,
    roughness: 0,
  });

  var p = THREE.SceneUtils.createMultiMaterialObject(result.geometry, [localMaterial]);
  p.name = this.name;
  p.rotateX(this.orientationx);
  p.rotateY(this.orientationy);
  p.rotateZ(this.orientationz);
  p.translateX(this.x);
  p.translateY(this.y);
  p.translateZ(this.z);
  return p;
}

ProjectObject.prototype.getSerializable = function(){
  return [this.name, this.geometryJSON, this.color, {x: this.x, y: this.y, z: this.z}, {x: this.orientationx, y: this.orientationy, z: this.orientationz}];
};

function loadProjectObjectFromObj(d){
  return new ProjectObject(...d);
}
