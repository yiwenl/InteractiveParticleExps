// ViewInteractiveDot.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewInteractiveDot(objPath, size, color, opacity, isPerlin) {
	this.size = size === undefined ? 100 : size;
	this.color = color === undefined ? [1, 1, 1] : color;
	this.opacity = opacity === undefined ? 1 : opacity;
	this.objPath = objPath;
	this.pointSize = 2.0;
	this.seed = 0;

	// bongiovi.View.call(this, glslify("../shaders/interactiveSphere.vert"), glslify("../shaders/additiveColor.frag"));
	

	if(isPerlin) {
		bongiovi.View.call(this, glslify("../shaders/perlinSphereDot.vert"), glslify("../shaders/interactiveDot.frag"));
	} else {
		bongiovi.View.call(this, glslify("../shaders/interactiveSphereDot.vert"), glslify("../shaders/dots.frag"));
	}
}

var p = ViewInteractiveDot.prototype = new bongiovi.View();
p.constructor = ViewInteractiveDot;


p._init = function() {	
	gl = GL.gl;
	var loader = new bongiovi.ObjLoader();
	loader.load(this.objPath, this._onObjLoaded.bind(this), null, false, gl.POINTS);
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


p.render = function(avoidCenter, avoidCenter2, globalOpacity) {
	if(!this.mesh ) return;
	this.shader.bind();

	globalOpacity = globalOpacity === undefined ? 1 : globalOpacity;

	this.shader.uniform("color", "uniform3fv", this.color);
	this.shader.uniform("opacity", "uniform1f", this.opacity * globalOpacity);
	this.shader.uniform("size", "uniform1f", this.size);
	this.shader.uniform("pointSize", "uniform1f", this.pointSize);
	this.shader.uniform("seed", "uniform1f", this.seed);
	this.shader.uniform("avoidCenter", "uniform3fv", avoidCenter||[999,999,9999]);
	this.shader.uniform("avoidCenter2", "uniform3fv", avoidCenter2||[999,999,9999]);
	GL.draw(this.mesh);
};

module.exports = ViewInteractiveDot;