var dom=document.getElementById('clock');
var ctx=dom.getContext('2d');
var width=ctx.canvas.width;
var height=ctx.canvas.height;
var r=width/2;
var rem=width/300;//比例

function drawBackground() {
	ctx.save();//保存当前画布的状态
	ctx.translate(r,r);//定义表盘中心点
	ctx.beginPath();//开始
	ctx.lineWidth=6*rem;//线宽
	ctx.arc(0,0,r-ctx.lineWidth/2,0,2*Math.PI,false);//画圆(x,y,r,起始角以弧度计,结束角以弧度计,是否逆时针)
	ctx.stroke();//绘制

	var hourNumbers=[3,4,5,6,7,8,9,10,11,12,1,2];//绘制圆弧是从表盘的3点处开始的
	ctx.font=18*rem+"px Arial";//字体也要按比例缩放，拼接字符串
	ctx.textAlign="center";//上下居中
	ctx.textBaseline="middle";//左右居中
	//填充小时数
	hourNumbers.forEach(function(number,i){
		var rad=2*Math.PI/12*i;
		var x=Math.cos(rad)*(r-30*rem);
		var y=Math.sin(rad)*(r-30*rem);
		ctx.fillText(number,x,y);//填充文字
	})
	//填充分钟点
	for(var i=0;i<60;i++){
		var rad=2*Math.PI/60*i;
		var x=Math.cos(rad)*(r-18*rem);
		var y=Math.sin(rad)*(r-18*rem);
		ctx.beginPath();
		if(i%5===0){
			ctx.arc(x,y,2*rem,0,2*Math.PI,false);
			ctx.fillStyle="#000";//设置颜色
		}else{
			ctx.arc(x,y,2*rem,0,2*Math.PI,false);
			ctx.fillStyle="#ccc";
		}
		ctx.fill();//填充
	}
}

function drawHour(hour,minute){
	ctx.save();
	ctx.beginPath();
	let hourRad=2*Math.PI/12*hour+2*Math.PI/12/60*minute;
	ctx.rotate(hourRad);//旋转弧度
	ctx.lineWidth=6*rem;
	ctx.lineCap='round';
	ctx.moveTo(0,10*rem);//把路径移动到画布中的指定点，不创建线条
	ctx.lineTo(0,-r/2);//添加一个新点，然后在画布中创建从该点到最后指定点的线条
	ctx.stroke();
	ctx.restore();
}

function drawMinute(minute){
	ctx.save();
	ctx.beginPath();
	let minuteRad=2*Math.PI/60*minute;
	ctx.rotate(minuteRad);
	ctx.lineWidth=3*rem;
	ctx.lineCap='round';
	ctx.moveTo(0,10*rem);
	ctx.lineTo(0,-r+50*rem);
	ctx.stroke();
	ctx.restore();
}

function drawSecond(second){
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle="#c14543";
	let secondRad=2*Math.PI/60*second;
	ctx.rotate(secondRad);
	ctx.moveTo(-2*rem,20*rem);
	ctx.lineTo(2*rem,20*rem);
	ctx.lineTo(1,-r+18*rem);
	ctx.lineTo(-1,-r+18*rem);
	ctx.fill();
	ctx.restore();
}

function drawDot(){
	ctx.beginPath();
	ctx.fillStyle="#fff";
	ctx.arc(0,0,3*rem,0,2*Math.PI,false);
	ctx.fill();
}

function draw(){
	ctx.clearRect(0,0,width,height);//清除上次的画布内容
	let date=new Date();
	let hour=date.getHours();
	let minute=date.getMinutes();
	let second=date.getSeconds();
	drawBackground();
	drawDot();
	drawHour(hour,minute);
	drawMinute(minute);
	drawSecond(second);
	ctx.restore();//重置回画布原来的状态
}

draw();
setInterval(draw,1000);

