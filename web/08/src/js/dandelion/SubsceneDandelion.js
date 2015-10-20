// SubsceneDandelion.js

var GL = bongiovi.GL;
var gl;

var ViewSave        = require("./ViewSave");
var ViewRender      = require("./ViewRender");
var ViewRenderLines = require("./ViewRenderLines");
var ViewSimulation  = require("./ViewSimulation");

function SubsceneDandelion(scene) {
	this.scene = scene;
	this._init();
}

var p = SubsceneDandelion.prototype;


p._init = function() {
	gl = GL.gl;
	var num = params.numParticles;
	var o = {
		minFilter:gl.NEAREST,
		magFilter:gl.NEAREST
	}
	this._fboCurrent   = new bongiovi.FrameBuffer(num*2, num*2, o);
	this._fboTarget    = new bongiovi.FrameBuffer(num*2, num*2, o);
	
	this._vSave        = new ViewSave();
	this._vRender      = new ViewRender();
	this._vRenderLines = new ViewRenderLines();
	this._vSim         = new ViewSimulation();

	GL.setMatrices(this.scene.cameraOtho);
	GL.rotate(this.scene.rotationFront);

	this._fboCurrent.bind();
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	this._vSave.render();
	this._fboCurrent.unbind();
};

p.update = function(invert) {
	this.invert = invert;
	GL.setMatrices(this.scene.cameraOtho);
	GL.rotate(this.scene.rotationFront);

	this._fboTarget.bind();
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	GL.clear(0, 0, 0, 0);
	this._vSim.render(this._fboCurrent.getTexture() , this.invert);
	// this._vSim.render(this._fboCurrent.getTexture() , this.sceneRotation.matrix);
	this._fboTarget.unbind();


	var tmp = this._fboTarget;
	this._fboTarget = this._fboCurrent;
	this._fboCurrent = tmp;


	GL.setMatrices(this.scene.camera);
	GL.rotate(this.scene.sceneRotation.matrix);		
	GL.setViewport(0, 0, GL.width, GL.height);
};

p.render = function(invert) {
	this.invert = invert;
	gl.disable(gl.CULL_FACE);
	this._vRender.render(this._fboCurrent.getTexture());
	this._vRenderLines.render(this._fboCurrent.getTexture());
	gl.enable(gl.CULL_FACE);
};

module.exports = SubsceneDandelion;