function Rect (name, pos, size) {
    this.name = name;
    this.pos = pos || new paper.Point(0,0);
    this.size = size || new paper.Size(40, 40);
    this.rect = new paper.Rectangle(this.pos, this.size);
}

// Sets its position - takes a paper.Point.
Rect.prototype.setPosition = function(pos) {
  this.pos = pos;
  this.rect = new paper.Rectangle(this.pos, this.size);
}

// Sets its size - takes a paper.Size.
Rect.prototype.setSize = function(size) {
  this.size = size;
  this.rect = new paper.Rectangle(this.pos, this.size);
}


// Returns a paper item to draw with
Rect.prototype.getDrawable = function() {
    return new Path.Rectangle(this.rect);
};
