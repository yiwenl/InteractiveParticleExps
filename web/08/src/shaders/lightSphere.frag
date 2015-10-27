// lightSphere.frag


precision highp float;

varying vec3 vVertex;
uniform vec3 lightPos;
uniform float opacity;

void main(void) {

	vec3 N = normalize(vVertex);
	vec3 L = normalize(lightPos - vVertex);
	float lambert = max(dot(N, L), 0.0);

	float grey = lambert * opacity;


	gl_FragColor = vec4(grey);
}