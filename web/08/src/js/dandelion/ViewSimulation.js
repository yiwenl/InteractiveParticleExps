// ViewSimulation.js

var GL = bongiovi.GL;
var gl;
var glm = bongiovi.glm;
var glslify = require("glslify");

function ViewSimulation() {
	this._count = Math.random() * 0xFF;
	this.windDir = glm.vec3.create();
	this.stepper = 0;
	bongiovi.View.call(this, null, glslify("../../shaders/sim.frag"));
}

var p = ViewSimulation.prototype = new bongiovi.View();
p.constructor = ViewSimulation;


p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};


p.reset = function() {
	this.stepper = 0;
};

p.render = function(texture, invert) {
	this.shader.bind();
	glm.vec3.set(this.windDir, -1, -.5, -1);
	// glm.vec3.transformMat4(this.windDir, this.windDir, invert);
	// if(Math.random() > .9) console.log(this.windDir);
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("time", "uniform1f", this._count);
	this.shader.uniform("windDir", "uniform3fv", this.windDir);
	this.shader.uniform("invert", "uniformMatrix4fv", invert);
	this.shader.uniform("stepper", "uniform1f", this.stepper);
	texture.bind(0);
	GL.draw(this.mesh);

	this._count += .01;
	this.stepper += .005;
};

module.exports = ViewSimulation;