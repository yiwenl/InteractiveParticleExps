// SceneApp.js

var GL = bongiovi.GL, gl;
var glm = bongiovi.glm;
var SoundCloudLoader = require("./SoundCloudLoader");
var ViewSave = require("./ViewSave");
var ViewRender = require("./ViewRender");
var ViewSimulation = require("./ViewSimulation");
var ViewSphere = require("./ViewSphere");
var glm = bongiovi.glm;

function SceneApp() {
	gl = GL.gl;
	this.frame = 0;
	this.progress = 0;
	this.center = [0, 0, 0];
	bongiovi.Scene.call(this);

	window.addEventListener("resize", this.resize.bind(this));

	// this.camera.lockRotation(false);
	// this.sceneRotation.lock(true);

	this.count = 0;

	this.resize();
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	if(!gl) gl = GL.gl;

	var num = params.numParticles;
	var o = {
		minFilter:gl.NEAREST,
		magFilter:gl.NEAREST
	}
	this._fboCurrent 	= new bongiovi.FrameBuffer(num*2, num*2, o);
	this._fboTarget 	= new bongiovi.FrameBuffer(num*2, num*2, o);

	this._texturePortrait = new bongiovi.GLTexture(sourceImage);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis     = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	this._vSave     = new ViewSave();
	this._vCopy 	= new bongiovi.ViewCopy();
	this._vRender 	= new ViewRender();
	this._vSim 		= new ViewSimulation();
	this._vSphere 	= new ViewSphere();


	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	this._fboCurrent.bind();
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	this._vSave.render();
	this._fboCurrent.unbind();

	var that = this;
	window.addEventListener('mousemove', function(e) {
		if(params.mouse) {
			that.x.value = e.clientX;
			that.y.value = e.clientY;	
		}
		
	});
};


p.updateFbo = function() {
	this.frame += .01;
	this.progress += .1;

	if(params.auto) {
		var radius = 125.0;
		this.center[0] = Math.cos(this.frame) * radius;
		this.center[1] = Math.cos(this.frame + Math.sin(this.frame * .5)) * radius;
		this.center[2] = Math.sin(this.frame) * radius;
	}
	

	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	this._fboTarget.bind();
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	GL.clear(0, 0, 0, 0);
	this._vSim.render(this._fboCurrent.getTexture(), this.center, 30.0, this._texturePortrait, this.progress);
	this._fboTarget.unbind();


	var tmp = this._fboTarget;
	this._fboTarget = this._fboCurrent;
	this._fboCurrent = tmp;


	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);		
	GL.setViewport(0, 0, GL.width, GL.height);
};


p.render = function() {
	

	if(this.count % params.skipCount == 0) {
		this.count = 0;
		this.updateFbo();
	}
	
	var percent = this.count / params.skipCount;
	this.count ++;
	GL.setViewport(0, 0, GL.width, GL.height);
	
	this._vAxis.render();
	this._vDotPlane.render();

	this._vRender.render(this._fboTarget.getTexture(), this._fboCurrent.getTexture(), percent, this._texturePortrait, this.progress);
	this._vSphere.render(this.center);
};


p.resize = function() {
	var scale = 1;
	var W = Math.min(1920 * scale, window.innerWidth * scale);
	GL.setSize(W, W*window.innerHeight/window.innerWidth);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;



// <iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/188056255&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>