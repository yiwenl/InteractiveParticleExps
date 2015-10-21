// line.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aTheta;
attribute vec3 aRotAxis;
attribute vec3 aCenter;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 invert;
uniform sampler2D texture;
uniform float size;
uniform float stepper;
varying vec2 vTextureCoord;
varying vec3 vColor;
varying float vOpacity;

#ifndef HALF_PI
#define HALF_PI 1.5707963267948966
#endif

float elasticOut(float t) {
  return sin(-13.0 * (t + 1.0) * HALF_PI) * pow(2.0, -10.0 * t) + 1.0;
}


float elasticInOut(float t) {
  return t < 0.5
    ? 0.5 * sin(+13.0 * HALF_PI * 2.0 * t) * pow(2.0, 10.0 * (2.0 * t - 1.0))
    : 0.5 * sin(-13.0 * HALF_PI * ((2.0 * t - 1.0) + 1.0)) * pow(2.0, -10.0 * (2.0 * t - 1.0)) + 1.0;
}

vec4 quat_from_axis_angle(vec3 axis, float angle) { 
	vec4 qr;
	float half_angle = (angle * 0.5);
	qr.x = axis.x * sin(half_angle);
	qr.y = axis.y * sin(half_angle);
	qr.z = axis.z * sin(half_angle);
	qr.w = cos(half_angle);
	return qr;
}

vec3 rotate_vertex_position(vec3 pos, vec3 axis, float angle) { 
	vec4 q = quat_from_axis_angle(axis, angle);
	vec3 v = pos.xyz;
	return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

void main(void) {
	vec3 axis             = aRotAxis;
	float thetaOffset     = clamp(-aTheta.y-.2 + stepper, 0.0, 1.0);
	float theta           = aTheta.x * elasticOut(thetaOffset);
	vec3 pos              = aVertexPosition;
	vec3 relativePos      = pos - aCenter;
	vec3 newPos           = rotate_vertex_position(relativePos, axis, theta);
	// newPos                = -(invert * vec4(newPos, 1.0)).rgb;
	pos                   = newPos + aCenter;
	vec2 uv               = aTextureCoord * .5;
	pos                   += texture2D(texture, uv).rgb * 1.0;
	
	const float maxRadius = 1500.0;
	const float fadeRange = 50.0;
	float dist            = min(length(pos), maxRadius);
	float opacityOffset   = 1.0;
	if(dist > maxRadius - fadeRange) {
		opacityOffset = (maxRadius - dist) / fadeRange;
	}

	const float minRadius = 400.0;
	if(aTheta.z > 0.0) {
		if(dist < minRadius-fadeRange) {
			opacityOffset = 0.0;
		} else if(dist < minRadius) {
			opacityOffset = 1.0 - (minRadius - dist)/fadeRange;
		}
	}

	vOpacity		 = opacityOffset;

	gl_Position      = uPMatrix * uMVMatrix * vec4(pos, 1.0);
	vTextureCoord    = aTextureCoord;
	
	gl_PointSize     = 5.0;
	vColor           = vec3(1.0);
}