// SubsceneDandelion.js

var GL = bongiovi.GL;
var gl;

var ViewSave        = require("./ViewSave");
var ViewRender      = require("./ViewRender");
var ViewRenderFace  = require("./ViewRenderFace");
var ViewRenderLines = require("./ViewRenderLines");
var ViewSimulation  = require("./ViewSimulation");

function SubsceneDandelion(scene) {
	this.scene = scene;
	this._init();
	this._startRendering = false;
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
	this._vRenderLines = new ViewRenderLines(this._vRender);
	this._vRenderFace  = new ViewRenderFace(this._vRender);
	this._vSim         = new ViewSimulation();
	this._stepper = 0;

	this.reset();
};

p.start = function() {
	console.debug('Start flowing');
	this._startRendering = true;
	this._vRender.opacity.value = .5;
	this._vRenderLines.opacity.value = .5;
	this._vRenderFace.opacity.value = .1;
};

p.reset = function() {
	this._stepper = 0;
	this._startRendering = false;
	this._vRender.opacity.value = 0;
	this._vRenderLines.opacity.value = 0;
	this._vRenderFace.opacity.value = 0;
	GL.setMatrices(this.scene.cameraOtho);
	GL.rotate(this.scene.rotationFront);

	this._fboCurrent.bind();
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	GL.clear(0, 0, 0, 0);
	this._vSave.render();
	this._fboCurrent.unbind();

	this._vSim.reset();
};


p.update = function(invert) {
	if(!this._startRendering) return;
	this.invert = invert;
	GL.setMatrices(this.scene.cameraOtho);
	GL.rotate(this.scene.rotationFront);

	this._fboTarget.bind();
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	GL.clear(0, 0, 0, 0);
	this._vSim.render(this._fboCurrent.getTexture() , this.invert);
	this._fboTarget.unbind();


	var tmp = this._fboTarget;
	this._fboTarget = this._fboCurrent;
	this._fboCurrent = tmp;


	GL.setMatrices(this.scene.camera);
	GL.rotate(this.scene.sceneRotation.matrix);		
	GL.setViewport(0, 0, GL.width, GL.height);
};

p.render = function(invert) {
	if(!this._startRendering) return;
	this._stepper += .002;
	this.invert = invert;
	gl.disable(gl.CULL_FACE);
	this._vRender.render(this._fboCurrent.getTexture(), this._stepper);
	this._vRenderLines.render(this._fboCurrent.getTexture(), this._stepper);
	this._vRenderFace.render(this._fboCurrent.getTexture(), this._stepper);
	gl.enable(gl.CULL_FACE);
};

module.exports = SubsceneDandelion;