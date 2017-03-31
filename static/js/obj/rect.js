function Rect (name, pos, size, combinationOperation) {
    this.name = name;
    this.pos  = pos  || {x: 0, y: 0};
    this.size = size || {width: 40, height: 40};
    this.combinationOperation = combinationOperation || 'add';
    this.icon = 'view_agenda';
    this.componentType = 'rect';
}

// Sets its name - takes a string
Rect.prototype.setName = function(name) {
  this.name = name;
}


// Sets its position - takes a paper.Point.
Rect.prototype.setPosition = function(pos) {
  this.pos = pos;
}
Rect.prototype.getPosition = function() {
  return jQuery.extend(true, {}, this.pos);
}

// Sets its size - takes a paper.Size.
Rect.prototype.setSize = function(size) {
  this.size = size;
}
Rect.prototype.getSize = function() {
  return jQuery.extend(true, {}, this.size);
}

// Sets the combination operation.
Rect.prototype.setCombinationOperation = function(op){
  this.combinationOperation = op;
}
Rect.prototype.getCombinationOperation = function() {
  return this.combinationOperation;
}

// Returns a paper item to draw with
Rect.prototype.getDrawable = function(paperScope, options) {
  var o = new paperScope.Path.Rectangle([this.pos.x, this.pos.y], [this.size.width, this.size.height]);
  o.strokeColor = 'black';
  o.name = this.name;
  if (options.fill)
    o.fillColor = options.fill;
  return o;
};

// Returns an array with arguments that can be passed to the constructor to rebuild the object.
Rect.prototype.getSerializable = function(){
  return [this.name, this.pos, this.size, this.combinationOperation];
}
