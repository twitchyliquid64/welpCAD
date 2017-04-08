function ObjectReference (name, objectName, position, orientation) {
    this.name = name || null;
    this.objectName = objectName;
    this.componentType = 'objectReference';
    position = position || {x: 0, y: 0, z: 0};
    this.x = position.x;
    this.y = position.y;
    this.z = position.z;
    orientation = orientation || {x: 0, y: 0, z: 0};
    this.orientationx = orientation.x;
    this.orientationy = orientation.y;
    this.orientationz = orientation.z;
};

// Sets its name - takes a string
ObjectReference.prototype.setName = function(name) {
  this.name = name;
};
ObjectReference.prototype.getName = function() {
  return this.name;
};

ObjectReference.prototype.getRenderable = function(dataProvider, opts){
  var obj = dataProvider.getObject(this.objectName);
  var p = obj.getRenderable({});
  p.name = this.name;
  p.rotateX(this.orientationx);
  p.rotateY(this.orientationy);
  p.rotateZ(this.orientationz);
  p.translateX(this.x);
  p.translateY(this.y);
  p.translateZ(this.z);
  return p;
}

ObjectReference.prototype.getSerializable = function(){
  return [this.name, this.objectName, {x: this.x, y: this.y, z: this.z}, {x: this.orientationx, y: this.orientationy, z: this.orientationz}];
};
