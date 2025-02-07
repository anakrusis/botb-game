var cam_x = 0;
var cam_y = 0;
var cam_dir = 0;
var cam_zoom = 1;
var cameraSpeed = 1;
originx = 320
originy = 320

var cam_destX = 0;
var cam_destY = 0;
var cam_destDir = 0;
var cam_destTime = 0;

var tra_x = function(x){ // translate x based on camera values
	return ((x-cam_x)*cam_zoom)+originx
}

var tra_y = function(y){ // translate y based on camera values
	return ((y-cam_y)*cam_zoom)+originy
}

var tra_x_o = function(x, orx){ // translate x based on camera values and a specified origin X point
	return ((x-cam_x)*cam_zoom)+orx
}

var tra_y_o = function(y, ory){ // translate y based on camera values and a specified origin Y point
	return ((y-cam_y)*cam_zoom)+ory
}

var rot_x = function(angle,x,y){
	return x * Math.cos(angle) - y * Math.sin(angle) // appends an X val
}

var rot_y = function(angle,x,y){
	return x * Math.sin(angle) + y * Math.cos(angle) // and a Y val
}

var setCamPos = function ( x, y, dir ){
	cam_x = x; cam_y = y; cam_dir = dir;
}

var setCamDest = function( x, y, dir, time ){
	cam_destX = x;
	cam_destY = y;
	cam_destDir = dir;
	cam_destTime = time;
}