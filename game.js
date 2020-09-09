document.body.innerHTML+=`<script src="https://cdn.jsdelivr.net/processing.js/1.4.8/processing.min.js"></script>`

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
		var sketchProc = function(processingInstance) {
     		with (processingInstance) {
        		size(400, 400); 
        		frameRate(30);
        		
    		}
		};
    	var processingInstance = new Processing(this.ctx, sketchProc); 
	}
}
