var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSphere(size) {
	this.opacity = .2;
	this.color = [0.1, .45, .47];
	this.size = size === undefined ? 100 : size;
	bongiovi.View.call(this, glslify("../shaders/sphere.vert"), glslify("../shaders/sphere.frag"));
}

var p = ViewSphere.prototype = new bongiovi.View();
p.constructor = ViewSphere;


p._init = function() {	
	gl = GL.gl;
	var loader = new bongiovi.ObjLoader();
	loader.load("assets/sphere24.obj", this._onObjLoaded.bind(this), null, false);
};

p._onObjLoaded = function(mesh) {
	console.log('Obj loaded');
	this.mesh = mesh;
};


p.render = function() {
	if(!this.mesh ) return;
	this.shader.bind();

	this.shader.uniform("color", "uniform3fv", this.color);
	this.shader.uniform("opacity", "uniform1f", this.opacity);
	this.shader.uniform("size", "uniform1f", this.size);
	GL.draw(this.mesh);
};

module.exports = ViewSphere;