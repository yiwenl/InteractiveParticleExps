// ViewInteractiveLine.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewInteractiveLine(objPath, size, color, opacity) {
	this.size = size === undefined ? 100 : size;
	this.color = color === undefined ? [1, 1, 1] : color;
	this.opacity = opacity === undefined ? 1 : opacity;
	this._path = objPath;

	bongiovi.View.call(this, glslify("../shaders/interactiveSphere.vert"), glslify("../shaders/additiveColor.frag"));
}

var p = ViewInteractiveLine.prototype = new bongiovi.View();
p.constructor = ViewInteractiveLine;


p._init = function() {
	gl = GL.gl;
	var loader = new bongiovi.ObjLoader();
	loader.load(this._path, this._onObjLoaded.bind(this), null);
};

p._onObjLoaded = function(mesh, o) {
	var positions = [];
	var extra = [];
	var coords = [];
	var indices = []; 
	var count = 0;

	var ps = o.positions;
	var uv = o.coords;
	var cx, cy, cz;
	for(var i=0; i<ps.length; i+=3) {
		positions.push(ps[i]);
		positions.push(ps[i+1]);
		positions.push(ps[i+2]);

		cx = (ps[i][0] + ps[i+1][0] + ps[i+2][0])/3;
		cy = (ps[i][1] + ps[i+1][1] + ps[i+2][1])/3;
		cz = (ps[i][2] + ps[i+1][2] + ps[i+2][2])/3;

		extra.push([cx, cy, cz]);
		extra.push([cx, cy, cz]);
		extra.push([cx, cy, cz]);

		coords.push(uv[i]);
		coords.push(uv[i+1]);
		coords.push(uv[i+2]);

		indices.push(count * 3 + 0);
		indices.push(count * 3 + 1);
		indices.push(count * 3 + 1);
		indices.push(count * 3 + 2);
		indices.push(count * 3 + 2);
		indices.push(count * 3 + 0);

		count ++;
	}


	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.LINES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
	this.mesh.bufferData(extra, "aExtra", 3);
};


p.render = function(avoidCenter) {
	if(!this.mesh ) return;
	
	this.shader.bind();
	this.shader.uniform("color", "uniform3fv", this.color);
	this.shader.uniform("avoidCenter", "uniform3fv", avoidCenter);
	this.shader.uniform("opacity", "uniform1f", this.opacity);
	this.shader.uniform("size", "uniform1f", this.size);
	GL.draw(this.mesh);
};

module.exports = ViewInteractiveLine;