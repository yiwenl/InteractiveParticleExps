// line.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D texture;
uniform float size;
varying vec2 vTextureCoord;
varying vec3 vColor;

void main(void) {
	vec3 pos = aVertexPosition;
	vec2 uv = aTextureCoord * .5;
	pos.xyz += texture2D(texture, uv).rgb * 1.0;
    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;

    gl_PointSize = 5.0;
    vColor = vec3(1.0);
}