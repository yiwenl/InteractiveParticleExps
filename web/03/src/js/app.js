// app.js
window.bongiovi = require("./libs/bongiovi.js");
// window.Sono     = require("./libs/sono.min.js");
// var dat = require("dat-gui");

window.params = {
	skipCount:3,
	numParticles:100,
	mouse:false,
	auto:false,
	startFromCenter:true
};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {

		//*/
		var loader = new bongiovi.SimpleImageLoader();
		var assets = ["assets/portrait.jpg"];
		loader.load(assets, this, this._onImageLoaded);
		/*/
		var that = this;
		this.img = new Image();
		this.img.crossOrigin = "Anonymous";
		this.img.onload = function() {
			that._onImageLoaded();
		}
		this.img.src = "http://www.bongiovi.tw/codepenAssets/portrait.jpg";
		//*/
	}

	var p = App.prototype;

	p._onImageLoaded = function(imgs) {
		if(imgs) {
			for(var s in imgs) {
				var img = imgs[s];	
			}	
		} else {
			var img = this.img;	
		}
		
		

		var canvas = document.createElement("canvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		var ctx = canvas.getContext("2d");

		var sx = window.innerWidth / img.width;
		var sy = window.innerHeight / img.height;
		var scale = Math.min(sx, sy);
		var W = img.width * scale;
		var H = img.height * scale;
		var tx = (window.innerWidth - W) * .5;
		var ty = (window.innerHeight - H) * .5;

		ctx.drawImage(img, 0, 0, img.width, img.height, tx, ty, W, H);
		canvas.className = "Main-Canvas";

		window.sourceImage = canvas;

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

		// this.gui = new dat.GUI({width:300});
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();