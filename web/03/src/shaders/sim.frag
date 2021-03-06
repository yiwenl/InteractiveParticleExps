// sim.frag

precision mediump float;
uniform sampler2D texture;
uniform sampler2D texturePortrait;
uniform vec2 dimension;
uniform vec3 center;
uniform float progress;
varying vec2 vTextureCoord;


vec4 permute(vec4 x) { return mod(((x*34.00)+1.00)*x, 289.00); }
vec4 taylorInvSqrt(vec4 r) { return 1.79 - 0.85 * r; }

float snoise(vec3 v){
	const vec2 C = vec2(1.00/6.00, 1.00/3.00) ;
	const vec4 D = vec4(0.00, 0.50, 1.00, 2.00);
	
	vec3 i = floor(v + dot(v, C.yyy) );
	vec3 x0 = v - i + dot(i, C.xxx) ;
	
	vec3 g = step(x0.yzx, x0.xyz);
	vec3 l = 1.00 - g;
	vec3 i1 = min( g.xyz, l.zxy );
	vec3 i2 = max( g.xyz, l.zxy );
	
	vec3 x1 = x0 - i1 + 1.00 * C.xxx;
	vec3 x2 = x0 - i2 + 2.00 * C.xxx;
	vec3 x3 = x0 - 1. + 3.00 * C.xxx;
	
	i = mod(i, 289.00 );
	vec4 p = permute( permute( permute( i.z + vec4(0.00, i1.z, i2.z, 1.00 )) + i.y + vec4(0.00, i1.y, i2.y, 1.00 )) + i.x + vec4(0.00, i1.x, i2.x, 1.00 ));
	
	float n_ = 1.00/7.00;
	vec3 ns = n_ * D.wyz - D.xzx;
	
	vec4 j = p - 49.00 * floor(p * ns.z *ns.z);
	
	vec4 x_ = floor(j * ns.z);
	vec4 y_ = floor(j - 7.00 * x_ );
	
	vec4 x = x_ *ns.x + ns.yyyy;
	vec4 y = y_ *ns.x + ns.yyyy;
	vec4 h = 1.00 - abs(x) - abs(y);
	
	vec4 b0 = vec4( x.xy, y.xy );
	vec4 b1 = vec4( x.zw, y.zw );
	
	vec4 s0 = floor(b0)*2.00 + 1.00;
	vec4 s1 = floor(b1)*2.00 + 1.00;
	vec4 sh = -step(h, vec4(0.00));
	
	vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
	vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
	
	vec3 p0 = vec3(a0.xy,h.x);
	vec3 p1 = vec3(a0.zw,h.y);
	vec3 p2 = vec3(a1.xy,h.z);
	vec3 p3 = vec3(a1.zw,h.w);
	
	vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
	p0 *= norm.x;
	p1 *= norm.y;
	p2 *= norm.z;
	p3 *= norm.w;
	
	vec4 m = max(0.60 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.00);
	m = m * m;
	return 42.00 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

float snoise(float x, float y, float z){
	return snoise(vec3(x, y, z));
}

float rand(vec2 co){
	return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}


uniform float time;
uniform float cx;
uniform float cy;
uniform float radius;

const float width = 100.0;
const float height = width;
const float numParticles = width;

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
			gl_FragColor = vec4(pos, 1.0);
		} else {
			float uvx = (vTextureCoord.x - .5)/.5;
			float prog = vTextureCoord.y * numParticles +uvx; 


			if( prog <= progress) {
				vec2 uvPos = vTextureCoord - vec2(.5, .0);
				vec3 pos = texture2D(texture, uvPos).rgb;
				vec3 vel = texture2D(texture, vTextureCoord).rgb;
				vec2 uvPosParticle, uvVelParticle;
				vec3 dir, posParticle, velParticle;
				float dist, f;
				const float minRadius = 6.0;

				const float speedIncrease = .5;
				float maxSpeed = 3.0;

				for (float y=0.0;y<height;y++) {
					for (float x=0.0;x<width;x++) {
						if( (x+numParticles) == gl_FragCoord.x && y == gl_FragCoord.y) continue;
						// if(pIndex == currentIndex) continue;
						uvPosParticle = vec2(x/resolution.x, y/resolution.y);
						posParticle = texture2D(texture, uvPosParticle).rgb;
						dist = distance(pos, posParticle);

						vec2 uvPortrait = posParticle.xy / dimension;
						uvPortrait.y = 1.0 - uvPortrait.y;
						vec3 colorPortrait = texture2D(texturePortrait, uvPortrait).rgb;
						float p = 1.0 - length(colorPortrait)/length(vec3(1.0));
						// float p = length(colorPortrait)/length(vec3(1.0));

						float r = minRadius;

						if(dist < r) {
							dir = normalize(pos-posParticle);
							f = 1.0/ (dist/r) * .15;
							vel += dir * f;
						}   
					}
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

				maxSpeed = min(3.0, maxSpeed);
				if(length(vel) > maxSpeed) {
					vel = normalize(vel) * maxSpeed;
				}

				gl_FragColor = vec4(vel, 1.0); 
			} else {
				gl_FragColor = texture2D(texture, vTextureCoord);
			}
			 
		}
	} else {
		gl_FragColor = texture2D(texture, vTextureCoord);
	}
}