function Document (name, nameRegister, objs, author, thickness, revision, color) {
    this.name = name || null;
    this.nameRegister = nameRegister || {};
    this.objs = objs || [];
    this.author = author;
    this.thickness = thickness;
    this.revision = revision;
    this.renderColor = color;
}

// Sets its name - takes a string
Document.prototype.setName = function(name) {
  this.name = name;
}
Document.prototype.getName = function() {
  return this.name;
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

// Deletes an object from the document.
Document.prototype.delete = function(name) {
  for (var i = 0; i < this.objs.length; i++) {
    if (this.objs[i].name == name){
      this.objs.splice(i, 1);
      return;
    }
  }
}

// Handles an edit
//TODO: Error out if oldName != obj.name && obj.name already exists elsewhere
Document.prototype.applyEdit = function(oldName, obj) {
  for (var i = 0; i < this.objs.length; i++){
    if (oldName == this.objs[i].name){
      this.objs[i] = obj;
      return;
    }
  }
  this.objs[this.objs.length] = obj;
}


// Gets the list of objects in the model.
Document.prototype.getObjs = function(){
  return this.objs;
}

Document.prototype.getObjectByName = function(name){
  var objs = this.getObjs();
  for(var i = 0;i < objs.length; i++){
    if (objs[i].name == name)return objs[i];
  }
}

Document.prototype.isBaseObject = function(obj){
  return this.getObjs().length && this.getObjs()[0].name == obj.name;
}





// Returns a paper.js CompoundPath for 2d render.
Document.prototype.getDrawable = function(paperSurface, options){
  var objs = this.getObjs();
  var root = undefined;
  for(var i = 0;i < objs.length; i++){
    var o = objs[i].getDrawable(paperSurface, options);
    if (!root)
      root = o;
    else {
      switch (objs[i].getCombinationOperation()){
        case 'add':
          root = root.unite(o);
          break;
        case 'sub':
          root = root.subtract(o);
          break;
      }
    }
  }
  return root;
}

function applyCurveToPath(path, curve, lastPoint){
  var points = curve.points;
  var p1 = points[0];
  var p2 = points[3];
  if (!p1.equals(lastPoint)){
    path.moveTo(p1.x, p1.y);
  }
  if (curve.isStraight()){
    path.lineTo(p2.x, p2.y);
  } else {
    path.bezierCurveTo(points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y);
  }
  return p2;
}

// Returns a THREE.ShapePath which can be extruded to form a 3d geometry.
Document.prototype.getRenderable = function(paperOptions, pathOptions){
  var drawable = this.getDrawable(paper, paperOptions);
  var path = new THREE.ShapePath();

  console.log('compountPath:', drawable instanceof paper.CompoundPath)
  console.log('closed:', drawable.closed);
  console.log('children:', drawable.children);

  if (drawable instanceof paper.CompoundPath) {
    for(var i = 0; i < drawable.children.length; i++){
      var p = drawable.children[i];
      var lastPoint = undefined;
      for(var o = 0; o < p.curves.length; o++){
        lastPoint = applyCurveToPath(path, p.curves[o], lastPoint);
      }
    }
  } else {
    var lastPoint = undefined;
    for(var o = 0; o < drawable.curves.length; o++){
      lastPoint = applyCurveToPath(path, drawable.curves[o], lastPoint);
    }
  }

  console.log(drawable, path);
  return path;
}




Document.prototype.getSerializable = function(){
  var c = [];
  var objs = this.getObjs();
  for(var i = 0;i < objs.length; i++){
    c[c.length] = {cType: objs[i].componentType, parameters: objs[i].getSerializable()};
  }

  return {
    name: this.name,
    nameRegister: this.nameRegister,
    author: this.author,
    revision: this.revision,
    thickness: this.thickness,
    renderColor: this.renderColor,
    components: c,
  };
}

function buildComponentFromSpec(spec){
  switch (spec.cType){
    case 'rect':
      return new Rect(...spec.parameters);
    case 'circle':
      return new Circle(...spec.parameters);
  }
}

function loadDocumentFromObj(d){
  var components = [];
  for (var i = 0; i < d.components.length; i++){
    components[components.length] = buildComponentFromSpec(d.components[i]);
  }
  return new Document(d.name, d.nameRegister, components, d.author, d.thickness, d.revision, d.renderColor);
}

function loadDocumentFromJsonData(jsonData) {
  var d = JSON.parse(jsonData);
  return loadDocumentFromObj(d);
}
