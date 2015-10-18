// sphereDot.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aExtra;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float size;

varying vec2 vTextureCoord;
varying vec3 vVertex;

void main(void) {
	vec3 pos      = aVertexPosition;
	pos           = normalize(pos) * (size + aExtra.x);
	gl_Position   = uPMatrix * uMVMatrix * vec4(pos, 1.0);
	vTextureCoord = aTextureCoord;
	vVertex       = pos;

	gl_PointSize  = 1.0 + aTextureCoord.x * 3.0;
}