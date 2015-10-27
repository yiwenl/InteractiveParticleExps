// ViewLightSphere.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewLightSphere(scale) {
	this._scale = scale === undefined ? .85 : scale;
	bongiovi.View.call(this, glslify('../shaders/lightSphere.vert'), glslify('../shaders/lightSphere.frag'));
}

var p = ViewLightSphere.prototype = new bongiovi.View();
p.constructor = ViewLightSphere;


p._init = function() {
	gl = GL.gl;

	this.mesh = bongiovi.MeshUtils.createSphere(params.sphereSize*this._scale, 24);
};

p.render = function(pos, opacity) {
	var r = 200;
	pos = pos || [r, r, r];
	opacity = opacity === undefined ? .5 : opacity;
	this.shader.bind();
	this.shader.uniform("lightPos", "uniform3fv", pos);
	this.shader.uniform("opacity", "uniform1f", opacity);
	GL.draw(this.mesh);
};

module.exports = ViewLightSphere;