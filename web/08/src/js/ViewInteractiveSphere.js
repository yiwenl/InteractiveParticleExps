// ViewInteractiveSphere.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewInteractiveSphere(objPath, size, color, opacity, isPerlin) {
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

var p = ViewInteractiveSphere.prototype = new bongiovi.View();
p.constructor = ViewInteractiveSphere;


p._init = function() {	
	gl = GL.gl;
	var loader = new bongiovi.ObjLoader();
	loader.load(this.objPath, this._onObjLoaded.bind(this), null, false);
};

p._onObjLoaded = function(mesh, o) {
	this.mesh = mesh;
	var extra = [];
	var ps = o.positions;
	var cx, cy, cz;
	for(var i=0; i<ps.length; i+= 3) {
		cx = (ps[i][0] + ps[i+1][0] + ps[i+2][0])/3;
		cy = (ps[i][1] + ps[i+1][1] + ps[i+2][1])/3;
		cz = (ps[i][2] + ps[i+1][2] + ps[i+2][2])/3;

		extra.push([cx, cy, cz]);
		extra.push([cx, cy, cz]);
		extra.push([cx, cy, cz]);
	}


	this.mesh.bufferData(extra, "aExtra", 3);
};

p.render = function(avoidCenter, avoidCenter2) {
	if(!this.mesh ) return;
	this.shader.bind();

	this.shader.uniform("color", "uniform3fv", this.color);
	this.shader.uniform("opacity", "uniform1f", this.opacity);
	this.shader.uniform("size", "uniform1f", this.size);
	this.shader.uniform("seed", "uniform1f", this.seed);
	this.shader.uniform("avoidCenter", "uniform3fv", avoidCenter||[999,999,9999]);
	this.shader.uniform("avoidCenter2", "uniform3fv", avoidCenter2||[999,999,9999]);
	GL.draw(this.mesh);
};

module.exports = ViewInteractiveSphere;