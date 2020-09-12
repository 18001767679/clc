var Game=function(ele){
	var that=this;
	ele.innerHTML=`
<canvas id="game-canvas-for-${ele.id}"></canvas>
<textarea id="game-coding-area-for-${ele.id}"></textarea>
<button id="game-run-button-for-${ele.id}"></button>
`;
	this.ctx=document.getElementById("game-canvas-for-"+ele.id);
	this.code=document.getElementById("game-coding-area-for-"+ele.id);
	this.runButton=document.getElementById("game-run-button-for-"+ele.id);
	this.entity=function(pos,vel,mass,img){
		this.game=that;
		this.pos=pos;
		this.vel=vel;
		this.mass=mass;
		this.img=new Image();
		this.img.src=img;
		this.force=function(o){
			this.vel.add(o);
		};
		this.update=function(){
			this.pos.add(this.vel);
			this.game.ctx.drawImage(this.img,this.pos.x,this.pos.y-this.pos.z/10);
		};
	};
	this.entities=[];
	this.goals=[];
	this.runButton.onclick=function(){
		var th=that;
		th.run=setInterval(function(){
			for(let i in th.entities){
				for(let j in th.entities){
					if(i==j){
						continue;
					}
					th.entities[i].force(Math.floor(Math.sqrt((th.entities[i].pos.x-th.entities[j].pos.x)*(th.entities[i].pos.x-th.entities[j].pos.x)+(th.entities[i].pos.y-th.entities[j].pos.y)*(th.entities[i].pos.y-th.entities[j].pos.y)+(th.entities[i].pos.y-th.entities[j].pos.y)*(th.entities[i].pos.y-th.entities[j].pos.y))));
				}
				th.entities[i].update();
			}
		},40);
	}
}
document.body.innerHTML+=`<script src="/physics.js"></script>`
