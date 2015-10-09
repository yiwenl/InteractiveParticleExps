// ViewRender2.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewRender2() {
	bongiovi.View.call(this, glslify("../shaders/render2.vert"), glslify("../shaders/render2.frag"));
}

var p = ViewRender2.prototype = new bongiovi.View();
p.constructor = ViewRender2;


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

p.render = function(texture, textureNext, percent, leapMatrix, leapDirection) {

	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("textureNext", "uniform1i", 1);
	textureNext.bind(1);
	this.shader.uniform("percent", "uniform1f", percent);
	this.shader.uniform("sphereSize", "uniform1f", params.sphereSize);
	this.shader.uniform("dimension", "uniform2fv", [GL.width, GL.height]);
	this.shader.uniform("leapMatrix", "uniformMatrix4fv", leapMatrix);
	this.shader.uniform("leapDirection", "uniform1f", leapDirection);
	GL.draw(this.mesh);
};

module.exports = ViewRender2;