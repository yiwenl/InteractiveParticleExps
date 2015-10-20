precision mediump float;

varying vec3 vColor;
uniform float opacity;
varying float vOpacity;

void main(void) {
    gl_FragColor = vec4(vColor*opacity * vOpacity, opacity);
}