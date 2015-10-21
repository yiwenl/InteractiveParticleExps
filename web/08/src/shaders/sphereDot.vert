// sphereDot.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aExtra;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float size;
uniform float globalOpacity;

varying vec2 vTextureCoord;
varying vec3 vVertex;
varying float vAlpha;

float exponentialIn(float t) {
  return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}

void main(void) {
	vec3 pos      = aVertexPosition;
	pos           = normalize(pos) * (size + aExtra.x);
	gl_Position   = uPMatrix * uMVMatrix * vec4(pos, 1.0);
	vTextureCoord = aTextureCoord;
	vVertex       = pos;

	const float fadeRange = 50.0;
	float radius  = size + 200.0 * exponentialIn(1.0 - globalOpacity);
	float l 	  = length(pos);
	float alpha   = 1.0;
	if(l < radius - fadeRange) {
		alpha = 0.0;
	} else if(l < radius) {
		alpha = 1.0 - (radius - l) / fadeRange;
	} 


	vAlpha = alpha;


	gl_PointSize  = 2.0 + aTextureCoord.x * 4.0;
}