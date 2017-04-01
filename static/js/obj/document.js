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
      var hi = segment.next.handleIn;
      var ho = segment.handleOut;
      var sp = segment.point;
      console.log(segment.point == segment.curve.getPoint2());
      path.bezierCurveTo(segment.point.x, segment.point.y, hi.x + sp.x, hi.y + sp.y, ho.x + sp.x, ho.y + sp.y);
      //console.log("Cannot convert segment to path:", segment.curve, segment.handleIn, segment.handleOut);
    }
  }
}

function applyCurveToPath(path, curve, lastPoint){
  var points = curve.points;
  var p1 = points[0];
  var p2 = points[2];
  if (!p1.equals(lastPoint)){
    path.moveTo(p1.x, p1.y);
  }
  if (curve.isStraight()){
    path.lineTo(p2.x, p2.y);
  } else {
    var hi = points[1];
    var ho = points[3];
    path.bezierCurveTo(p2.x, p2.y, p1.x - hi.x, p1.y - hi.y, p1.x - ho.x, p1.y - ho.y);
  }
  return p2;
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
