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

const float width = 64.0 * 1.0;
const float height = width;
const float numParticles = width;
const float maxRadius = 500.0;

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
			// if(distance(pos, center) > maxRadius) pos = vec3(center);
			gl_FragColor = vec4(pos, 1.0);
		} else {
			vec2 uvPos = vTextureCoord - vec2(.5, .0);
			vec3 pos = texture2D(texture, uvPos).rgb;
			vec3 vel = texture2D(texture, vTextureCoord).rgb;
			vec2 uvPosParticle, uvVelParticle;
			vec3 dir, posParticle, velParticle;
			float dist, f;

			const float minRadius = 30.0;
			const float speedIncrease = .5;
			const float maxSpeed = 3.0;

			

			for (float y=0.0;y<height;y++) {
				for (float x=0.0;x<width;x++) {
					if( (x+numParticles) == gl_FragCoord.x && y == gl_FragCoord.y) continue;
					// if(pIndex == currentIndex) continue;
					uvPosParticle = vec2(x/resolution.x, y/resolution.y);
					posParticle = texture2D(texture, uvPosParticle).rgb;
					dist = distance(pos, posParticle);

					vec2 uvWave = posParticle.xy / dimension;
					uvWave.y = 1.0 - uvWave.y;
					float waveHeight = texture2D(textureWave, uvWave).r;
					waveHeight = mix(waveHeight, 1.0, .5);
					float r = 5.0 + waveHeight * minRadius;

					if(dist < r) {
						dir = normalize(pos-posParticle);
						f = 1.0/ (dist/r) * .1;
						vel += dir * f;
					}   
				}
			}

			float distanceToCenter = distance(pos, center);
			if( distanceToCenter > maxRadius) {
				vec3 dir = normalize(pos - center);
				float f = (distanceToCenter-maxRadius) * .1;
				vel -= dir * f;
			}
			
			vel *= .92;

			vec2 mouse = vec2(cx, cy);
				float distToMouse = distance(pos.xy, mouse);
				if(distToMouse < radius) {
					vec2 dir = normalize(pos.xy - mouse);
					// float f = (1.0 - distToMouse/radius) * .5;
					float f = 1.0 / (distToMouse/radius) * .2;
					vel.xy += dir * f;
				}

			// maxSpeed = min(3.0, maxSpeed);
			if(length(vel) > maxSpeed) {
				vel = normalize(vel) * maxSpeed;
			}

			gl_FragColor = vec4(vel, 1.0); 
			 
		}
	} else {
		gl_FragColor = texture2D(texture, vTextureCoord);
	}
}