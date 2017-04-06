function DocumentReference (name, documentName, position, orientation) {
    this.name = name || null;
    this.documentName = documentName;
    this.componentType = 'documentReference';
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
DocumentReference.prototype.setName = function(name) {
  this.name = name;
};
DocumentReference.prototype.getName = function() {
  return this.name;
};

DocumentReference.prototype.getRenderable = function(dataProvider, opts){
  console.log('getRenderable()', this.documentName);
  var doc = dataProvider.getDesign(this.documentName);
  console.log('doc:', doc);
  var p = meshFromPath(doc.getRenderable({fill: '#ffe0b2'}, {fill: '#ffe0b2'}), doc.renderColor || '#ff0000', doc.thickness || 3);
  p.name = this.name;
  p.rotateX(this.orientationx);
  p.rotateY(this.orientationy);
  p.rotateZ(this.orientationz);
  p.translateX(this.x);
  p.translateY(this.y);
  p.translateZ(this.z);
  return p;
}

DocumentReference.prototype.getSerializable = function(){
  return [this.name, this.documentName, {x: this.x, y: this.y, z: this.z}, {x: this.orientationx, y: this.orientationy, z: this.orientationz}];
};
