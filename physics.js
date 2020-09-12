Game.prototype.Vec=function(x,y,z){
	this.x=x;
	this.y=y;
	this.z=z;
	this.add=function(o){
		this.x+=o.x;
		this.y+=o.y;
		this.z+=o.z;
	}
	this.sub=function(o){
		this.x-=o.x;
		this.y-=o.y;
		this.z-=o.z;
	}
	this.mult=function(o){
		this.x*=o;
		this.y*=o;
		this.z*=o;
	}
	this.div=function(o){
		this.x/=o;
		this.y/=o;
		this.z/=o;
	}
}
Game.prototype.Vec.add=function(a,b){
	return new (Game.prototype.Vec)(a.x+b.x,a.y+b.y,a.z+b.z);
}
Game.prototype.Vec.sub=function(a,b){
	return new (Game.prototype.Vec)(a.x-b.x,a.y-b.y,a.z-b.z);
}
Game.prototype.Vec.mult=function(a,b){
	return new (Game.prototype.Vec)(a.x*b,a.y*b,a.z*b);
}
Game.prototype.Vec.div=function(a,b){
	return new (Game.prototype.Vec)(a.x/b,a.y/b,a.z/b);
}
