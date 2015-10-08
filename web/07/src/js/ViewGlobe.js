// ViewGlobe.js

var GL = bongiovi.GL;
var gl;
var glm = bongiovi.glm;
var glslify = require("glslify");

function ViewGlobe() {
	bongiovi.View.call(this, glslify("../shaders/globe.vert"), glslify("../shaders/globe.frag"));
}

var p = ViewGlobe.prototype = new bongiovi.View();
p.constructor = ViewGlobe;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createSphere(params.sphereSize-6, 24);
};

p.render = function(light0, light1, pointers) {
	var positions = [];
	for(var i=0; i<10; i++) {
		var p = pointers[i];
		if (p) {
			var l = glm.vec3.length(p.pos);
			if(l > params.sphereSize || 1){
				positions.push(p.pos[0]);
				positions.push(p.pos[1]);
				positions.push(p.pos[2]);	
			} else {
				positions.push(0);
				positions.push(0);
				positions.push(0);	
			}
			
		} else {
			positions.push(0);
			positions.push(0);
			positions.push(0);
		}
	}


	this.shader.bind();
	this.shader.uniform("light0", "uniform3fv", light0);
	this.shader.uniform("light1", "uniform3fv", light1);
	this.shader.uniform("pointers", "uniform3fv", positions);
	this.shader.uniform("ambient", "uniform3fv", [0, 0, 0]);
	this.shader.uniform("lightAmount", "uniform1f", 0);
	this.shader.uniform("opacity", "uniform1f", 1);
	GL.draw(this.mesh);
};

module.exports = ViewGlobe;