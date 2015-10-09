// line.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 leapMatrix;
uniform float leapDirection;
uniform sampler2D texture;
uniform sampler2D textureNext;
uniform sampler2D textureGold;
uniform vec2 dimension;
uniform float progress;
uniform float time;
uniform float percent;
varying vec2 vTextureCoord;
varying vec4 vColor;

const float PI = 3.141592657;

float getDepth(float z, float n, float f) {
	return (2.0 * n) / (f + n - z*(f-n));
}

float exponentialIn(float t) {
  return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}

void main(void) {
	vec3 pos        = aVertexPosition;
	vec2 uv         = aTextureCoord * .5;
	vec2 uvVel      = uv + vec2(.5, .0);
	vec2 uvFlashing = uv + vec2(.5, .5);
	vec3 vel        = texture2D(texture, uvVel).rgb;
	
	vec2 uvDebug    = uv + vec2(.0, .5);
	vec3 debug      = texture2D(texture, uvDebug).rgb;
	
	vec3 posCurr    = texture2D(texture, uv).rgb;
	vec3 posNext    = texture2D(textureNext, uv).rgb;
	
	pos             = mix(posCurr, posNext, percent);
	vec4 V          = uPMatrix * uMVMatrix * leapMatrix * vec4(pos, 1.0);
	gl_Position     = V;
	
	vTextureCoord   = aTextureCoord;
	
	// float D      = 1.0 - getDepth(V.z/V.w, 5.0, 1000.0);
	float p         = length(vel) / 3.0;
	
	float flashCurr = texture2D(texture, uvFlashing).r;
	float flashNext = texture2D(textureNext, uvFlashing).r;
	if(flashNext < flashCurr) {
		flashNext       += PI * 2.0;
	}
	float flashing  = mix(flashCurr, flashNext, percent);
	flashing     	= mix((sin(flashing) + 1.0) * .5, 1.0, .85);
	// flashing        = (sin(flashing) + 1.0) * .5;
	
	gl_PointSize    = .5 + p * 1.0 + debug.r * 1.0;

	vec2 uvColor 	= aTextureCoord + vec2(time, .0);
	if(uvColor.x > 1.0) uvColor.x -= 1.0;
	vec3 colorGold 	= texture2D(textureGold, uvColor).rgb;

	vColor          = vec4(colorGold, mix(p, 1.0, .5));
}