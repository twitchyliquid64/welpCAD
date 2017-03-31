function Circle (name, pos, radius, combinationOperation) {
    this.name = name;
    this.pos  = pos  || {x: 0, y: 0};
    this.radius = radius || 40;
    this.combinationOperation = combinationOperation || 'add';
    this.icon = 'album';
    this.componentType = 'circle';
}

// Sets its name - takes a string
Circle.prototype.setName = function(name) {
  this.name = name;
}


// Sets its position - takes a paper.Point.
Circle.prototype.setPosition = function(pos) {
  this.pos = pos;
}
Circle.prototype.getPosition = function() {
  return jQuery.extend(true, {}, this.pos);
}

Circle.prototype.setRadius = function(size) {
  this.radius = size;
}
Circle.prototype.getRadius = function() {
  return this.radius;
}

// Sets the combination operation.
Circle.prototype.setCombinationOperation = function(op){
  this.combinationOperation = op;
}
Circle.prototype.getCombinationOperation = function() {
  return this.combinationOperation;
}

// Returns a paper item to draw with
Circle.prototype.getDrawable = function(paperScope, options) {
  var o = new paperScope.Path.Circle([this.pos.x, this.pos.y], this.radius);
  o.strokeColor = 'black';
  o.name = this.name;
  if (options.fill)
    o.fillColor = options.fill;
  return o;
};

// Returns an array with arguments that can be passed to the constructor to rebuild the object.
Circle.prototype.getSerializable = function(){
  return [this.name, this.pos, this.radius, this.combinationOperation];
}
