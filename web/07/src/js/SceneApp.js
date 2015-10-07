// SceneApp.js

var GL = bongiovi.GL, gl;
var glm = bongiovi.glm;
var BeatDetector = require("./BeatDetector");

var ViewSave = require("./ViewSave");
var ViewRender = require("./ViewRender");
var ViewRender2 = require("./ViewRender2");
var ViewSimulation = require("./ViewSimulation");
var ViewSphere = require("./ViewSphere");
var ViewRipple = require("./ViewRipples");
var ViewGlobe = require("./ViewGlobe");
var Wave = require("./Wave");
var glm = bongiovi.glm;

var yOffset = -150;
var zOffset = 100;

var random = function(min, max) { return min + Math.random() * (max - min);	}

function SceneApp() {
	gl = GL.gl;
	this._initLeap();

	this.frame = 0;
	this.progress = 0;
	this.waves = [];
	this.handLeft = [-999, -999, -999];
	this.handRight = [-999, -999, -999];
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

	this.camera._rx.value = -.3;
	this.camera._ry.value = -.3;
	this.camera.radius.value = 650;

	this.count = 0;

	this.resize();
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initLeap = function() {
	var that = this;
	
	this._fingers = [];
	this._pointers = [];
	Leap.loop({
		frame: function(frame) {
			var hands = frame.hands;
			that._fingers = [];
			that.handLeft = [0, 0, -99999];
			that.handRight = [0, 0, -99999];

			var newPointers = [];
			if(hands.length >= 1) {
				for(var i=0; i<hands.length;i++) {
					var hand = hands[i];
					if(i == 0) {
						params.grabStrength = hand.grabStrength;
					}
					
					if(hand.type === 'right') {
						that.handRight = hand.palmPosition;
						that.handRight[1] += yOffset;
						that.handRight[2] += zOffset;
					} else if(hand.type === 'left') {
						that.handLeft = hand.palmPosition;
						that.handLeft[1] += yOffset;
						that.handLeft[2] += zOffset;
					}
					var pointables = hand.pointables;
					for(var j=0; j<pointables.length; j++) {
						var p = pointables[j];
						var pointer = glm.vec3.clone(p.tipPosition);
						pointer[1] += yOffset;
						pointer[2] += zOffset;
						that._fingers.push(pointer);
						newPointers.push(p.id);
						that._checkPointers(p);
					}
				}
			}

			that._clearPointers(newPointers);
		}

	});
	
};

p._clearPointers = function(newPointers) {
	if(this._pointers.length == 0 ) return;
	if(newPointers.length == 0) {
		this._pointers = [];
		return;
	}

	var tmp = [];

	for(var i=0; i<this._pointers.length; i++) {
		if(newPointers.indexOf(this._pointers[i].id) > -1) {
			tmp.push(this._pointers[i]);
		}
	}

	this._pointers = tmp;
};


p._checkPointers = function(pointer) {
	for(var i=0; i<this._pointers.length; i++) {
		var p = this._pointers[i];
		if(p.id == pointer.id) {
			p.oldPos = glm.vec3.clone(p.pos);
			p.pos[0] = pointer.tipPosition[0];
			p.pos[1] = pointer.tipPosition[1] + yOffset;
			p.pos[2] = pointer.tipPosition[2] + zOffset;

			return;
		}
	}

	var pos = glm.vec3.clone(pointer.tipPosition);
	pos[1] += yOffset;
	pos[2] += zOffset;

	var o = {
		id:pointer.id,
		pos : pos,
		oldPos : glm.vec3.clone(pos),
		touched : false
	}

	this._pointers.push(o);
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
	this._vGlobe	= new ViewGlobe();	
	this._vRender2  = new ViewRender2();


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
	this._vSim.render(this._fboCurrent.getTexture(), this.x.value, this.y.value, 150.0, this.waves);
	this._fboTarget.unbind();


	var tmp = this._fboTarget;
	this._fboTarget = this._fboCurrent;
	this._fboCurrent = tmp;


	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);		
	GL.setViewport(0, 0, GL.width, GL.height);
};

p._checkTouched = function() {
	for(var i=0; i<this._pointers.length; i++) {
		var p = this._pointers[i];
		if(!p.lengthOld) {
			var lOld = glm.vec3.length(p.oldPos);	
		} else {
			var lOld = p.lengthNew;
		}
		
		var lNew = glm.vec3.length(p.pos);

		p.lengthOld = lOld;
		p.lengthNew = lNew;
		if(lOld > params.sphereSize && lNew < params.sphereSize) {
			var wh = Math.random() * .5 + .5;
			var r = 1;
			var w = new Wave(p.pos, wh*.75 + .5, wh);
			this.waves.push(w);
			if(this.waves.length > params.numWaves) this.waves.shift();
		}
	}
};


p.render = function() {
	this._checkTouched();

	if(this.count % params.skipCount == 0) {
		this.count = 0;
		this.updateFbo();
	}
	
	var percent = this.count / params.skipCount;
	this.count ++;
	GL.setViewport(0, 0, GL.width, GL.height);
	
	if(params.renderAxis) this._vAxis.render();
	if(params.renderDots) this._vDotPlane.render();

	if(params.renderHands) {
		for(var i=0; i<this._pointers.length; i++) {
			var p = this._pointers[i];

			this._vSphere.render(p.pos, p.lengthNew > params.sphereSize ? [1.0, 1.0, 1.0] : [1.0, .6, .2]);	
		}	

		this._vSphere.render(this.handLeft, [1, .5, 0]);
		this._vSphere.render(this.handRight, [1, .5, 0]);
	}
	
	if(params.renderParticles) {
		this._vRender.render(this._fboTarget.getTexture(), this._fboCurrent.getTexture(), percent);
		this._vRender2.render(this._fboTarget.getTexture(), this._fboCurrent.getTexture(), percent);	
	}
	
	if(params.renderSphere) {
		this._vGlobe.render(this.handLeft, this.handRight, this._pointers);	
	}
	
};

p._onBeat = function(e) {
	var wh = Math.min(e.detail.value, 50.0)/50.0;
	var r = 1;
	var w = new Wave([ random(-r, r), random(-r, r), random(-r, r)], wh*.75 + .5, wh);
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