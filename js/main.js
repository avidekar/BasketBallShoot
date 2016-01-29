var mouseclick = true;
var distance;
var message;
var initialTimerId;
var timer_id;
var counter = setInterval(timer, 1000);
var ballX, ballY;
var width;
var height;
var cRing;
var cCircle;
var cPosition = false;
var xBall;
var score = 0;
var zero = 0;
var baseScore = 500;
var extraScore = 0;
var setTime = 60;
var time = 60;
var levelId = 0;
var timeflag = false;
var movement = "right";
var ballflag = true;
var pauseflag = false;
var pauseTime;
var x1,x2,y1,y2,diffX,diffY;
var pauseMovement;
var targetScore;
targetScore = baseScore + extraScore;
var ringImage;

window.addEventListener('tizenhwkey', function(e) 
{
    if (e.keyName == "back")
     {
     	var fileName = location.pathname.split("/").slice(-1);
 	   if(fileName == "ball-bounce.html")
 	   {
 		  window.location.href = "index.html";
 	   }
   	 
    }
});



function collides (ring, circle, collide_inside)
{
    // compute a center-to-center vector
    cRing = ring;
    cCircle = circle;
	var half = { x: ring.w/2, y: ring.h/2 }; 
    var center = {
        x: circle.x - (ring.x+half.x),
        y: circle.y - (ring.y+half.y)};
        
    // check circle position inside the rectangle quadrant
    var side = 
    	{
        x: Math.abs (center.x) - half.x,
        y: Math.abs (center.y) - half.y
        };
    if (side.x >  circle.r || side.y >  circle.r) // outside
	    return false; 
    if (side.x < -circle.r && side.y < -circle.r) // inside
        return collide_inside;
	if (side.x < 0 || side.y < 0) // intersects side or corner
        return true;
		
    // circle is near the corner
    return side.x*side.x + side.y*side.y  < circle.r*circle.r;
}

function bounces (ring, circle)
{
    // compute a center-to-center vector
	var half = { x: ring.w/2, y: ring.h/2 };
    var center = {
        x: circle.x - (ring.x+half.x),
        y: circle.y - (ring.y+half.y)};
        
    // check circle position inside the rectangle quadrant
    var side = {
        x: Math.abs (center.x) - half.x,
        y: Math.abs (center.y) - half.y};
//console.log ("center "+center.x+" "+center.y+" side "+side.x+" "+side.y);           
    if (side.x >  circle.r || side.y >  circle.r) // outside
	    return { bounce: false }; 
    if (side.x < -circle.r && side.y < -circle.r) // inside
	    return { bounce: false }; 
	if (side.x < 0 || side.y < 0) // intersects side or corner
	{
		var dx = 0, dy = 0;
	    if (Math.abs (side.x) < circle.r && side.y < 0)
		{
		    dx = center.x*side.x < 0 ? -1 : 1;
		}
	    else if (Math.abs (side.y) < circle.r && side.x < 0)
		{
		    dy = center.y*side.y < 0 ? -1 : 1;
		}
		
        return { bounce: true, x:dx, y:dy };
	}
    // circle is near the corner
    bounce = side.x*side.x + side.y*side.y  < circle.r*circle.r;
	if (!bounce) return { bounce:false }
	var norm = Math.sqrt (side.x*side.x+side.y*side.y);
	var dx = center.x < 0 ? -1 : 1;
	var dy = center.y < 0 ? -1 : 1;
	return { bounce:true, x: dx*side.x/norm, y: dy*side.y/norm };
	
}

