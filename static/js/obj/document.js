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



// Returns a paper.js CompoundPath for render.
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

function applySegmentToPath(path, segment, isNewElement){
  if (isNewElement){
    path.moveTo(segment.point.x, segment.point.y);
  } else {
    if (segment.curve.isStraight()){
      path.lineTo(segment.point.x, segment.point.y);
    } else {
      var points = segment.curve.points;
      path.bezierCurveTo(points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y);
      //console.log("Cannot convert segment to path:", segment.curve, segment.handleIn, segment.handleOut);
    }
  }
}


Document.prototype.getRenderable = function(paperOptions, pathOptions){
  var drawable = this.getDrawable(paper, paperOptions);
  var path = new THREE.ShapePath();

  console.log('compountPath:', drawable instanceof paper.CompoundPath)
  console.log('closed:', drawable.closed);
  console.log('children:', drawable.children);

  if (drawable instanceof paper.CompoundPath) {
    for(var i = 0; i < drawable.children.length; i++){
      var p = drawable.children[i];
      for(var o = 0; o < p.segments.length; o++){
        applySegmentToPath(path, p.segments[o], o == 0);
      }
    }
  } else {
    for(var o = 0; o < drawable.segments.length; o++){
      applySegmentToPath(path, drawable.segments[o], o == 0);
    }
  }

  console.log(drawable, path);
  return path;
}
