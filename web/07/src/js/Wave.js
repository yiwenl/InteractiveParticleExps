// Wave.js

var random = function(min, max) { return min + Math.random() * (max - min);	}

function Wave(pos, waveHeight, p) {
	this.pos = pos;
	this.waveFront = 0.0;
	this.waveHeight = new bongiovi.EaseNumber(waveHeight, random(.01, .02));
	this.waveHeight.value = 0.00;
	this.waveLength = (random(100, 150) + p * 50) * .25;
	this.speed = random(1, 3);
	var that = this;
	this.inter = setInterval(function() {
		that.waveFront += that.speed;
	}, 1000/60);
}


var p = Wave.prototype;


module.exports = Wave;