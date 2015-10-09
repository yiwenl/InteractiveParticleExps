// ico.vert

// globe.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
uniform mat4 leapMatrix;
uniform float leapDirection;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float sphereSize;
varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vVertex;

void main(void) {
	vec3 pos = normalize(aVertexPosition) * sphereSize;
    gl_Position = uPMatrix * uMVMatrix * leapMatrix * vec4(pos*leapDirection, 1.0);
    vNormal = normalize(aVertexPosition);
    vVertex = pos;
    vTextureCoord = aTextureCoord;
}