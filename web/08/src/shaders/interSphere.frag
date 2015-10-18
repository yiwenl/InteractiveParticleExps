precision highp float;

varying vec3 vNormal;
uniform vec3 color;
uniform float opacity;
varying vec3 lightDir;

// const vec3 lightDir = vec3(1.0);
const vec3 lightColor = vec3(1.0);

const float ambient = .15;
const float lightWeight = 1.0 - ambient;

void main(void) {
	float lambert = max(dot(vNormal, normalize(lightDir)), .0);

	vec3 colorLight = ambient + lightColor * lambert * lightWeight;

	gl_FragColor = vec4(color*colorLight*opacity, opacity);
}