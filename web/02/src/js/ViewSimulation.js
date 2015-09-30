// ViewSimulation.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");
var random = function(min, max) { return min + Math.random() * (max - min);	}

function ViewSimulation() {
	this._count = Math.random() * 0xFF;

	var numHoles = 5;
	this._holes = [];
	for(var i=0; i<numHoles; i++) {
		this._holes.push(random(-1,1));
		this._holes.push(random(-1,1));
		this._holes.push(random(-1,1));
	}


	bongiovi.View.call(this, null, glslify("../shaders/sim.frag"));
}

var p = ViewSimulation.prototype = new bongiovi.View();
p.constructor = ViewSimulation;


p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture) {
	if(!this.shader.isReady() ) return;

	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("time", "uniform1f", this._count);
	this.shader.uniform("holes", "uniform3fv", this._holes);
	texture.bind(0);
	GL.draw(this.mesh);

	this._count += .1;
};

module.exports = ViewSimulation;