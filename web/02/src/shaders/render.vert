// line.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D texture;
uniform sampler2D textureNext;
uniform float percent;
uniform vec3 color0;
uniform vec3 color1;


varying vec2 vTextureCoord;
varying vec4 vColor;

void main(void) {
	vec3 pos = aVertexPosition;
	vec2 uv = aTextureCoord * .5;
	vec2 uvVel = uv + vec2(.5, .0);
	vec2 uvOffset = uv + vec2(0.0, .5);
	vec3 velNow = texture2D(texture, uvVel).rgb;
	vec3 velNext = texture2D(textureNext, uvVel).rgb;
	vec3 vel = mix(velNow, velNext, percent);
	vec3 offsets = texture2D(texture, uvOffset).rgb;

	vec3 posNow = texture2D(texture, uv).rgb;
	vec3 posNext = texture2D(textureNext, uv).rgb;
	pos = mix(posNow, posNext, percent);

    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;

    gl_PointSize = 1.0;
    float offset = length(vel) / 25.0;


    // vec3 color = mix(pos/150.0, vec3(1.0), offset*mix(offsets.r, 1.0, .25));

    vColor = vec4(vec3(mix(offsets.r, 1.0, .5)), offset);



    gl_PointSize = mix(1.0, 4.0, offset) + offsets.b*2.0;
}