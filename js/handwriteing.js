var canvasWidth = 800;
var canvasHeight = canvasWidth;
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var lastloc = {x:0,y:0};
var lastTimeStamp = 0;
var lastLineWidth = -1;
var strokeColor = "black";
canvas.width = canvasWidth;
canvas.height = canvasHeight;
//初始化鼠标动作
var isMouseDown = false;

drawGrid();

$("#clear_btn").click(
	function(e){
		context.clearRect(0,0,canvasWidth,canvasHeight);
		drawGrid();
	}
);
$(".color_btn").click(
	function(e){
		$(".color_btn").removeClass("color_btn_selected");
		$(this).addClass("color_btn_selected");
		strokeColor = $(this).css("background-color");
	}
);


document.onmousedown = function(e){
	//alert("X:"+e.clientX+";Y:"+e.clientY);
}
//鼠标动作
canvas.onmousedown = function(e){
	//阻止浏览器的默认动作 PC端无明显影响，主要是移动端
	e.preventDefault();
	isMouseDown = true;
	//console.log("mouse down!");
	//alert("X:"+loc.x+";Y:"+loc.y);
	lastloc = windowToCanvas(e.clientX,e.clientY);
	lastTimeStamp = new Date().getTime();//返回当前时间戳
}
canvas.onmouseup = function(e){
	e.preventDefault();
	isMouseDown = false;
	//console.log("mouse up!");
}
canvas.onmouseout = function(e){
	e.preventDefault();
	isMouseDown = false;
	//console.log("mouse out!");
}
canvas.onmousemove = function(e){
	e.preventDefault();
	//console.log("mouse move!");
	if(isMouseDown){
		var curloc = windowToCanvas(e.clientX,e.clientY);
		var s = calculateDistance(curloc,lastloc);
		var curTimestamp = new Date().getTime();
		var t = curTimestamp - lastTimeStamp;
		
		var lineWidth = calculateLineWidth(s,t);

		//draw
		context.beginPath();
		context.moveTo(lastloc.x,lastloc.y);
		context.lineTo(curloc.x,curloc.y);
		context.strokeStyle=strokeColor;
		context.lineWidth = lineWidth;
		context.lineCap = "round";
		context.lineJoin = "round";
		context.stroke();
		lastloc = curloc;
		lastTimeStamp = curTimestamp;
		lastLineWidth = lineWidth;
	}
}
var maxLineWidth = 30;
var minLineWidth = 1;
var maxStrokeV = 10;
var minStrokeV = 0.1;
$("#lineWidth").change(function(){
	var lineWidth = $(this).val();
	maxLineWidth = lineWidth;
});

function calculateLineWidth(s , t ){
	var v = s/t;

	var resultLineWidth;
	if(v <= minStrokeV){
		resultLineWidth = maxLineWidth;
	}else if(v >= 10){
		resultLineWidth = minLineWidth
	}else{
		resultLineWidth = maxLineWidth - (v-minStrokeV)/(maxStrokeV-minStrokeV)*(maxLineWidth-minLineWidth);
	}
	if( lastLineWidth == -1){
		return resultLineWidth;
	}
	return lastLineWidth* 2/3 + resultLineWidth * 1/3;
	
}

function calculateDistance(loc1,loc2){
	return Math.sqrt((loc1.x-loc2.x)*(loc1.x-loc2.x) + (loc1.y-loc2.y)*(loc1.y-loc2.y));
}

function windowToCanvas(x,y){
	var bbox = canvas.getBoundingClientRect();
	//x - bbox.getleft 返回浮点数
	return {x:Math.round(x - bbox.left), y:Math.round(y - bbox.top)};
}

function drawGrid(){
	context.save();
	context.strokeStyle = "blue";

	context.beginPath();
	context.moveTo(3,3);
	context.lineTo(canvasWidth -3,3);
	context.lineTo(canvasWidth -3,canvasHeight-3);
	context.lineTo(3,canvasHeight-3);
	context.closePath();

	context.lineWidth = 6;
	context.stroke();

	context.beginPath();
	for(var i=10;i<canvasWidth;i=i+10){
		context.moveTo(i,0);
		context.lineTo(i,canvasHeight);	
	}
	for(var j=10;j<canvasHeight;j=j+10){
		context.moveTo(0,j);
		context.lineTo(canvasWidth,j);
	}
	context.strokeStyle = "#eee"
	/*context.moveTo(0,0);
	context.lineTo(canvasWidth,canvasHeight);

	context.moveTo(canvasWidth,0);
	context.lineTo(0,canvasHeight);

	context.moveTo(0,canvasHeight);
	context.lineTo(canvasWidth,0);

	context.moveTo(0,canvasHeight/2);
	context.lineTo(canvasWidth,canvasHeight/2);

	context.moveTo(canvasWidth/2,0);
	context.lineTo(canvasWidth/2,canvasHeight);*/

	context.lineWidth = 1;
	context.stroke();

	context.restore();
}
