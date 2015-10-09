// LeapControl.js

var glm = bongiovi.glm;
var Z_AXIS = glm.vec3.fromValues(0, 0, 1);

function LeapControl() {
	this._isTouched = false;
	this._rotation      = glm.quat.clone([0, 0, 1, 0]);
	this.tempRotation   = glm.quat.clone([0, 0, 1, 0]);
	this._diffX 		= new bongiovi.EaseNumber(0);
	this._diffY 		= new bongiovi.EaseNumber(0);
	this._handPos		= glm.vec3.create();
	this._preHandPos	= glm.vec3.create();
	this.matrix         = glm.mat4.create();
	glm.mat4.identity(this.matrix);
	this._offset        = .004;
	bongiovi.Scheduler.addEF(this, this.loop);
}


var p = LeapControl.prototype;


p.updatePointers = function(pointers, frame) {
	var isTouched = false;
	var touchedPosition;
	var touchedPointer;
	for(var i=0; i<pointers.length; i++) {
		var p = pointers[i];
		if(p.lengthNew && p.lengthNew < params.sphereSize) {
			touchedPosition = p.pos;
			touchedPointer = p;
			isTouched = true;
			break;
		}
	}


	// var palmPos = 'stabilizedPalmPosition';
	var palmPos = 'palmPosition';

	if(!this._isTouched && isTouched) {
		var hand = frame.hands[0];
		this._onDown(hand[palmPos]);
	}

	if(this._isTouched && !isTouched) {
		this._onUp();
	}

	if(this._isTouched && isTouched) {
		var hand = frame.hands[0];
		this._onMove(hand[palmPos], hand.palmVelocity);
	}


	this._isTouched = isTouched;
};


p._onDown = function(pos) {
	console.log('on Down : ', pos);

	var tempRotation = glm.quat.clone(this._rotation);
	this._updateRotation(tempRotation);
	this._rotation = tempRotation;

	glm.vec3.copy(this._preHandPos, pos);
	this._diffX.setTo(0);
	this._diffY.setTo(0);
};


p._onMove = function(pos, vel) {
	glm.vec3.copy(this._handPos, pos);
};


p._getRotationAxis = function(vel) {
	var dir = glm.vec3.clone(vel);
	glm.vec3.normalize(dir, dir);
	var cross = glm.vec3.create();
	glm.vec3.cross(cross, dir, Z_AXIS);
	glm.vec3.normalize(cross, cross);

	return cross;
};


p._updateRotation = function(aTempRotation) {
	if(this._isTouched) {
		this._diffX.value = (this._handPos[0] - this._preHandPos[0]);
		this._diffY.value = -(this._handPos[2] - this._preHandPos[2]);
	}

	var v = glm.vec3.fromValues(this._diffX.value, this._diffY.value, 0);
	// console.log(v, this._diffX.value, this._diffY.value);
	var axis = this._getRotationAxis(v);
	var angle = glm.vec3.length(v) * this._offset;
	var _quat = glm.quat.clone( [Math.sin(angle) * axis[0], Math.sin(angle) * axis[1], Math.sin(angle) * axis[2], Math.cos(angle) ] );
	glm.quat.multiply(aTempRotation, _quat, aTempRotation);
};

p._onUp = function() {
	
};

p.loop = function() {
	glm.quat.set(this.tempRotation, this._rotation[0], this._rotation[1], this._rotation[2], this._rotation[3]);
	this._updateRotation(this.tempRotation);
	glm.mat4.fromQuat(this.matrix, this.tempRotation);
	// console.log(this.matrix, this.tempRotation);
};


module.exports = LeapControl;