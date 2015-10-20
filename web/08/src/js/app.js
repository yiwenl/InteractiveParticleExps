// app.js
window.bongiovi = require("./libs/bongiovi.js");
var dat = require("dat-gui");
window.params = {
	sphereSize:250,
	numParticles:32,
	skipCount:5,

	group1:true,
	group2:false,
	group3:false,
	group4:true
};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {

		var assets = ["assets/gradient.jpg", "assets/gradientMap.jpg"]
		var loader = new bongiovi.SimpleImageLoader();
		loader.load(assets, this, this._onImageLoaded);
	}

	var p = App.prototype;

	p._onImageLoaded = function(img) {
		window.images = img;
		console.log(window.images);
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
		this.gui.add(params, "group1");
		this.gui.add(params, "group2");
		this.gui.add(params, "group3");
		this.gui.add(params, "group4");
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();