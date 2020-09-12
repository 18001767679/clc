var Game=function(ele){
	var that=this;
	ele.innerHTML=`
<canvas id="game-canvas-for-${ele.id}"></canvas>
<textarea id="game-coding-area-for-${ele.id}"></textarea>
<button id="game-run-button-for-${ele.id}"></button>
`;
	this.ctx=document.getElementById("game-canvas-for-"+ele.id).getContext("2d");
	this.code=document.getElementById("game-coding-area-for-"+ele.id);
	this.runButton=document.getElementById("game-run-button-for-"+ele.id);
	this.entity=function(pos,vel,mass,img){
		this.id="Anonymous"
		this.game=that;
		this.pos=pos;
		this.vel=vel;
		this.mass=mass;
		this.img=new Image();
		this.img.src=img;
		this.force=function(o){
			this.vel.add(that.Vec.div(o,this.mass));
		};
		this.update=function(){
			this.pos.add(this.vel);
			this.vel.mult(0.99);
			this.game.ctx.drawImage(this.img,this.pos.x,this.pos.y-this.pos.z/10);
		};
		this.maxSpeed=10;
		this.maxHealth=100;
		this.health=this.maxHealth;
		this.attackDamage=7;
		this.attackRange=3;
		this.cleaveDamage=115.7;
		this.cleaveRange=10;
		this.moveXY=function(x,y){
			let xo=(x-this.pos.x)/Math.sqrt((x-this.pos.x)*(x-this.pos.x)+(y-this.pos.y)*(x-this.pos.y))*this.maxSpeed;
			let yo=(y-this.pos.y)/Math.sqrt((x-this.pos.x)*(x-this.pos.x)+(y-this.pos.y)*(x-this.pos.y))*this.maxSpeed;
			this.vel.x=xo/100;
			this.vel.y=yo/100;
			let time=new Date.getTime()
			while(this.distanceTo({pos:{x:x,y:y}})>1 && new Date.getTime()-3000<st){}
			if(new Date.getTime()-3000<st){
				throw this.id+":I can't get there!";
			}else{
				this.vel.x=0;
				this.vel.y=0;
			}
		};
		this.move=function(u){
			var x=u.x;
			var y=u.y;
			let xo=(x-this.pos.x)/Math.sqrt((x-this.pos.x)*(x-this.pos.x)+(y-this.pos.y)*(x-this.pos.y))*this.maxSpeed;
			let yo=(y-this.pos.y)/Math.sqrt((x-this.pos.x)*(x-this.pos.x)+(y-this.pos.y)*(x-this.pos.y))*this.maxSpeed;
			this.pos.x+=xo/100;
			this.pos.y+=yo/100;
		};
		this.distanceTo=function(u){
			return Math.sqrt((u.pos.x-this.pos.x)*(u.pos.x-this.pos.x)+(u.pos.y-this.pos.y)*(u.pos.x-this.pos.y));;
		};
		this.attack=function(u){
			this.moveXY(u.pos.x,u.pos.y);
			if(this.distanceTo(u)<this.attackRange){
				u.health-=this.attackDamage;
			}
		};
		this.cleave=function(){
			for(let i in this.entities){
				if(this.distanceTo(this.entities[i])<this.cleaveRange){
					this.entities[i].health-=this.cleaveDamage;
				}
			}
		};
		this.shield=function(){
			this.health+=(this.maxHealth-this.health)/30;
		};
	};
	this.entities=[];
	this.goals=[];
	this.player=null;
	this.codePointer=0;
	this.runButton.onclick=function(){
		var th=that;
		th.runningCode=th.code.split(";");
		th.run=setInterval(function(){
			th.ctx.clearRect(0, 0, document.getElementById("game-canvas-for-"+ele.id).width, document.getElementById("game-canvas-for-"+ele.id).height);
			th.codePointer++;
			try{
				eval("function(){return function(hero){"+th.runningCode[th.codePointer]+"}}")()(th.player);
			}catch(e){
				console.log(e);
			}
			for(let i in th.entities){
				for(let j in th.entities){
					if(i==j){
						continue;
					}
					th.entities[i].force(Math.floor(Math.sqrt(
						(th.entities[i].pos.x-th.entities[j].pos.x)*
						(th.entities[i].pos.x-th.entities[j].pos.x)+
						(th.entities[i].pos.y-th.entities[j].pos.y)*
						(th.entities[i].pos.y-th.entities[j].pos.y)+
						(th.entities[i].pos.z-th.entities[j].pos.z)*
						(th.entities[i].pos.z-th.entities[j].pos.z)
					)));
				}
				th.entities[i].update();
			}
			let f=true;
			for(let i in th.goals){
				f=f&&th.goals[i][1]();
			}
			if(f){
				th.ctx.fillStyle= "purple";
    			th.ctx.font = "50px Arial";
				th.ctx.textAlign="center";
    			th.ctx.fillText("You Won!", document.getElementById("game-canvas-for-"+ele.id).width/2, document.getElementById("game-canvas-for-"+ele.id).height/2);
				clearInterval(th.run);
			}
		},40);
	};
	this.addGoal=function(t,f){
		this.goals.push([t,f]);
	};
	this.spawnPlayer=function(x,y){
		this.player=this.player||new (this.entity)(new (this.Vec)(x,y,0),new (this.Vec)(0,0,0),10,"/assets/hero.png");
		this.player.id="Hero";
	};
}
document.body.innerHTML+=`<script src="/physics.js"></script>`
