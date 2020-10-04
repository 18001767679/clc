var CLC = {
    entity: function(pos, vel, mass, img, game) {
        this.id = "Anonymous"
        this.type = "entity";
        this.game = game;
        this.pos = pos;
        this.vel = vel;
        this.mass = mass;
        this.img = new Image();
        this.img.src = img;
        this.load=function(item){
            let req=new XMLHttpRequest();
			req.open("GET","modules/"+item+".ext",false);
			req.send();
			eval(req.responseText);
			window.ext(this);
        }
        this.force = function(o) {
            this.vel.add(CLC.Vec.div(o, this.mass));
        };
        this.run = async function() {
            eval(this.behave);
        }
        this.update = function() {
            this.codePointer++;
            this.pos.add(this.vel);
            this.game.ctx.drawImage(this.img, this.pos.x, this.pos.y - this.pos.z / 10);
        };
        this.maxSpeed = 10;
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.attackDamage = 7;
        this.attackRange = 3;
        this.cleaveDamage = 115.7;
        this.cleaveRange = 10;
        this.team = "decoration"
        this.moveXY = function(x, y) {
            let xo = (x - this.pos.x) / Math.sqrt((x - this.pos.x) * (x - this.pos.x) + (y - this.pos.y) * (x - this.pos.y)) * this.maxSpeed;
            let yo = (y - this.pos.y) / Math.sqrt((x - this.pos.x) * (x - this.pos.x) + (y - this.pos.y) * (x - this.pos.y)) * this.maxSpeed;
            this.vel.x = xo / 100;
            this.vel.y = yo / 100;
            let time = new Date.getTime()
            while (this.distanceTo({ pos: { x: x, y: y } }) > 1 && new Date.getTime() - 3000 < st) {}
            if (new Date.getTime() - 3000 < st) {
                throw this.id + ":I can't get there!";
            } else {
                this.vel.x = 0;
                this.vel.y = 0;
            }
        };
        this.findByTeam = function(t) {
            let f = []
            for (let i in this.game.entities) {
                if (this.game.entities[i].team === t) {
                    f.push(this.game.entities[i])
                }
            }
            return f
        }
        this.findItems = function() {
            return this.findByTeam("collectable");
        }
        this.findEnemies = function() {
            return this.findByTeam("ogres");
        }
        this.findFriends = function() {
            return this.findByTeam("humans");
        }
        this.findByType = function() {
            let f = []
            for (let i in this.game.entities) {
                if (this.game.entities[i].type === t) {
                    f.push(this.game.entities[i])
                }
            }
            return f
        }
        this.findNearest = function(l) {
            let minDist = 9001;
            let minE = null;
            for (let i in l) {
                if (this.distanceTo(l[i]) < minDist) {
                    minDist = this.distanceTo(l[i]);
                    minE = l[i]
                }
            }
            return minE
        }
        this.move = function(u) {
            var x = u.x;
            var y = u.y;
            let xo = (x - this.pos.x) / Math.sqrt((x - this.pos.x) * (x - this.pos.x) + (y - this.pos.y) * (x - this.pos.y)) * this.maxSpeed;
            let yo = (y - this.pos.y) / Math.sqrt((x - this.pos.x) * (x - this.pos.x) + (y - this.pos.y) * (x - this.pos.y)) * this.maxSpeed;
            this.pos.x += xo / 100;
            this.pos.y += yo / 100;
        };
        this.distanceTo = function(u) {
            return Math.sqrt((u.pos.x - this.pos.x) * (u.pos.x - this.pos.x) + (u.pos.y - this.pos.y) * (u.pos.x - this.pos.y));;
        };
        this.attack = function(u) {
            this.moveXY(u.pos.x, u.pos.y);
            if (this.distanceTo(u) < this.attackRange) {
                u.health -= this.attackDamage;
            }
        };
        this.cleave = function() {
            for (let i in this.entities) {
                if (this.distanceTo(this.entities[i]) < this.cleaveRange) {
                    this.entities[i].health -= this.cleaveDamage;
                }
            }
        };
        this.shield = function() {
            this.health += (this.maxHealth - this.health) / 30;
        };
        this.behave = ""
    },
    Game: function(ele) {
        ele.innerHTML = `<canvas id="game-canvas-for-${ele.id}" background="/assets/bg.png"></canvas><textarea id="game-coding-area-for-${ele.id}"></textarea><button id="game-run-button-for-${ele.id}">Run</button><div id="game-goals-div-for-${ele.id}"></div>`;
        this.ctx = document.getElementById("game-canvas-for-" + ele.id).getContext("2d");
        this.canvas = document.getElementById("game-canvas-for-" + ele.id);
        this.code = document.getElementById("game-coding-area-for-" + ele.id);
        this.runButton = document.getElementById("game-run-button-for-" + ele.id);
        this.entities = [];
        this.goals = [];
        this.player = null;
        this.codePointer = 0;
        this.runButton.onclick = function() {
            window.currGame = this;
            try {
                this.player.run();
            } catch (e) {
                console.log(e);
            }
            this.runningCode = window["game-" + window.games].code.value;
            this.startTime = new Date().getTime();
            setInterval(this.run, 100);
        };
        this.run = function() {
            this.ctx.clearRect(0, 0, document.getElementById("game-canvas-for-" + window.games).width, document.getElementById("game-canvas-for-" + window.games).height);
            this.codePointer++;

            for (let i in this.entities) {
                for (let j in this.entities) {
                    if (i == j) {
                        continue;
                    }
                    if (i.type != "decoration" && j.type != "decoration") { //Decorations dont bump.
                        this.entities[i].force(Math.floor(Math.sqrt(
                            (this.entities[i].pos.x - this.entities[j].pos.x) *
                            (this.entities[i].pos.x - this.entities[j].pos.x) +
                            (this.entities[i].pos.y - this.entities[j].pos.y) *
                            (this.entities[i].pos.y - this.entities[j].pos.y) +
                            (this.entities[i].pos.z - this.entities[j].pos.z) *
                            (this.entities[i].pos.z - this.entities[j].pos.z)
                        )));
                    }
                }
                this.entities[i].update();
            }
            let f = true;
            for (let i in this.goals) {
                f = f && this.goals[i][1]();
            }
            if (f) {
                this.ctx.fillStyle = "purple";
                this.ctx.font = "50px Arial";
                this.ctx.textAlign = "center";
                this.ctx.fillText("You Won!", this.canvas.width / 2, this.canvas.height / 2);
                clearInterval(this.run);
            }
            if (this.startTime + 120000 > new Date().getTime()) {
                this.ctx.fillStyle = "purple";
                this.ctx.font = "50px Arial";
                this.ctx.textAlign = "center";
                this.ctx.fillText("Out Of Time", this.canvas.width / 2, this.canvas.height / 2);
                clearInterval(this.run);
            }
        }
        this.addGoal = function(t, f) {
            this.goals.push([t, f]);
        };
        this.spawnPlayer = function(x, y) {
            this.player = this.player || new(this.entity)(new(this.Vec)(x, y, 0), new(this.Vec)(0, 0, 0), 10, "/assets/hero.png", this);
            this.player.id = "Hero";
            return this.player;
        };
        this.spawnXY = function(img, x, y) {
            let a = new(this.entity)(new(this.Vec)(x, y, 0), new(this.Vec)(0, 0, 0), 10, "/assets/" + img + ".png", this);
            this.entities.push(a);
            return a;
        };
        setTimeout("window['game-'+window.games].code.value=window['game-'+window.games].originalCode+''", 10)
    },
    Vec: function(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.add = function(o) {
            this.x += o.x;
            this.y += o.y;
            this.z += o.z;
        }
        this.sub = function(o) {
            this.x -= o.x;
            this.y -= o.y;
            this.z -= o.z;
        }
        this.mult = function(o) {
            this.x *= o;
            this.y *= o;
            this.z *= o;
        }
        this.div = function(o) {
            this.x /= o;
            this.y /= o;
            this.z /= o;
        }
    }
}
CLC.Vec.add = function(a, b) {
    return new(CLC.Vec)(a.x + b.x, a.y + b.y, a.z + b.z);
}
CLC.Vec.sub = function(a, b) {
    return new(CLC.Vec)(a.x - b.x, a.y - b.y, a.z - b.z);
}
CLC.Vec.mult = function(a, b) {
    return new(CLC.Vec)(a.x * b, a.y * b, a.z * b);
}
CLC.Vec.div = function(a, b) {
    return new(CLC.Vec)(a.x / b, a.y / b, a.z / b);
}
