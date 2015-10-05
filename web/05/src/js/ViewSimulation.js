// ViewSimulation.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSimulation() {
	this._count = Math.random() * 0xFF;
	bongiovi.View.call(this, null, glslify("../shaders/sim.frag"));
}

var p = ViewSimulation.prototype = new bongiovi.View();
p.constructor = ViewSimulation;


p._init = function() {
	// console.log(GL.aspectRatio);
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture, x, y, radius, textureWave) {
	if(!this.shader.isReady() ) return;
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("textureWave", "uniform1i", 1);
	this.shader.uniform("time", "uniform1f", this._count);
	this.shader.uniform("radius", "uniform1f", radius);
	this.shader.uniform("aspectRatio", "uniform1f", GL.aspectRatio);
	this.shader.uniform("dimension", "uniform2fv", [GL.width, GL.height]);
	this.shader.uniform("center", "uniform3fv", [GL.width/2, GL.height/2, .0]);
	texture.bind(0);
	textureWave.bind(1);
	GL.draw(this.mesh);

	this._count += .01;
};

module.exports = ViewSimulation;