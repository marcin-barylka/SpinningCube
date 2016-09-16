/* Application */
"use strict";

var Point = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
};

Point.prototype.dump = function() {
	return "(" + this.x + "," + this.y + "," + this.z + ")";
};

Point.prototype.rad = function(angle) {
	return angle * Math.PI / 180;
};

Point.prototype.rotateX = function(angle) {
	var rad, cosa, sina, y, z;
	rad = this.rad(angle);
	cosa = Math.cos(rad);
	sina = Math.sin(rad);
	y = this.y * cosa - this.z * sina;
	z = this.y * sina + this.z * cosa;
	return new Point(this.x, y, z);
};

Point.prototype.rotateY = function(angle) {
	var rad, cosa, sina, x, z;
	rad = this.rad(angle);
	cosa = Math.cos(rad);
	sina = Math.sin(rad);
	z = this.z * cosa - this.x * sina;
	x = this.z * sina + this.x * cosa;
	return new Point(x, this.y, z); 
};

Point.prototype.rotateZ = function(angle) {
	var rad, cosa, sina, x, y;
	rad = this.rad(angle);
	cosa = Math.cos(rad);
	sina = Math.sin(rad);
	x = this.x * cosa - this.y * sina;
	y = this.x * sina + this.y * cosa;
	return new Point(x, y, this.z);
};

Point.prototype.project = function() {
	var x, y;
	x = observer.x + (observer.x - this.x) * observer.z / (this.z - observer.z);
	y = observer.y + (observer.y - this.y) * observer.z / (this.z - observer.z);
	return new Point(x + 400, y + 300, null);
};

var Cube = function(ctx) {
	this.vertices = [];
	this.context = ctx;
};

Cube.prototype.addVertex = function(point) {
	this.vertices.push(point);
};

Cube.prototype.rotateX = function(angle) {
	var tmpVertices = [];
	for (var i=0; i<this.vertices.length; i++) {
		tmpVertices.push(this.vertices[i].rotateX(angle));
	}	
	this.vertices = tmpVertices;
};

Cube.prototype.rotateY = function(angle) {
	var tmpVertices = [];
	for (var i=0; i<this.vertices.length; i++) {
		tmpVertices.push(this.vertices[i].rotateY(angle));
	}	
	this.vertices = tmpVertices;
};

Cube.prototype.rotateZ = function(angle) {
	var tmpVertices = [];
	for (var i=0; i<this.vertices.length; i++) {
		tmpVertices.push(this.vertices[i].rotateZ(angle));
	}	
	this.vertices = tmpVertices;
};


// var observer = new Point(-25, -25, -100);
Cube.prototype.drawLine = function(indexFrom, indexTo) {

	// begin point
	var from = indexFrom.project();
	// end point
	var to = indexTo.project();

	// drawing a line
	this.context.beginPath();
	this.context.moveTo(from.x, from.y);
	this.context.lineTo(to.x, to.y);
	this.context.closePath();
	this.context.strokeStyle = "#ccc";
	this.context.stroke();
};

Cube.prototype.draw = function() {
	this.context.clearRect(0, 0, 800, 600);

	this.drawLine(this.vertices[0], this.vertices[4]);
	this.drawLine(this.vertices[4], this.vertices[5]);
	this.drawLine(this.vertices[5], this.vertices[1]);
	this.drawLine(this.vertices[1], this.vertices[0]);
	this.drawLine(this.vertices[2], this.vertices[6]);
	this.drawLine(this.vertices[6], this.vertices[7]);
	this.drawLine(this.vertices[7], this.vertices[3]);
	this.drawLine(this.vertices[3], this.vertices[2]);
	this.drawLine(this.vertices[0], this.vertices[2]);
	this.drawLine(this.vertices[1], this.vertices[3]);
	this.drawLine(this.vertices[4], this.vertices[6]);
	this.drawLine(this.vertices[5], this.vertices[7]);
};

var observer = new Point(0, 0, -600);
// var spinPoint = new Point(0, 0, 0);
var angles = [0, 0, 0];

document.addEventListener("DOMContentLoaded", function() {
	var c = document.getElementById("screen");
	var ctx = c.getContext("2d");
	var x = 0, y = 1, z = 2;

	var inputs = document.querySelectorAll("input");
	for (var i=0; i<inputs.length; i++) {
		inputs[i].value = angles[i];
	}

	var setButton = document.querySelector("#set");
	setButton.addEventListener("click", function() {
		for(var i=0; i<inputs.length; i++) {
			angles[i] = parseFloat(inputs[i].value);
		}
	});


	// define cube
	var cube = new Cube(ctx);
	
	cube.addVertex(new Point(-100, 100, 100));
	cube.addVertex(new Point(100, 100, 100));
	cube.addVertex(new Point(-100, -100, 100));
	cube.addVertex(new Point(100, -100, 100));

	cube.addVertex(new Point(-100, 100, -100));
	cube.addVertex(new Point(100, 100, -100));
	cube.addVertex(new Point(-100, -100, -100));
	cube.addVertex(new Point(100, -100, -100));

	var angle = 1;
	console.log(cube);
	var interval = setInterval(
		function() {
			cube.rotateX(angles[0]);
			cube.rotateY(angles[1]);
			cube.rotateZ(angles[2]);
			cube.draw(cube.vertices);
		}, 10
	);
});
