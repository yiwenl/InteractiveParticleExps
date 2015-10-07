precision mediump float;

varying vec4 vColor;
const vec2 center = vec2(.5);

void main(void) {

	if(distance(center, gl_PointCoord) > .45) discard;
    gl_FragColor = vColor;
    gl_FragColor.b *= .9;
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}