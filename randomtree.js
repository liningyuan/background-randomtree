"use strict";
var debuging=false;

var myrand=(function(){
	var i1=613;
	return function(){return (i1=((i1*613123+233333)&2147483647))*0.0000000004656612873077392578125;}
})();
if(debuging||false)Math.random=myrand;

var cv=document.createElement('canvas');
cv.width=window.innerWidth;
cv.height=window.innerHeight;
cv.style.cssText="background:#333333;position:fixed;left:0px;top:0px;z-index:-2147483648";
document.body.appendChild(cv);
var ctx=cv.getContext('2d');
var n=1,m=1;
var edge=new Int32Array(1);
var edglist=[];
var bcj=new Int32Array(1);
function init(){
	cv.height=window.innerHeight;
	cv.width=window.innerWidth;
	var i1=0,i2=0,i3=-998244353,i4=window.innerHeight/window.innerWidth;
	if(i4<0.4||i4>2.5){
		for(i1=2;i1<=24;++i1){
			for(i2=2;i2<=24;++i2){
				if((i2/i1<=i4)&&(i2/i1>i3)){
					i3=i2/i1;
					m=i1;n=i2;
				}
			}
		}
	}else{
		for(i1=8;i1<=20;++i1){
			for(i2=8;i2<=20;++i2){
				if((i2/i1<=i4)&&(i2/i1>i3)){
					i3=i2/i1;
					m=i1;n=i2;
				}
			}
		}
	}
	edge=new Int32Array(n*m);
	edglist=[];
	bcj=new Int32Array(n*m);
	return;
};
init();
function pushedg(x1,x2,x3,x4){
	edglist[edglist.length]=x1;
	edglist[edglist.length]=x2;
	edglist[edglist.length]=x3;
	edglist[edglist.length]=x4;
	return;
}
function findbcj(v0){
	var i1=v0,i2=v0;
	for(;bcj[i1]>=0;i1=bcj[i1]);
	for(;v0!==i1;v0=i2){
		i2=bcj[v0];
		bcj[v0]=i1;
	}
	return i1;
}
function linkbcj(v1,v2){
	// if(debuging)console.log('link',v1,v2);
	v1=findbcj(v1);v2=findbcj(v2);
	if(v1!=v2){
		if(bcj[v1]<bcj[v2]){
			bcj[v1]+=bcj[v2];
			bcj[v2]=v1;
		}else{
			bcj[v2]+=bcj[v1];
			bcj[v1]=v2;
		}
	}
	return;
}
function samebcj(v1,v2){
	return findbcj(v1)==findbcj(v2);
}

function addedge(){
	var i1=0,i2=0,i3=[],i4=-1,i5=0;
	bcj.fill(-1);
	for(i1=0;i1<n;++i1){
		for(i2=0;i2<m;++i2){
			++i4;
			if(edge[i4]&1)linkbcj(i4,i4-m);
			if(edge[i4]&2)linkbcj(i4,i4-1);
		}
	}
	i4=-1;
	for(i1=0;i1<n;++i1){
		for(i2=0;i2<m;++i2){
			++i4;
			if((i1>0)&&(!samebcj(i4,i4-m))){
				i3[i3.length]=i4;
				i3[i3.length]=1;
			}
			if((i2>0)&&(!samebcj(i4,i4-1))){
				i3[i3.length]=i4;
				i3[i3.length]=2;
			}
		}
	}
	if(i3.length<=0){
		if(debuging)console.info('no empty edge.');
		return;
	}else if(debuging)console.info(i3);
	i5=((Math.random()*i3.length)|1);
	i4=i3[i5-1];i5=i3[i5];
	i1=((i4/m)|0);
	i2=i4-i1*m;
	if(i5==1){
		edge[i4]|=1;
		edge[i4-m]|=4;
		pushedg(i1,i2,i1-1,i2);
	}else if(i5==2){
		edge[i4]|=2;
		edge[i4-1]|=8;
		pushedg(i1,i2,i1,i2-1);
	}else console.warn(`Failed to add edge ${i4},${i5}.`);
	return;
}
function removeedge(){
	if(edglist.length<=0){
		if(debuging)console.info("no edge to remove.");
		return;
	}
	var i1=((Math.random()*edglist.length)|3),i2=0,i3=0;
	i2=edglist[i1-3]*m+edglist[i1-2];
	i3=edglist[i1-1]*m+edglist[i1];
	edglist[i1]=edglist[edglist.length-1];
	edglist[i1-1]=edglist[edglist.length-2];
	edglist[i1-2]=edglist[edglist.length-3];
	edglist[i1-3]=edglist[edglist.length-4];
	edglist.length-=4;
	if(i3<i2){i1=i3;i3=i2;i2=i1;}
	if(i3-1==i2){
		edge[i3]&=13;
		edge[i2]&=7;
	}else if(i3-m==i2){
		edge[i3]&=14;
		edge[i2]&=11;
	}else console.warn(`Failed when deleting edge (${i3},${i2})!`);
	return;
}
addedge();
function drawcanvas(){
	var i1,i2,i3;
	ctx.clearRect(0,0,cv.width,cv.height);
	i3=cv.width/m;
	ctx.fillStyle='#66ccff';
	ctx.lineWidth=6;
	ctx.strokeStyle='#3399cc';
	var midw=i3*0.5,midh=(cv.height-i3*(n-1))*0.5;
	for(i1=edglist.length-4;i1>=0;i1-=4){
		ctx.beginPath();
		ctx.moveTo(edglist[i1+1]*i3+midw,edglist[i1]*i3+midh);
		ctx.lineTo(edglist[i1+3]*i3+midw,edglist[i1+2]*i3+midh);
		ctx.stroke();
	}
	for(i1=0;i1<n;++i1){
		for(i2=0;i2<m;++i2){
			ctx.fillRect(i2*i3+midw-4,i1*i3+midh-4,8,8);
		}
	}
	return;
}
drawcanvas();
window.onresize=function(){
	var i1=(window.innerHeight*m)/(n*window.innerWidth);
	if(i1>=0.9&&i1<=1.1){
		cv.width=window.innerWidth;
		cv.height=window.innerHeight;
	}else init();
	return;
}
var stopped=false;
var timestamp=0;
function update(){
	if(stopped)return;
	++timestamp;
	if(timestamp&31)return requestAnimationFrame(update);
	if(debuging)console.log(edglist);
	cv.width=window.innerWidth;
	cv.height=window.innerHeight;
	//0.7/(density+0.7)>rand
	if(Math.random()*(0.7+edglist.length*0.25/(n*m))<0.7)addedge();
	else removeedge();
	drawcanvas();
	requestAnimationFrame(update);
	return;
}
requestAnimationFrame(update);
