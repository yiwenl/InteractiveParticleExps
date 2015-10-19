precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D texture;
uniform sampler2D textureGradient;
uniform sampler2D textureGradientMap;

vec3 blendOverlay(vec3 base, vec3 blend) {
    return mix(1.0 - 2.0 * (1.0 - base) * (1.0 - blend), 2.0 * base * blend, step(base, vec3(0.5)));
    // with conditionals, may be worth benchmarking
    // return vec3(
    //     base.r < 0.5 ? (2.0 * base.r * blend.r) : (1.0 - 2.0 * (1.0 - base.r) * (1.0 - blend.r)),
    //     base.g < 0.5 ? (2.0 * base.g * blend.g) : (1.0 - 2.0 * (1.0 - base.g) * (1.0 - blend.g)),
    //     base.b < 0.5 ? (2.0 * base.b * blend.b) : (1.0 - 2.0 * (1.0 - base.b) * (1.0 - blend.b))
    // );
}

void main(void) {
	vec4 color = texture2D(texture, vTextureCoord);
	float maxLength = length(vec3(1.0));
	float brightness = length(color.rgb) / maxLength;
	vec2 uv = vec2(brightness, .5);
	vec3 mapColor = texture2D(textureGradientMap, uv).rgb;
	vec3 grdColor = texture2D(textureGradient, vTextureCoord).rgb;
	mapColor = blendOverlay(mapColor, grdColor);

    gl_FragColor = vec4(mapColor, color.a);
    // gl_FragColor = texture2D(texture, vTextureCoord);
}