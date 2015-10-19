// SceneApp.js

var GL                    = bongiovi.GL, gl;
var glm                   = bongiovi.glm;
var ViewSphere            = require("./ViewSphere");
var ViewLineSphere        = require("./ViewLineSphere");
var ViewDots              = require("./ViewDots");
var ViewInteractiveSphere = require("./ViewInteractiveSphere");
var ViewSphereDots        = require("./ViewSphereDots");
var ViewInteractiveLine   = require("./ViewInteractiveLine");
var ViewSingleDot         = require("./ViewSingleDot");
var ViewInteractiveDot    = require("./ViewInteractiveDot");
var LeapControl           = require("./LeapControl");
var TouchDetection        = require("./TouchDetection");

var ViewSave              = require("./ViewSave");
var ViewRender            = require("./ViewRender");
var ViewSimulation        = require("./ViewSimulation");
var ViewPost              = require("./ViewPost");

var yOffset = -250;
var zOffset = 100;

function SceneApp() {
	this.frame = 0;
	this.seed = Math.random() * 0xFFFF;
	this.seed2 = Math.random() * 0xFFFF;
	this.circlePos = [0, 0, 0];
	gl = GL.gl;
	GL.enableAdditiveBlending();
	gl.disable(gl.DEPTH_TEST);
	bongiovi.Scene.call(this);
	this.camera.setPerspective(65 * Math.PI/180, GL.aspectRatio, 5, 2500);
	this.camera.radius.value = 750;
	this.camera._rx.value = -.3;
	this.invert = glm.mat4.create();

	// this.sceneRotation.lock(true);
	this._initLeap();
	this._touch = new TouchDetection(params.sphereSize * .8, this);

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initLeap = function() {
	this._leapControl = new LeapControl();
	var that = this;
	this.handLeft = [-999, -999, -999];
	this.handRight = [-999, -999, -999];

	this._fingers = [];
	this._pointers = [];
	Leap.loop({
		frame: function(frame) {
			var hands = frame.hands;
			that._fingers = [];
			that.preLeftY = that.handLeft[1];
			that.preRightY = that.handRight[1];
			that.oldHandLeft = glm.vec3.clone(that.handLeft);
			that.oldHandRight = glm.vec3.clone(that.handRight);
			that.handLeft = [0, 0, -99999];
			that.handRight = [0, 0, -99999];

			var newPointers = [];
			var hasErrorDetection = false;
			if(hands.length >= 1) {
				for(var i=0; i<hands.length;i++) {
					var hand = hands[i];

					if(hand.type === 'right') {
						// console.log(Math.abs(hand.palmPosition[1] + yOffset - that.preRightY), hand.palmPosition[1]+yOffset, that.preRightY);
						if( Math.abs(hand.palmPosition[1] + yOffset - that.preRightY) > 100) {
							hasErrorDetection = true;
							that.handRight = that.oldHandRight;
						} else {
							that.handRight = hand.palmPosition;
							that.handRight[1] += yOffset;
							that.handRight[2] += zOffset;	
						}
						
					} else if(hand.type === 'left') {
						if( Math.abs(hand.palmPosition[1] + yOffset - that.preLeftY) > 100) {
							hasErrorDetection = true;
							that.handLeft = that.oldHandLeft;
						} else {
							that.handLeft = hand.palmPosition;
							that.handLeft[1] += yOffset;
							that.handLeft[2] += zOffset;	
						}
						
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

			if(!hasErrorDetection) {
				that._leapControl.updatePointers(that._pointers, frame);	
			}
			
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

	var num = params.numParticles;
	var o = {
		minFilter:gl.NEAREST,
		magFilter:gl.NEAREST
	}
	this._fboCurrent 	= new bongiovi.FrameBuffer(num*2, num*2, o);
	this._fboTarget 	= new bongiovi.FrameBuffer(num*2, num*2, o);

	var scale 			= 2;
	var w 				= Math.min(1920 * scale, GL.width * scale);
	var h 				= w / GL.aspectRatio;
	this._fboRender		= new bongiovi.FrameBuffer(w, h);

	this._textureGrd 	= new bongiovi.GLTexture(images.gradient);
	this._textureGrdMap = new bongiovi.GLTexture(images.gradientMap);
};

p._initViews = function() {
	console.log('Init Views');
	// this._vAxis = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();

	this.dot = new ViewSingleDot();


	var radius1 = params.sphereSize * .8;
	// var radius2 = params.sphereSize * .6;
	var radius3 = params.sphereSize * .7;
	var radius4 = params.sphereSize * .65;

	//	PARTICLES
	this._vSave     = new ViewSave();
	this._vRender 	= new ViewRender();
	this._vSim 		= new ViewSimulation();
	this._vCopy 	= new bongiovi.ViewCopy();
	this._vPost 	= new ViewPost();

	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	this._fboCurrent.bind();
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	this._vSave.render();
	this._fboCurrent.unbind();


	//	RADIUS 1 GROUP
	this._vDots = new ViewDots(radius1+2);
	this._vDots.color = [0.85, .95, .9];
	this._vSphereDot1 = new ViewInteractiveDot("assets/sphere24.obj", radius1, [1, 1, 1], 1);
	this._vSphereDot1.pointSize = 3.0;
	this._vInterLine1 = new ViewInteractiveLine("assets/sphere24.obj", radius1, [1, 1, 1], .25);
	this._vInterSphere1 = new ViewInteractiveSphere("assets/sphere24.obj", radius1, [0.1, .65, .47], .75);


	//	RADIUS 3 GROUP
	this._vInterSphere2 = new ViewInteractiveSphere("assets/sphere60.obj", radius3, [0.1, .45, .47], .5, true);
	this._vInterLine2 = new ViewInteractiveLine("assets/sphere60.obj", radius3, [1, 1, 1], .25, true);
	this._vInterDot2 = new ViewInteractiveDot("assets/sphere60.obj", radius3, [1, 1, 1], .5, true);
	this._vInterDot2.pointSize = 2.0;


	//	RADIUS 4 GROUP
	this._vInterSphere3 = new ViewInteractiveSphere("assets/sphere60.obj", radius4, [0.1, .45, .47], .25, true);
	this._vInterLine3 = new ViewInteractiveLine("assets/sphere60.obj", radius4, [1, 1, 1], .25, true);
	this._vInterDot3 = new ViewInteractiveDot("assets/sphere60.obj", radius4, [1, 1, 1], .5, true);
	this._vInterDot3.pointSize = 2.0;
	
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
	}
};

p.updateFbo = function() {
	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	this._fboTarget.bind();
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	GL.clear(0, 0, 0, 0);
	this._vSim.render(this._fboCurrent.getTexture() , this.invert);
	// this._vSim.render(this._fboCurrent.getTexture() , this.sceneRotation.matrix);
	this._fboTarget.unbind();


	var tmp = this._fboTarget;
	this._fboTarget = this._fboCurrent;
	this._fboCurrent = tmp;


	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);		
	GL.setViewport(0, 0, GL.width, GL.height);
};

p.render = function() {
	
	var hl = glm.vec3.clone(this.handLeft);
	var hr = glm.vec3.clone(this.handRight);
	var inv = glm.vec3.fromValues(-1, -1, 1);
	glm.mat4.invert(this.invert, this.sceneRotation.matrix);
	glm.vec3.mul(hl, hl, inv);
	glm.vec3.mul(hr, hr, inv);
	glm.vec3.transformMat4(hl, hl, this.invert);
	glm.vec3.transformMat4(hr, hr, this.invert);

	this._checkTouched();

	this.updateFbo();

	this._fboRender.bind();
	GL.setViewport(0, 0, this._fboRender.width, this._fboRender.height);
	GL.enableAdditiveBlending();
	GL.clear(0, 0, 0, 0);
	this.dot.render(hl);
	this.dot.render(hr);

	this.frame += .01;


	//	PARTICLE
	this._vRender.render(this._fboCurrent.getTexture());

	//*/
	//	GROUP 2
	this._vDots.render();
	this._vSphereDot1.render(hr, hl);
	this._vInterSphere1.render(hr, hl);
	this._vInterLine1.render(hr, hl);
	//*/

	//*/
	//	GROUP 3
	this.seed += .0015;
	this._vInterSphere2.seed = this._vInterLine2.seed = this._vInterDot2.seed = this.seed;
	this._vInterSphere2.render();
	this._vInterLine2.render();
	this._vInterDot2.render();
	//*/

	//*/
	//	GROUP 4
	this._vInterSphere3.seed = this._vInterLine3.seed = this._vInterDot3.seed = this.seed2;
	this._vInterSphere3.render();
	this._vInterLine3.render();
	this._vInterDot3.render();
	//*/

	this._fboRender.unbind();


	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);
	GL.setViewport(0, 0, GL.width, GL.height);
	// this._vCopy.render(this._fboRender.getTexture());
	GL.enableAlphaBlending();
	this._vPost.render(this._fboRender.getTexture(), this._textureGrd, this._textureGrdMap);
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
	var scale 			= 2;
	var w 				= Math.min(1920 * scale, GL.width * scale);
	var h 				= w / GL.aspectRatio;
	this._fboRender		= new bongiovi.FrameBuffer(w, h);
};

module.exports = SceneApp;