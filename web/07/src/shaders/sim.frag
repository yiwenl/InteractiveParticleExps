// sim.frag

precision mediump float;
uniform sampler2D texture;
uniform sampler2D textureWave;
uniform vec2 dimension;
uniform vec3 center;
uniform float progress;
varying vec2 vTextureCoord;

uniform float time;
uniform float cx;
uniform float cy;
uniform float radius;
uniform float aspectRatio;
uniform float sphereSize;

const float width = 100.0;
const float height = width;
const float numParticles = width;
const float maxRadius = 500.0;

const float PI = 3.141592657;
const int NUM_WAVES = 30;
uniform vec3 waveCenters[NUM_WAVES];
uniform vec3 waveHeights[NUM_WAVES];

float getWave(vec3 pos, vec3 wc, float wf, float wh, float wl) {
	float distToCenter = distance(pos, wc);
	float w = 0.0;
	float distToWaveFront = distance(distToCenter, wf);

	if(distToWaveFront < wl) {
		w = (1.0 - sin(distToWaveFront/wl * PI * .5)) * wh;
	}

	return smoothstep(0.0, 1.0, w);
}

void main(void) {
	vec2 resolution = vec2(numParticles*2.0, numParticles*2.0);
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float maxLength = length(vec3(1.0));

	if(vTextureCoord.y < .5) {
		if(vTextureCoord.x < .5) {
			vec2 uvVel = vTextureCoord + vec2(.5, .0);
			vec3 pos = texture2D(texture, vTextureCoord).rgb;
			vec3 vel = texture2D(texture, uvVel).rgb;
			pos += vel;

			pos = normalize(pos) * sphereSize;
			// if(distance(pos, center) > maxRadius) pos = vec3(center);
			gl_FragColor = vec4(pos, 1.0);
		} else {
			vec2 uvPos = vTextureCoord - vec2(.5, .0);
			vec2 uvWave = vTextureCoord + vec2(-.5, .5);
			vec3 pos = texture2D(texture, uvPos).rgb;
			vec3 vel = texture2D(texture, vTextureCoord).rgb;
			vec3 wave = texture2D(texture, uvWave).rgb;
			vec2 uvPosParticle, uvVelParticle;
			vec3 dir, posParticle, velParticle;
			float dist, f;

			const float minRadius = 30.0;
			const float speedIncrease = .5;
			const float maxSpeed = 3.0;

			// float grey = 0.0;
			// for(int i=0; i<NUM_WAVES; i++ ) {
			// 	vec3 wCenter = normalize(waveCenters[i]) * sphereSize;
			// 	vec3 wHeights = waveHeights[i];
			// 	grey += getWave(pos, wCenter, wHeights.x, wHeights.y, wHeights.z);
			// }
			

			for (float y=0.0;y<height;y++) {
				for (float x=0.0;x<width;x++) {
					if( (x+numParticles) == gl_FragCoord.x && y == gl_FragCoord.y) continue;
					// if(pIndex == currentIndex) continue;
					uvPosParticle = vec2(x/resolution.x, y/resolution.y);
					posParticle = texture2D(texture, uvPosParticle).rgb;
					dist = distance(pos, posParticle);

					float r = 3.0 + wave.r * 6.0;

					if(dist < r) {
						dir = normalize(pos-posParticle);
						f = 1.0/ (dist/r) * .075;
						vel += dir * f;
					}   
				}
			}

			
			vel *= .92;

			// maxSpeed = min(3.0, maxSpeed);
			if(length(vel) > maxSpeed) {
				vel = normalize(vel) * maxSpeed;
			}

			gl_FragColor = vec4(vel, 1.0); 
			 
		}
	} else {
		if(vTextureCoord.x < .5) {

			vec2 uvPos = vTextureCoord - vec2(0.0, 0.5);
			vec3 pos = texture2D(texture, uvPos).rgb;
			float grey = 0.0;
			for(int i=0; i<NUM_WAVES; i++ ) {
				vec3 wCenter = normalize(waveCenters[i]) * sphereSize;
				vec3 wHeights = waveHeights[i];
				grey += getWave(pos, wCenter, wHeights.x, wHeights.y, wHeights.z);
			}

			gl_FragColor = vec4(vec3(grey), 1.0);
		} else {
			gl_FragColor = texture2D(texture, vTextureCoord);
		}
		
	}
}