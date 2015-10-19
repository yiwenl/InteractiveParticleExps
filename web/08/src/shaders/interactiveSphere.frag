// interactiveSphere.frag

precision highp float;

uniform vec3 color;
uniform float opacity;
varying float vScaleOffset;

void main(void) {
	gl_FragColor = vec4(color * opacity * vScaleOffset, 1.0);
}