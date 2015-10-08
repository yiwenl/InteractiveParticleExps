// globe.frag
precision highp float;

varying vec3 vNormal;
varying vec3 vVertex;

const int NUM_POINTERS = 10;

uniform vec3 ambient;
uniform vec3 light0;
uniform vec3 light1;
uniform vec3 pointers[NUM_POINTERS];
uniform float lightAmount;
uniform float opacity;

// const vec3 ambient = vec3(.0);
const vec3 lightColor = vec3(1.0, 1.0, .96);
// const float lightAmount = .03;


void main(void) {

	vec3 n0 = normalize(light0 - vVertex);
	float lambert0 = max(dot(n0, vNormal), .0);

	vec3 n1 = normalize(light1 - vVertex);
	float lambert1 = max(dot(n1, vNormal), .0);

	vec3 n2 = normalize(vec3(0.0, 0.0, 1000.0) - vVertex);
	float lambert2 = max(dot(n2, vNormal), .0);

	vec3 color = ambient + lambert0 * lightColor * lightAmount + lambert1 * lightColor * lightAmount + lambert2 * lightColor * .3;

	float minRadius = 50.0;
	for(int i=0; i<NUM_POINTERS; i++) {
		vec3 p = pointers[i];
		float d = distance(p, vVertex);
		if( d < minRadius ) {
		// 	grey += (1.0 - d/minRadius) * .1;
			vec3 n = normalize(vec3(p) - vVertex);
			float lambert = max(dot(n, vNormal), 0.0);

			color += lightColor * lambert * (1.0 - d/minRadius) * .3;
		}
	}

	gl_FragColor = vec4(color, opacity);
}