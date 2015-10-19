// interactiveSphere.vert

precision highp float;
attribute vec3 aVertexPosition;

attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aExtra;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float size;
uniform float pointSize;
uniform vec3 avoidCenter;

varying vec2 vTextureCoord;
varying vec3 vVertex;
varying vec3 vNormal;
varying vec3 lightDir;

float exponentialIn(float t) {
  return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}

void main(void) {
	vec3 pos              = aVertexPosition;
	vec3 centerPos        = aExtra;
	float offset          = 1.0;
	const float minRadius = 350.0;
	float dist = distance(centerPos, avoidCenter);
	if(dist < minRadius) {
		offset = dist/minRadius;
	}

	pos 		  = mix(aExtra, pos, exponentialIn(offset));

	pos           = normalize(pos) * size;
	gl_Position   = uPMatrix * uMVMatrix * vec4(pos, 1.0);
	vTextureCoord = aTextureCoord;
	vVertex       = pos;

	vNormal 	  = aNormal;
	lightDir 	  = avoidCenter;

	gl_PointSize = pointSize * exponentialIn(offset);
}