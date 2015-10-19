// ViewPost.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewPost() {
	bongiovi.View.call(this, null, glslify("../shaders/post.frag"));
}

var p = ViewPost.prototype = new bongiovi.View();
p.constructor = ViewPost;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture, textureGradient, textureGradientMap) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("textureGradient", "uniform1i", 1);
	textureGradient.bind(1);
	this.shader.uniform("textureGradientMap", "uniform1i", 2);
	textureGradientMap.bind(2);
	GL.draw(this.mesh);
};

module.exports = ViewPost;