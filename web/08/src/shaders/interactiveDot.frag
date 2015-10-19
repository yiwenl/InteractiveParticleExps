// interactiveDot.frag
// dots.frag

precision highp float;

uniform vec3 color;
uniform float opacity;
varying float vScaleOffset;
const vec2 center = vec2(.5);

void main(void) {
	if(distance(gl_PointCoord, center) > .5) discard;
	gl_FragColor = vec4(color * opacity * vScaleOffset, 1.0);
}