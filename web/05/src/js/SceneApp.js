// SceneApp.js

var GL = bongiovi.GL, gl;
var glm = bongiovi.glm;
var BeatDetector = require("./BeatDetector");

var ViewSave = require("./ViewSave");
var ViewRender = require("./ViewRender");
var ViewSimulation = require("./ViewSimulation");
var ViewSphere = require("./ViewSphere");
var ViewRipple = require("./ViewRipples");
var Wave = require("./Wave");
var glm = bongiovi.glm;

var random = function(min, max) { return min + Math.random() * (max - min);	}

function SceneApp() {
	gl = GL.gl;
	this._initSound();

	this.frame = 0;
	this.progress = 0;
	this.waves = [];
	this.x = new bongiovi.EaseNumber(-999, .2);
	this.y = new bongiovi.EaseNumber(-999, .2);
	bongiovi.Scene.call(this);

	window.addEventListener("resize", this.resize.bind(this));

	this.camera.lockRotation(false);
	this.sceneRotation.lock(true);
	this.cameraOthoScreen = new bongiovi.CameraPerspective();
	var eye            = glm.vec3.clone([0, 0, 500]  );
	var center         = glm.vec3.create( );
	var up             = glm.vec3.clone( [0,-1,0] );
	this.cameraOthoScreen.lookAt(eye, center, up);
	var W = window.innerWidth;
	var H = window.innerHeight;
	glm.mat4.ortho(this.cameraOthoScreen.projection, 0, W, H, 0, 0, 10000);

	// this.camera._rx.value = -.3;
	// this.camera._ry.value = -.1;

	this.count = 0;

	this.resize();
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initSound = function() {
	var that = this;
	this.sound = Sono.load({
	    url: ['assets/audio/03.mp3'],
	    // url: ['assets/audio/Oscillate.mp3'],
	    volume: 1.0,
	    loop: true,
	    onComplete: function(sound) {
	    	console.debug("Sound Loaded");
	    	// that.analyser = sound.effect.analyser(128);
	    	sound.play();

	    	that._beatDetector = new BeatDetector(sound);

	    	that._beatDetector.addEventListener("onBeat", that._onBeat.bind(that));
	    }
	});

	
};

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
	this._fboRipple 	= new bongiovi.FrameBuffer(512, 512);
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
	this._vRipple 	= new ViewRipple();


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
		this.x.value = Math.cos(this.frame) * window.innerHeight * .25 + window.innerWidth * .5;
		this.y.value = Math.sin(this.frame) * window.innerHeight * .25 + window.innerHeight * .5;	
	}
	

	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	this._fboTarget.bind();
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	GL.clear(0, 0, 0, 0);
	this._vSim.render(this._fboCurrent.getTexture(), this.x.value, this.y.value, 50.0, this._fboRipple.getTexture());
	this._fboTarget.unbind();


	var tmp = this._fboTarget;
	this._fboTarget = this._fboCurrent;
	this._fboCurrent = tmp;


	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);		
	GL.setViewport(0, 0, GL.width, GL.height);
};


p.render = function() {
	// this._getSoundData();

	if(this.count % params.skipCount == 0) {
		this.count = 0;
		this.updateFbo();
	}
	
	var percent = this.count / params.skipCount;
	this.count ++;
	GL.setViewport(0, 0, GL.width, GL.height);
	
	// this._vAxis.render();
	// this._vDotPlane.render();

	GL.setMatrices(this.cameraOthoScreen);
	GL.rotate(this.sceneRotation.matrix);
	this._vRender.render(this._fboTarget.getTexture(), this._fboCurrent.getTexture(), percent);
	this._vSphere.render(this.x.value, this.y.value);


	this._fboRipple.bind();
	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);
	GL.setViewport(0, 0, this._fboRipple.width, this._fboRipple.height);
	GL.clear(0, 0, 0, 0);
	this._vRipple.render(this.waves);
	this._fboRipple.unbind();

	GL.setViewport(0, 0, GL.width, GL.height);
	gl.disable(gl.DEPTH_TEST);
	this._vCopy.render(this._fboRipple.getTexture());
	gl.enable(gl.DEPTH_TEST);
};

p._onBeat = function(e) {
	var wh = Math.min(e.detail.value, 50.0)/50.0;
	var r = .2;
	var w = new Wave([.5 + random(-r, r), .5 + random(-r, r)], wh*.5 + .5, wh);
	// var w = new Wave([.5, .5], wh*.5 + .5);
	this.waves.push(w);
	if(this.waves.length > params.numWaves) this.waves.shift();
};


p.resize = function() {
	var W = window.innerWidth;
	var H = window.innerHeight;

	GL.setSize(W, H);
	this.camera.resize(GL.aspectRatio);

	glm.mat4.ortho(this.cameraOthoScreen.projection, 0, W, H, 0, 0, 10000);
};

module.exports = SceneApp;



// <iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/188056255&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>