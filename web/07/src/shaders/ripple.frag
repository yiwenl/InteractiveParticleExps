// ripple.frag

precision mediump float;
varying vec2 vTextureCoord;
const float PI = 3.141592657;
uniform float aspectRatio;

const int NUM_WAVES = 20;
uniform vec2 waveCenters[NUM_WAVES];
uniform vec3 waveHeights[NUM_WAVES];

float getWave(vec2 uv, vec2 wc, float wf, float wh, float wl) {
	float distToCenter = distance(uv, wc);
	float w = 0.0;
	float distToWaveFront = distance(distToCenter, wf);


	if(distToWaveFront < wl) {
		w = (1.0 - sin(distToWaveFront/wl * PI * .5)) * wh;
	}

	return smoothstep(0.0, 1.0, w);
}


float contrast(float value, float scale) {
	return .5 + (value - .5) * scale;
}

vec2 contrast(vec2 value, float scale) {
	return vec2(contrast(value.x, scale), contrast(value.y, scale));
}


void main(void) {	
	vec2 uv = vTextureCoord;
	// uv.y = contrast(uv.y, 1.0/aspectRatio);
	// uv.x = contrast(uv.x, aspectRatio);
	uv.x = contrast(uv.x, aspectRatio);
	float grey = 0.0;

	for(int i=0; i<NUM_WAVES; i++ ) {
		vec2 wCenter = waveCenters[i];
		vec3 wHeights = waveHeights[i];
		grey += getWave(uv, wCenter, wHeights.x, wHeights.y, wHeights.z);
	}

    gl_FragColor = vec4(grey);
}