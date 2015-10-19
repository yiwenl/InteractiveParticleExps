// SceneApp.js

var GL                    = bongiovi.GL, gl;
var ViewSphere            = require("./ViewSphere");
var ViewLineSphere        = require("./ViewLineSphere");
var ViewDots              = require("./ViewDots");
var ViewInteractiveSphere = require("./ViewInteractiveSphere");
var ViewSphereDots        = require("./ViewSphereDots");
var ViewInteractiveLine   = require("./ViewInteractiveLine");
var ViewSingleDot         = require("./ViewSingleDot");
var ViewInteractiveDot    = require("./ViewInteractiveDot");

function SceneApp() {
	this.frame = 0;
	this.seed = Math.random() * 0xFFFF;
	this.circlePos = [0, 0, 0];
	gl = GL.gl;
	GL.enableAdditiveBlending();
	gl.disable(gl.DEPTH_TEST);
	bongiovi.Scene.call(this);
	this.camera.setPerspective(65 * Math.PI/180, GL.aspectRatio, 5, 2500);
	this.camera.radius.value = 1500;

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
};

p._initViews = function() {
	console.log('Init Views');
	// this._vAxis = new bongiovi.ViewAxis();
	// this._vDotPlane = new bongiovi.ViewDotPlane();

	this.dot = new ViewSingleDot();


	var radius1 = params.sphereSize * .8;
	var radius2 = params.sphereSize * .6;
	var radius3 = params.sphereSize * .7;

	//	RADIUS 2 GROUP
	this._vSphere = new ViewSphere(radius2-2);
	this._vSphere.opacity = .25;
	this._vLineSphere = new ViewLineSphere("assets/sphere24.obj", radius2, [1, 1, 1]);
	this._vLineSphere.opacity = .1;
	this._vLineSphere48 = new ViewLineSphere("assets/sphere60.obj", radius2, [.75, .95, .9], "../shaders/lineSphere.frag");
	this._vLineSphere48.opacity = .25;
	this._vSphereDot2 = new ViewSphereDots("assets/sphere24.obj", radius2, [1, 1, 1], 1);
	this._vSphereDot2.pointSize = 5.0;


	//	RADIUS 1 GROUP
	this._vDots = new ViewDots(radius1+2);
	this._vDots.color = [0.85, .95, .9];
	this._vSphereDot1 = new ViewInteractiveDot("assets/sphere24.obj", radius1, [1, 1, 1], 1);
	this._vSphereDot1.pointSize = 3.0;
	this._vInterLine1 = new ViewInteractiveLine("assets/sphere24.obj", radius1, [1, 1, 1], .25);
	this._vInterSphere1 = new ViewInteractiveSphere("assets/sphere24.obj", radius1, [0.1, .45, .47], .75);


	//	RADIUS 3 GROUP
	this._vInterSphere2 = new ViewInteractiveSphere("assets/sphere72.obj", radius3, [0.1, .45, .47], .25, true);
	this._vInterLine2 = new ViewInteractiveLine("assets/sphere72.obj", radius3, [1, 1, 1], .25, true);
	this._vInterDot2 = new ViewInteractiveDot("assets/sphere72.obj", radius3, [1, 1, 1], .5, true);
	this._vInterDot2.pointSize = 2.0;
	
};

p.render = function() {
	this.camera._rx.value = (Math.sin(this.frame*.17454) + Math.cos(this.frame*.328675)) * .2;
	this.camera._ry.value += .005;
	var r = params.sphereSize * .85;
	this.circlePos[0] = r * Math.cos(this.frame);
	this.circlePos[1] = 50 * Math.cos(this.frame*.3489705098 + Math.sin(this.frame * .7));
	this.circlePos[2] = r * Math.sin(this.frame);
	this.dot.render(this.circlePos);

	this.frame += .01;
	
	//*/
	//	GROUP 1 
	this._vSphere.render();
	this._vLineSphere.render();
	this._vLineSphere48.render();
	this._vSphereDot2.render();
	//*/

	//*/
	//	GROUP 2
	this._vDots.render();
	this._vSphereDot1.render(this.circlePos);
	this._vInterSphere1.render(this.circlePos);
	this._vInterLine1.render(this.circlePos);
	//*/

	//	GROUP 3
	this.seed += .0015;
	this._vInterSphere2.seed = this._vInterLine2.seed = this._vInterDot2.seed = this.seed;
	this._vInterSphere2.render();
	this._vInterLine2.render();
	this._vInterDot2.render();
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;