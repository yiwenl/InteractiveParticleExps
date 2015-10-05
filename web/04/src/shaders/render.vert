// line.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D texture;
uniform sampler2D textureNext;
uniform float progress;
uniform float percent;
varying vec2 vTextureCoord;
varying vec4 vColor;

float getDepth(float z, float n, float f) {
	return (2.0 * n) / (f + n - z*(f-n));
}

float exponentialIn(float t) {
  return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}

void main(void) {
	vec3 pos = aVertexPosition;
	vec2 uv = aTextureCoord * .5;
	vec2 uvVel = uv + vec2(.5, .0);
	vec3 vel = texture2D(texture, uvVel).rgb;

	vec3 posCurr = texture2D(texture, uv).rgb;
	vec3 posNext = texture2D(textureNext, uv).rgb;

	pos = mix(posCurr, posNext, percent);
	vec4 V = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    gl_Position = V;

    vTextureCoord = aTextureCoord;

    float v = length(vel)/2.0;
    gl_PointSize = 2.0 + v * 4.0;

    v = mix(v, 1.0, .5);
    vColor = vec4(vec3(1.0), v);
}