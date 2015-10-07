// BeatDetector.js
var EventDispatcher = require("./EventDispatcher");

function BeatDetector(sound) {
	this.decreaseMultiply = .007;
	this.minGap           = 300;
	this.decrease         = .15;
	this.minThreshold     = 4.5;
	this._sound           = sound;
	this._init();
}

var p = BeatDetector.prototype = new EventDispatcher();

p._init = function() {
	this.analyser = this._sound.effect.analyser(128);
	this.sum = 0;
	this.easeSum = new bongiovi.EaseNumber(0, .25);
	this._sumBeat = 0;
	this._maxSumBeat = 0;
	this._hasBeats = false;
	bongiovi.Scheduler.addEF(this, this._loop);
};


p._loop = function() {
	// console.log(this._sound);
	if(this.analyser) {
		this.frequencies = this.analyser.getFrequencies();
	} else {
		return;
	}

	var f = this.analyser.getFrequencies();

	var sum = 0;

	for(var i=0; i<f.length; i++) {
		var index = i * 4;
		sum += f[i];
		// params["f" + i] = f[i];
	}

	sum /= f.length;
	var threshold = 10;
	var maxSpeed = 2.0;


	var sumBeats = 0;
	for(var i=0; i<f.length/2; i++) {
		sumBeats += f[i];
	}

	// console.log(sumBeats);
	sumBeats/= ( f.length/2);

	var DECREASE_RATE = this.decrease;
	var MIN_DIFFERENCE = this.minThreshold;

	// console.log(sumBeats , this._sumBeat > MIN_DIFFERENCE && !this._hasBeats);

	if(sumBeats - this._sumBeat > MIN_DIFFERENCE && !this._hasBeats) {
		this._sumBeat = sumBeats;
		this._maxSumBeat = sumBeats;	

		this._hasBeats = true;

		// console.log('on Beat : ', this._sumBeat);
		this.dispatchCustomEvent("onBeat", {value:this._sumBeat});


		var that = this;
		setTimeout(function() {
			that._hasBeats = false;
		}, this.minGap)
	}

	this._sumBeat -= this._sumBeat * this.decreaseMultiply;

	if(sum > threshold) {
		this.sum += sum * 1.5;
		this.easeSum.value = Math.min(this.sum, maxSpeed) * .1;
	} else {
		this.easeSum.value = 0;
	}

	this.sum -= this.sum * .1;
	if(this.sum < 0) this.sum = 0;
};


module.exports = BeatDetector;