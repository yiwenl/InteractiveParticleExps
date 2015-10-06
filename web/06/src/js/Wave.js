// Wave.js

var random = function(min, max) { return min + Math.random() * (max - min);	}

function Wave(pos, waveHeight, p) {
	this.pos = pos;
	this.waveFront = 0.0;
	this.waveHeight = new bongiovi.EaseNumber(waveHeight, random(.01, .005));
	this.waveHeight.value = .0;
	this.waveLength = random(.02, .04) + p * .01;
	this.speed = random(.01, .02) * p * .25;
	var that = this;
	this.inter = setInterval(function() {
		that.waveFront += that.speed;
	}, 1000/60);
}


var p = Wave.prototype;


module.exports = Wave;