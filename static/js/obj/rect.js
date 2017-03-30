function Rect (name, pos, size) {
    this.name = name;
    this.pos  = pos  || {x: 0, y: 0};
    this.size = size || {width: 40, height: 40};
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

// Sets its size - takes a paper.Size.
Rect.prototype.setSize = function(size) {
  this.size = size;
}


// Returns a paper item to draw with
Rect.prototype.getDrawable = function(paperScope) {
  var o = new paperScope.Path.Rectangle([this.pos.x, this.pos.y], [this.size.width, this.size.height]);
  o.strokeColor = 'black';
  //o.fillColor = 'red';
  //o.opacity = 1
  return o;
};

// Returns an array with arguments that can be passed to the constructor to rebuild the object.
Rect.prototype.getSerializable = function(){
  return [this.name, this.pos, this.size];
}
