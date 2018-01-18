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
var linked=new Int32Array(1);
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
	linked=new Int32Array(n*m);
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
function deledg(x1,x2,x3,x4){
	//0<=x1<n,0<=x2<m,-1<=x3<=n,-1<=x4<=m
	if(debuging)console.log(`delete ${x1},${x2} ${x3},${x4}`);
	var i1=edglist.length-1;
	for(;i1>=0;i1-=4){
		if(((edglist[i1]===x4)&&(edglist[i1-1]===x3)&&(edglist[i1-2]===x2)&&(edglist[i1-3]===x1))||
		((edglist[i1]===x2)&&(edglist[i1-1]===x1)&&(edglist[i1-2]===x4)&&(edglist[i1-3]===x3))){
			if(x3<0||x3>=n||x4<0||x4>=m){
				if(x1-1===x3)edge[x1*m+x2]&=14;
				else if(x2+1==x4)edge[x1*m+x2]&=13;
				else if(x1+1==x3)edge[x1*m+x2]&=11;
				else if(x2-1==x4)edge[x1*m+x2]&=7;
			}else if(x1-1===x3){
				edge[x1*m+x2]&=14;
				edge[x3*m+x4]&=11;
			}else if(x2+1==x4){
				edge[x1*m+x2]&=13;
				edge[x3*m+x4]&=7;
			}else if(x1+1==x3){
				edge[x1*m+x2]&=11;
				edge[x3*m+x4]&=14;
			}else if(x2-1==x4){
				edge[x1*m+x2]&=7;
				edge[x3*m+x4]&=13;
			}
			edglist[i1]=edglist[edglist.length-1];
			edglist[i1-1]=edglist[edglist.length-2];
			edglist[i1-2]=edglist[edglist.length-3];
			edglist[i1-3]=edglist[edglist.length-4];
			edglist.length-=4;
			return;
		}
	}
	console.warn(`Failed to delete edge (${x1},${x2})<==>(${x3},${x4})!`);
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
function cutfromfa(v0,x0,y0){
	function dfs(v1,x1,y1,v2){
		if(debuging)console.log(`dfs ${v1} (${x1},${y1}) ${v2};`);
		if(edge[v1]&1){
			if(x1<=0)return -1;
			else if((v1-m!=v2)&&dfs(v1-m,x1-1,y1,v1))return 1;
		}
		if(edge[v1]&2){
			if(y1>=m-1)return -1;
			else if((v1+1!=v2)&&dfs(v1+1,x1,y1+1,v1))return 2;
		}
		if(edge[v1]&4){
			if(x1>=n-1)return -1;
			else if((v1+m!=v2)&&dfs(v1+m,x1+1,y1,v1))return 4;
		}
		if(edge[v1]&8){
			if(y1<=0)return -1;
			else if((v1-1!=v2)&&dfs(v1-1,x1,y1-1,v1))return 8;
		}
		return 0;
	}
	var i1=dfs(v0,x0,y0,v0);
	if(!i1)console.warn(`Failed to cut ${v0}(${x0},${y0}) from father?`);
	if(i1<0){
		edge[v0]&=15^(((x0<=0)?1:0)|((y0>=m-1)?2:0)|((x0>=n-1)?4:0)|((y0<=0)?8:0));
		if(x0<=0){
			if(y0<m-1)deledg(x0,y0,x0-1,y0);
			else deledg(x0,y0,x0,y0+1);
		}else if(x0>=n-1){
			if(y0>0)deledg(x0,y0,x0+1,y0);
			else deledg(x0,y0,x0,y0-1);
		}else if(y0<=0)deledg(x0,y0,x0,y0-1);
		else deledg(x0,y0,x0,y0+1);
	}else if(i1==1)deledg(x0,y0,x0-1,y0);
	else if(i1==2)deledg(x0,y0,x0,y0+1);
	else if(i1==4)deledg(x0,y0,x0+1,y0);
	else if(i1==8)deledg(x0,y0,x0,y0-1);
	return;
}

function addedge(){
	var i1,i2,i3=[],i4=-1,i5;
	bcj.fill(-1);
	for(i1=0;i1<n;++i1){
		for(i2=0;i2<m;++i2){
			++i4;
			if(!linked[i4]){
				if((i1===0)||(i1===n-1)||(i2===0)||(i2===m-1)){
					i3[i3.length]=i4;
					i3[i3.length]=233;
				}
				continue;
			}
			if((i1>0)&&(edge[i4]&1))linkbcj(i4,i4-m);
			if((i2<m-1)&&(edge[i4]&2))linkbcj(i4,i4+1);
			if((i1<n-1)&&(edge[i4]&4))linkbcj(i4,i4+m);
			if((i2>0)&&(edge[i4]&8))linkbcj(i4,i4-1);
		}
	}
	for(i4=1;i4<m;++i4){
		if(!samebcj(i4,i4-1)){
			if(linked[i4]){
				i3[i3.length]=i4;
				i3[i3.length]=8;
			}
			if(linked[i4-1]){
				i3[i3.length]=i4-1;
				i3[i3.length]=2;
			}
		}
	}
	i4=m-1;
	for(i1=1;i1<n;++i1){
		++i4;
		if(!samebcj(i4,i4-m)){
			if(linked[i4]){
				i3[i3.length]=i4;
				i3[i3.length]=1;
			}
			if(linked[i4-m]){
				i3[i3.length]=i4-m;
				i3[i3.length]=4;
			}
		}
		for(i2=1;i2<m;++i2){
			++i4;
			if(!samebcj(i4,i4-1)){
				if(linked[i4]){
					i3[i3.length]=i4;
					i3[i3.length]=8;
				}
				if(linked[i4-1]){
					i3[i3.length]=i4-1;
					i3[i3.length]=2;
				}
			}
			if(!samebcj(i4,i4-m)){
				if(linked[i4]){
					i3[i3.length]=i4;
					i3[i3.length]=1;
				}
				if(linked[i4-m]){
					i3[i3.length]=i4-m;
					i3[i3.length]=4;
				}
			}
		}
	}
	if(i3.length<=0){
		if(debuging)console.info('no empty edge.');
		return;
	}else if(debuging)console.info(i3);
	i5=((Math.random()*i3.length)|1);
	i4=i3[i5-1];i5=i3[i5];
	function linktoborder(v0){
		var i1=((v0/m)|0),i2=((v0-i1*m)|0);
		linked[v0]=1;
		edge[v0]=((i1<=0)?1:0)|((i2>=m-1)?2:0)|((i1>=n-1)?4:0)|((i2<=0)?8:0);
		if(i1<=0){
			if(i2<m-1)pushedg(i1,i2,i1-1,i2);
			else pushedg(i1,i2,i1,i2+1);
		}else if(i1>=n-1){
			if(i2>0)pushedg(i1,i2,i1+1,i2);
			else pushedg(i1,i2,i1,i2-1);
		}else if(i2<=0){
			pushedg(i1,i2,i1,i2-1);
		}else{
			if(i2<m-1)console.warn(`Failed to link (${i1},${i2}) to border!`);
			pushedg(i1,i2,i1,i2+1);
		}
		return;
	}
	function linktopoint(v1,x1){
		var v2=v1;
		var i1=((v1/m)|0),i2=((v1-i1*m)|0),i3=i1,i4=i2;
		if(x1==1){
			v2-=m;i3-=1;
		}else if(x1==2){
			v2+=1;i4+=1;
		}else if(x1==4){
			v2+=m;i3+=1;
		}else if(x1==8){
			v2-=1;i4-=1;
		}
		if(linked[v2])cutfromfa(v2,i3,i4);
		else linked[v2]=2;
		pushedg(i1,i2,i3,i4);
		edge[v1]|=x1;
		edge[v2]|=15&((x1>>2)|(x1<<2));
		return;
	}
	if(debuging)console.log(i4,i5);
	if(i5===233){
		linktoborder(i4);
	}else linktopoint(i4,i5);
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
	addedge();
	drawcanvas();
	requestAnimationFrame(update);
	return;
}
requestAnimationFrame(update);
