var Game=function(ele){
	ele.innerHTML=`
<canvas id="game-canvas-for-${ele.id}"></canvas>
<textarea id="game-coding-area-for-${ele.id}"></textarea>
<button id="game-run-button-for-${ele.id}"></button>
`;
	this.ctx=document.getElementById("game-canvas-for-"+ele.id);
	this.code=document.getElementById("game-coding-area-for-"+ele.id);
	this.runButton=document.getElementById("game-run-button-for-"+ele.id);
	this.entity=function(){
		
	}
}