//--------------------------------------------------------
//demo code
//--------------------------------------------------------
function Demo ()
{

this.redraw = function ()
{ 
    canvas.height = canvas.height; // reset canvas
	//step2 everytime
	// draw rectangles every time!
	ctx.beginPath();
	ctx.rect (this.rect1.x, this.rect1.y, this.rect1.w, this.rect1.h); //outer rectangle
	ctx.closePath();	

	ctx.beginPath();
	ctx.drawImage (this.ring1.img, this.ring1.x, this.ring1.y, this.ring1.w, this.ring1.h); //inner rectangle
	ctx.closePath();
	ctx.fillStyle = ctx.strokeStyle = 'white';
	ctx.fill();
	ctx.stroke();


	ctx.beginPath();
	ctx.drawImage (this.ring2.img, this.ring2.x, this.ring2.y, this.ring2.w, this.ring2.h); //inner rectangle
	ctx.closePath();
	ctx.fillStyle = ctx.strokeStyle = 'white';
	ctx.fill();
	ctx.stroke();
	// detect collision
	if (collides (this.rect1, this.circle1, false) //check if ball collides outer rectangle
	   || collides (this.ring1, this.circle1, this.fill)
	   || collides (this.ring2, this.circle1, this.fill)) //check if ball collides inner rectangle
	{
		if (cRing.x == this.ring1.x && movement == "down" || cRing.x == this.ring2.x && movement == "down"	)
		{
			if (((cCircle.x-20) >= this.ring1.x &&(cCircle.x+20 <= this.ring1.x+80)) || ((cCircle.x-20) >= this.ring2.x && (cCircle.x+20 <= this.ring2.x+80)))
			{
			score += 50;
			document.getElementById("showScore").innerHTML = score;
			movement = "over";
			xBall = this.circle1.x;
			}
		}
		ctx.fillStyle = '#CC5200';
		ctx.lineWidth = 2;
	}
	else
	{
		ctx.fillStyle = '#CC5200';
		ctx.lineWidth = 2;
	}
	
	// draw circle
	ctx.beginPath();
	ctx.arc(this.circle1.x, this.circle1.y,this.circle1.r,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.lineWidth = '2';
	ctx.fillStyle = ctx.strokeStyle = '#CC5200';
	ctx.lineWidth = '2';
	ctx.strokeStyle = 'black';
	ctx.stroke();

		if(movement == "up")
		{
			ctx.beginPath();
			ctx.arc(this.circle1.x, this.circle1.y,this.circle1.r,0,2*Math.PI);
			ctx.closePath();
			ctx.fill();
			ctx.fillStyle = ctx.strokeStyle = '#CC5200';
			ctx.lineWidth = '2';
			ctx.strokeStyle = 'black';
			ctx.stroke();
		}

		if(movement == "over" || movement == "down")
		{
			ctx.beginPath();
			ctx.drawImage (this.ring1.img, this.ring1.x, this.ring1.y, this.ring1.w, this.ring1.h); //inner rectangle
			ctx.closePath();
			ctx.fillStyle = ctx.strokeStyle = 'white';
			ctx.fill();
			ctx.stroke();


			ctx.beginPath();
			ctx.drawImage (this.ring2.img, this.ring2.x, this.ring2.y, this.ring2.w, this.ring2.h); //inner rectangle
			ctx.closePath();
			ctx.fillStyle = ctx.strokeStyle = 'white';
			ctx.fill();
			ctx.stroke();
		}
	
	ctx.beginPath();
	ctx.arc(this.circle2.x, this.circle2.y,this.circle2.r,0,2*Math.PI);
	ctx.fillStyle = ctx.strokeStyle = '#000000';
	ctx.fill();
	ctx.fillStyle = '#000000';
	ctx.stroke();

	ctx.beginPath();
	ctx.rect (this.rect2.x, this.rect2.y, this.rect2.w, this.rect2.h); //inner rectangle
	ctx.closePath();
	ctx.fillStyle = ctx.strokeStyle = 'white';
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.rect (this.rect3.x, this.rect3.y, this.rect3.w, this.rect3.h); //inner rectangle
	ctx.closePath();
	ctx.fillStyle = ctx.strokeStyle = 'white';
	ctx.fill();
	ctx.stroke();

	// draw bounce vector
	var res = bounces (this.rect1, this.circle1);
	if (!res.bounce) 
		{
			res = bounces (this.ring1, this.circle1); 
		}
	if(!res.bounce)
		{
			res = bounces (this.ring2, this.circle1);
		}

	if (res.bounce)
	{
	    // update speed vector
		this.bounce (res);
		
	    // draw rebound vector
		//ctx.strokeStyle = 'blue';
		ctx.beginPath();
		ctx.moveTo (this.circle1.x, this.circle1.y);
		ctx.lineTo (
		    this.circle1.x + this.circle1.r * res.x,
		    this.circle1.y + this.circle1.r * res.y);
		ctx.closePath();
		ctx.stroke();
	}
}

// this.set_fill = function (f)
// { 
// 	this.fill = f;
// 	this.redraw(); 
// }

this.bounce = function (bounce)
{
	var normal_len = bounce.x*this.speed.x + bounce.y*this.speed.y;
	var normal = { x: bounce.x*normal_len, y: bounce.y*normal_len };
	this.speed = { x: this.speed.x-2*normal.x, y: this.speed.y-2*normal.y };

}

canvas = document.getElementById('canvas');
ctx   = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 80;

this.rect1 = { x:1, y:1, w:canvas.width-2, h:canvas.height }; //outer rectangle
this.rect2 = { x:13, y:10, w:5, h:20 };
this.rect3 = { x:22, y:10, w:5, h:20 }; 
this.ring1 = { img:ring, x:canvas.height/8, y:100, w:80, h:80 };
this.ring2 = { img:ring, x:(canvas.height/4+canvas.height/6), y:100, w:80, h:80 };
this.circle1 = { x:ballX, y:ballY, r:20 };
this.circle2 = { x:20, y:20, r:15 };

ctx.strokeStyle = 'black';
ctx.stroke();
var period = 5; // milliseconds
var speed = 600; // pixels/second
this.speed = { x:speed*period/1000, y:speed*period/1000 };
this.redraw ();

var timer_id; // reference of the timer, needed to stop it


function animate ()
{ //step 1 everytime
	if(pauseflag == true)
	{
		this.circle1.x = this.circle1.x;
		this.circle1.y = this.circle1.y;
	}
	else
	{
	if(time != 0)
	{
		if(movement == "over")
		{
			this.circle1.y += 6;
			this.circle1.x = xBall;
		}
		if(movement == "right" || movement == "left")
		{
			movement = "up";
			this.circle1.y -= 6;
		}
		if(movement == "up")
		{
			this.circle1.y -= 3;
			if(this.circle1.y < 30)
			{
				movement = "down";
				//this.circle1.y += 10;
			}
		}
		else
		{
	    this.circle1.x += this.speed.x;
	    this.circle1.y += this.speed.y;
	    }
	    if (this.circle1.y >= (canvas.height - 110))
	    {
	    	mouseclick = "true";
	    	clearInterval(timer_id);
	    	movement = "left";
	    	ballX = this.circle1.x;
	    	ballY = this.circle1.y;
	    	InitialLoad();
	    }
	    this.redraw();
	}
	else
	{
		clearInterval(initialTimerId);
		clearInterval(counter);
		clearInterval(timer_id);
		canvas.removeEventListener('mousedown', MouseClick, false);
		this.circle1.x = this.circle1.x;
		this.circle1.y = this.circle1.y;
	}
	}
}

timer_id = setInterval(animate.bind(this), period);

}

function MouseClick(e)
{
	x2 = e.clientX - this.offsetLeft;
	y2 = e.clientY - this.offsetTop;
	x1 = 20;
	y1 = 20;
	diffX = x2 - x1;
	diffY = y2 - y1;
	distance = Math.sqrt(Math.pow(diffX,2) + Math.pow(diffY,2));
	if(distance <= 15)
	{
		if(pauseflag == false)
		{
			clearInterval(timer_id);
			clearInterval(initialTimerId);
			localStorage.setItem('pauseTime',time);
			localStorage.setItem('pauseMovement',movement);
			window.removeEventListener('mousedown', MouseClick, false);
			//clearInterval(counter);
			pauseflag = true;
		}
		else
		{
			pauseflag = false;
			if (movement == "left" || movement == "right")
			 {
			 	initialDemo = new InitialDemo();
			 }
			localStorage.getItem('movement',pauseMovement);
		}
	}
	else
	{
		if(mouseclick)
		{
			if(pauseflag == false)
			{
			mouseclick = false;
			clearInterval(initialTimerId);
			demo = new Demo();
			}
	}
}
}

function InitialDemo ()
{

this.redraw = function ()
{ 
    //canvas.height = canvas.height;
    canvas.width = window.innerWidth;
	canvas.height = window.innerHeight - 80;
    ctx.clearRect(0,0,canvas.width, canvas.height); // reset canvas
	//step2 everytime
	// draw rectangles every time!
	ctx.fillStyle = ctx.strokeStyle = 'black';
	ctx.beginPath();
	ctx.rect (this.rect1.x, this.rect1.y, this.rect1.w, this.rect1.h); //outer rectangle
	//ctx.strokeStyle = 'black';
	ctx.closePath();
	//ctx.stroke();
	

	ctx.beginPath();
	ctx.arc(this.circle1.x, this.circle1.y,this.circle1.r,0,2*Math.PI);
	ctx.fillStyle = ctx.strokeStyle = '#CC5200';
	//ctx.closePath();
	ctx.fill();
	ctx.stroke();
	
	ctx.beginPath();
	ctx.arc(this.circle2.x, this.circle2.y,this.circle2.r,0,2*Math.PI);
	ctx.fillStyle = ctx.strokeStyle = '#000000';
	ctx.fill();
	ctx.fillStyle = '#000000';
	ctx.stroke();

	ctx.beginPath();
	ctx.rect (this.rect2.x, this.rect2.y, this.rect2.w, this.rect2.h); //inner rectangle
	ctx.closePath();
	ctx.fillStyle = ctx.strokeStyle = 'white';
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.rect (this.rect3.x, this.rect3.y, this.rect3.w, this.rect3.h); //inner rectangle
	ctx.closePath();
	ctx.fillStyle = ctx.strokeStyle = 'white';
	ctx.fill();
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.drawImage (this.ring1.img, this.ring1.x, this.ring1.y, this.ring1.w, this.ring1.h); //inner rectangle
	ctx.closePath();
	ctx.fillStyle = ctx.strokeStyle = 'white';
	ctx.fill();
	ctx.stroke();

	
	ctx.beginPath();
	ctx.drawImage (this.ring2.img, this.ring2.x, this.ring2.y, this.ring2.w, this.ring2.h); //inner rectangle
	ctx.closePath();
	ctx.fillStyle = ctx.strokeStyle = 'white';
	ctx.fill();
	ctx.stroke();
	
}
canvas = document.getElementById('canvas');
ctx   = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 80;

this.rect1 = { x:1, y:150, w:(canvas.width), h:(canvas.height) }; //outer rectangle
this.rect2 = { x:13, y:10, w:5, h:20 };
this.rect3 = { x:22, y:10, w:5, h:20 };
// this.rect4 = { x:(canvas.height/4-55), y:60, w:98, h:50 };
this.ring1 = { img:ring, x:canvas.height/8, y:100, w:80, h:80 };
this.ring2 = { img:ring, x:(canvas.height/4+canvas.height/6), y:100, w:80, h:80 };


if (!cPosition) 
{
this.circle1 = { x:(canvas.width/2), y:(canvas.height - 110), r:20 };
cPosition = true;
}
else
{
	this.circle1 = { x:ballX, y:ballY, r:20 };
}
ctx.strokeStyle = '#000000';
ctx.stroke();
var period = 5; // milliseconds
var speed = 150; // pixels/second
this.speed = { x:speed*period/1000, y:speed*period/1000 };
this.circle2 = { x:20, y:20, r:15 };
this.redraw ();

 // reference of the timer, needed to stop it

//this.dragging = false;

function animate ()
{ //step 1 everytime
	if(time != 0)
	{
		if(movement == "right")
		{
	    this.circle1.x += 6;
		}
		if(movement == "left")
		{
	    this.circle1.x -= 6;
		}
		if(this.circle1.x >= (canvas.width - 40))
		{
			movement = "left";
		}
		if(this.circle1.y <= 30)
		{
			movement = "right";
		}
		if(this.circle1.x <= 30)
		{
			movement = "right";
		}
		ballX = this.circle1.x;
		ballY = this.circle1.y;
		this.redraw();
	}
	else
	{
		clearInterval(initialTimerId);
		clearInterval(counter);
		clearInterval(timer_id);
		canvas.removeEventListener('mousedown', MouseClick, false);
		this.circle1.x = this.circle1.x;
		this.circle1.y = this.circle1.y;
	}
}
initialTimerId = setInterval(animate.bind(this), period);
}

window.onload = function()
{
ringImage = document.getElementById("ring");
InitialLoad();
}

function InitialLoad()
{
document.getElementById("levelId").innerHTML = levelId;
ringImage = document.getElementById("ring");
initialDemo = new InitialDemo();
var image = "images/background.jpg";
document.getElementById("background").style.backgroundImage = "url(" + image + ")";
document.getElementById("canvas").style.backgroundImage = "url(" + image + ")";
canvas.addEventListener('mousedown',MouseClick,false);
}


function timer()
{
	document.getElementById("target").innerHTML = targetScore;
	if(pauseflag == true)
	{
		time = parseInt(localStorage.getItem('pauseTime'));
	}
	else
	{
	if(!timeflag)
	{
	time = time - 0.5;
	}
	else
	{
	time = time - 1; 
	}
}
if (time == 0)
{
	if(score >= baseScore + extraScore)
	{
		message = "YES";
		DisplayPopUp(message);
		if(levelId == 8)
		{
			alert("You've now completed the Game!");
			window.location.href="index.html";	
		}
	}
	else
	{
		message = "NO";
		DisplayPopUp(message);
	}
}
if(time >= 0 && pauseflag == false)
{
document.getElementById("timer").innerHTML = time;
}
}

function DisplayPopUp(displayMessage)
{
	clearInterval(initialTimerId);
	clearInterval(counter);
	clearInterval(timer_id);
	canvas.removeEventListener('mousedown', MouseClick, false);
	message = displayMessage;
	document.getElementById('light').style.display='block';
    document.getElementById('fade').style.display='block';

   // document.getElementById('light').style.borderColor = bgColor;
    document.getElementById('light').style.backgroundColor = "lightgrey";
    if(levelId == 8)
    	{
    	document.getElementById('display').innerHTML = "CONGRATULATIONS! YOU ARE NOW A CHAMPION!!!";
    	}
    else
    	{
		if(message == "NO")
    	{
			document.getElementById('display').innerHTML = "FAILED !";
			document.getElementById('popUpButton').value = "TRY AGAIN";
		//	document.getElementById('popUpButton').innerHTML = "TRY AGAIN";
    	}
	else
		{
		document.getElementById('display').innerHTML = "Congratulations! You have cleared Level"+levelId;
		document.getElementById('popUpButton').value = "CONTINUE";
		++levelId;
		//document.getElementById('popUpButton').innerHTML = "CONTINUE";
		
		}
    	}
}

function ClearPopUp()
{
 document.getElementById('light').style.display='none';
 document.getElementById('fade').style.display='none';
 if(message == "NO")
	 {
	 window.location.href="ball-bounce.html";
	 }
 else
	  {
	  	setTime += 30;
		time = setTime;
		extraScore = extraScore + 200;
		targetScore = baseScore + extraScore;
		score = 0;
		localStorage.setItem('level', levelId);
		localStorage.setItem('baseScore', baseScore);
		localStorage.setItem('extraScore', extraScore);
		localStorage.setItem('time', time);
		localStorage.setItem('targetScore', targetScore);
		localStorage.setItem('setTime', setTime);
		document.getElementById("levelId").innerHTML = levelId;
		document.getElementById("timer").innerHTML = time;
		document.getElementById("showScore").innerHTML = zero;
		document.getElementById("target").innerHTML = targetScore;
		score = 0;
		timeflag = true;	
	 window.location.href="ball-bounce.html";
	 }
}

