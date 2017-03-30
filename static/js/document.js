function Document (name, nameRegister, objs) {
    this.name = name || 'Untitled';
    this.nameRegister = nameRegister || {};
    this.objs = objs || [];
}

// Sets its name - takes a string
Document.prototype.setName = function(name) {
  this.name = name;
}

// Gets a name which has not be taken yet.
Document.prototype.suggestName = function(componentType) {
  if (!(componentType in this.nameRegister)){
    this.nameRegister[componentType] = 0;
  }
  return componentType + '-' + (this.nameRegister[componentType]+1);
}

// Adds an object to the model.
Document.prototype.add = function(obj) {
  for (var property in this.nameRegister) {
    if (this.nameRegister.hasOwnProperty(property) && obj.name.startsWith(property+'-')) {
        this.nameRegister[property] += 1;
    }
  }
  this.objs[this.objs.length] = obj;
}

// Gets the list of objects in the model.
Document.prototype.getObjs = function(){
  return this.objs;
}
