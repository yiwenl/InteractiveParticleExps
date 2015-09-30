// ViewRender.js
var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewRender() {
	this.color0 = [Math.random(), Math.random(), Math.random()];
	this.color1 = [Math.random(), Math.random(), Math.random()];

	this.color0 = [0, 0, 0];
	this.color1 = [1, 1, 1];

	bongiovi.View.call(this, glslify("../shaders/render.vert"), glslify("../shaders/render.frag"));
}

var p = ViewRender.prototype = new bongiovi.View();
p.constructor = ViewRender;


p._init = function() {
	gl = GL.gl;
	var positions    = [];
	var coords       = [];
	var indices      = []; 
	var count        = 0;
	var numParticles = params.numParticles;

	for(var j=0; j<numParticles; j++) {
		for(var i=0; i<numParticles; i++) {
			positions.push([0, 0, 0]);

			ux = i/numParticles;
			uy = j/numParticles;
			coords.push([ux, uy]);
			indices.push(count);
			count ++;

		}
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.POINTS);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function(texture, textureNext, percent) {

	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("textureNext", "uniform1i", 1);
	textureNext.bind(1);

	this.shader.uniform("percent", "uniform1f", percent);
	this.shader.uniform("color0", "uniform3fv", this.color0);
	this.shader.uniform("color1", "uniform3fv", this.color1);
	GL.draw(this.mesh);
};

module.exports = ViewRender;