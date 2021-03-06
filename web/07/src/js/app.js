// app.js
window.bongiovi = require("./libs/bongiovi.js");
window.Sono     = require("./libs/sono.min.js");
var dat = require("dat-gui");

window.params = {
	skipCount:2,
	numParticles:100,
	mouse:true,
	auto:false,
	startFromCenter:true,
	decrease:.15,
	decreaseMultiply:.007,
	minThreshold:4.5,
	minGap:300,
	numWaves:20,
	renderSphere:true,
	renderParticles:true,
	renderAxis:false,
	renderHands:true,
	renderDots:true,
	debugFbo:false,
	sphereSize:150,
	grabStrength:0.1
};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {

		var loader = new bongiovi.SimpleImageLoader();
		var assets = ["assets/gold.jpg"];

		loader.load(assets, this, this._onImageLoaded);
	}

	var p = App.prototype;


	p._onImageLoaded = function(img) {
		window.images = img;

		if(document.body) this._init();
		else {
			window.addEventListener("load", this._init.bind(this));
		}
	};


	p._init = function() {
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.className = "Main-Canvas";
		document.body.appendChild(this.canvas);
		bongiovi.GL.init(this.canvas);

		this._scene = new SceneApp();
		bongiovi.Scheduler.addEF(this, this._loop);

		this.gui = new dat.GUI({width:300});
		this.gui.add(params, "renderSphere");
		this.gui.add(params, "renderParticles");
		this.gui.add(params, "renderAxis");
		this.gui.add(params, "renderHands");
		this.gui.add(params, "renderDots");
		this.gui.add(params, "grabStrength").listen();
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();