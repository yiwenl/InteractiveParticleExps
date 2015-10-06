// ViewRipples.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewRipples() {
	bongiovi.View.call(this, null, glslify("../shaders/ripple.frag"));
}

var p = ViewRipples.prototype = new bongiovi.View();
p.constructor = ViewRipples;


p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(waves) {
	var waveCenters = [];
	var waveHeights = [];
	var numWaves = params.numWaves;
	for(var i=0; i<numWaves; i++) {
		if(waves[i]) {
			var w = waves[i];
			waveCenters.push(w.pos[0]);
			waveCenters.push(w.pos[1]);
			waveHeights.push(w.waveFront);
			waveHeights.push(w.waveHeight.value);
			waveHeights.push(w.waveLength);
		} else {
			waveCenters.push(0);
			waveCenters.push(0);
			waveHeights.push(0);
			waveHeights.push(0);
			waveHeights.push(0);
		}
	}

	// if(Math.random() > .99) console.log(waveCenters);

	this.shader.bind();
	this.shader.uniform("aspectRatio", "uniform1f", GL.aspectRatio);
	this.shader.uniform("waveCenters", "uniform2fv", waveCenters);
	this.shader.uniform("waveHeights", "uniform3fv", waveHeights);
	GL.draw(this.mesh);
};

module.exports = ViewRipples;