// ViewSphereCombined.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSphereCombined(objPath, size, color, opacity, isPerlin) {
	this.size = size === undefined ? 100 : size;
	this.color = color === undefined ? [1, 1, 1] : color;
	this.opacity = opacity === undefined ? 1 : opacity;
	this.objPath = objPath;
	this.seed = Math.random() * 0xFFFF;
	
	if(isPerlin) {
		bongiovi.View.call(this, glslify("../shaders/perlinSphere.vert"), glslify("../shaders/additiveColor.frag"));
	} else {
		bongiovi.View.call(this, glslify("../shaders/interactiveSphere.vert"), glslify("../shaders/interSphere.frag"));	
	}
}

var p = ViewSphereCombined.prototype = new bongiovi.View();
p.constructor = ViewSphereCombined;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function(texture) {
	if(!this.shader.isReady() ) return;

	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewSphereCombined;