// ViewLineSphere.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewLineSphere(objPath, size, color, fragPath) {
	this.color = color || [1, 1, 1];
	this.opacity = 1.0;
	this._path = objPath || "assets/sphere24.obj";
	this.size = size === undefined ? 100 : size;
	this.time = Math.random() * 0xFFF;
	if(!fragPath) {
		bongiovi.View.call(this, glslify("../shaders/lineSphere.vert"), glslify("../shaders/additiveColor.frag"));
	} else {
		console.log('Frag Path :', fragPath);
		bongiovi.View.call(this, glslify("../shaders/lineSphere.vert"), glslify("../shaders/lineSphere.frag"));
	}
	
}

var p = ViewLineSphere.prototype = new bongiovi.View();
p.constructor = ViewLineSphere;


p._init = function() {
	gl = GL.gl;
	var loader = new bongiovi.ObjLoader();
	loader.load(this._path, this._onObjLoaded.bind(this), null);
};

p._onObjLoaded = function(mesh, o) {
	var positions = [];
	var coords = [];
	var indices = []; 
	var count = 0;

	var ps = o.positions;
	var uv = o.coords;
	for(var i=0; i<ps.length; i+=3) {
		positions.push(ps[i]);
		positions.push(ps[i+1]);
		positions.push(ps[i+2]);

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
};

p.render = function() {
	if(!this.mesh ) return;
	this.time += .003;
	this.shader.bind();
	this.shader.uniform("color", "uniform3fv", this.color);
	this.shader.uniform("opacity", "uniform1f", this.opacity);
	this.shader.uniform("size", "uniform1f", this.size);
	this.shader.uniform("time", "uniform1f", this.time);
	GL.draw(this.mesh);
};

module.exports = ViewLineSphere;