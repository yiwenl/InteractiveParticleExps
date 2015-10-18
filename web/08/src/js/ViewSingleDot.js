// ViewSingleDot.js

var GL = bongiovi.GL;
var gl;

function ViewSingleDot() {
	bongiovi.View.call(this, bongiovi.ShaderLibs.get("generalVert"), bongiovi.ShaderLibs.get("simpleColorFrag"));
}

var p = ViewSingleDot.prototype = new bongiovi.View();
p.constructor = ViewSingleDot;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createSphere(10, 10);
};

p.render = function(pos, color) {
	this.shader.bind();
	this.shader.uniform("position", "uniform3fv", pos);
	var scale = 1;
	this.shader.uniform("scale", "uniform3fv", [scale, scale, scale]);
	this.shader.uniform("color", "uniform3fv", color || [ 1, 1, 1 ]);
	this.shader.uniform("opacity", "uniform1f", 1);
	GL.draw(this.mesh);
};

module.exports = ViewSingleDot;