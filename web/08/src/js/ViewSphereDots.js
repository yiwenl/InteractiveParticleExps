// ViewSphereDots.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSphereDots(objPath, size, color, opacity, pointSize) {
	this.size = size === undefined ? 100 : size;
	this.color = color === undefined ? [1, 1, 1] : color;
	this.opacity = opacity === undefined ? 1 : opacity;
	this.pointSize = pointSize === undefined ? 1 : pointSize;
	this._path = objPath || "assets/sphere24.obj";

	bongiovi.View.call(this, glslify("../shaders/dots.vert"), glslify("../shaders/dots.frag"));
}

var p = ViewSphereDots.prototype = new bongiovi.View();
p.constructor = ViewSphereDots;


p._init = function() {
	gl = GL.gl;
	var loader = new bongiovi.ObjLoader();
	loader.load(this._path, this._onObjLoaded.bind(this), null, true, gl.POINTS);
};

p._onObjLoaded = function(mesh) {
	this.mesh = mesh;
};


p.render = function() {
	if(!this.mesh) return;
	this.shader.bind();
	this.shader.uniform("color", "uniform3fv", this.color);
	this.shader.uniform("opacity", "uniform1f", this.opacity);
	this.shader.uniform("size", "uniform1f", this.size);
	this.shader.uniform("pointSize", "uniform1f", this.pointSize);
	GL.draw(this.mesh);
};

module.exports = ViewSphereDots;