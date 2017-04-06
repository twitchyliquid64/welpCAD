function DocumentReference (name, documentName) {
    this.name = name || null;
    this.documentName = documentName;
    this.componentType = 'documentReference';
};

// Sets its name - takes a string
DocumentReference.prototype.setName = function(name) {
  this.name = name;
};
DocumentReference.prototype.getName = function() {
  return this.name;
};

DocumentReference.prototype.getRenderable = function(dataProvider, opts){

}

DocumentReference.prototype.getSerializable = function(){
  return [this.name, this.documentName];
};
