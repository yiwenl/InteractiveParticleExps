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

p.render = function(texture, x, y, radius, waves) {
	var waveCenters = [];
	var waveHeights = [];
	var numWaves = params.numWaves;
	for(var i=0; i<numWaves; i++) {
		if(waves[i]) {
			var w = waves[i];
			waveCenters.push(w.pos[0]);
			waveCenters.push(w.pos[1]);
			waveCenters.push(w.pos[2]);
			waveHeights.push(w.waveFront);
			waveHeights.push(w.waveHeight.value);
			waveHeights.push(w.waveLength);

		} else {
			waveCenters.push(0);
			waveCenters.push(0);
			waveCenters.push(0);
			waveHeights.push(0);
			waveHeights.push(0);
			waveHeights.push(0);
		}
	}

	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("time", "uniform1f", this._count);
	this.shader.uniform("cx", "uniform1f", x);
	this.shader.uniform("cy", "uniform1f", y);
	this.shader.uniform("radius", "uniform1f", radius);
	this.shader.uniform("aspectRatio", "uniform1f", GL.aspectRatio);
	this.shader.uniform("sphereSize", "uniform1f", params.sphereSize);
	this.shader.uniform("dimension", "uniform2fv", [GL.width, GL.height]);
	this.shader.uniform("center", "uniform3fv", [GL.width/2, GL.height/2, .0]);

	this.shader.uniform("waveCenters", "uniform3fv", waveCenters);
	this.shader.uniform("waveHeights", "uniform3fv", waveHeights);
	texture.bind(0);
	GL.draw(this.mesh);

	this._count += .01;
};

module.exports = ViewSimulation;