// dots.frag

// additiveColor.frag

precision highp float;

uniform vec3 color;
uniform float opacity;

const vec2 center = vec2(.5);

void main(void) {
	if(distance(gl_PointCoord, center) > .5) discard;
	gl_FragColor = vec4(color * opacity, 1.0);
}