// ViewRenderFace.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewRenderFace(vRender) {
	this.opacity = new bongiovi.EaseNumber(0);
	this._vRender = vRender;
	bongiovi.View.call(this, glslify("../../shaders/render.vert"), glslify("../../shaders/render.frag"));
}

var p = ViewRenderFace.prototype = new bongiovi.View();
p.constructor = ViewRenderFace;


p._init = function() {	
	gl = GL.gl;
	var points = this._vRender.allPoints;
	var uvs = this._vRender.uvs;
	var centers = this._vRender.centers;

	var positions    = [];
	var coords       = [];
	var indices      = []; 
	var centers      = [];
	var rotationAxis = [];
	var count        = 0;
	var numParticles = params.numParticles;


	function addFace(p0, p1, p2, uv, center) {
		positions.push(p0);
		positions.push(p1);
		positions.push(p2);
		coords.push(uv);
		coords.push(uv);
		coords.push(uv);
		centers.push(center);
		centers.push(center);
		centers.push(center);
		indices.push(count);
		indices.push(count+1);
		indices.push(count+2);
		count += 3;	
	}

	for(var i=0; i<points.length; i++) {
		var ps = points[i];
		var uv = uvs[i];
		var center = centers[i];

		if(i == 72/3) {
			addFace(ps[0], ps[1], ps[2], uv, center);
		}
	}
		

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};


p.render = function(texture) {

	if(!this.mesh) return;

	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("opacity", "uniform1f", this.opacity.value);
	texture.bind(0);
	GL.draw(this.mesh);
};


module.exports = ViewRenderFace;