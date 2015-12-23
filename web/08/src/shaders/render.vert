// line.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D texture;
uniform sampler2D textureNext;
uniform float percent;
uniform float time;


varying vec2 vTextureCoord;
varying vec3 vColor;
varying float vOpacity;

float getDepth(float z, float n, float f) {
	return (2.0 * n) / (f + n - z*(f-n));
}



vec3 getPosOffset( vec3 pos , vec3 extra) {
	float radius = 50.0 + sin(pos.y * 0.2 + time*2.0) + 50.0 + extra.x * 20.0;
	float a = pos.y * .03 + time * .1 + extra.y * 10.3;
	vec3 p = vec3(.0);
	p.x = cos(a) * radius;
	p.z = sin(a) * radius;
	return p;
}

void main(void) {
	vec3 pos = aVertexPosition;
	vec2 uv = aTextureCoord * .5;
	vec2 uvExtra = uv + vec2(.5);

	vec3 posCurr = texture2D(texture, uv).rgb;
	vec3 posNext = texture2D(textureNext, uv).rgb;
	vec3 extra = texture2D(texture, uvExtra).rgb;
	vOpacity = 1.0;

	if(posNext.y < posCurr.y ) vOpacity = 0.0;

	pos = mix(posCurr, posNext, percent);
	vec3 posOffset = getPosOffset(pos, extra);
	pos += posOffset;

	vec4 V = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    gl_Position = V;

    vTextureCoord = aTextureCoord;

    // float D = 1.0 - getDepth(V.z/V.w, 5.0, 1000.0);

    gl_PointSize = 1.0;
    vColor = vec3(1.0);
}