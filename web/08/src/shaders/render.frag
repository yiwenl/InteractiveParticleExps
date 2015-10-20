precision mediump float;

varying vec3 vColor;
uniform float opacity;

void main(void) {
    gl_FragColor = vec4(vColor, opacity);
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}