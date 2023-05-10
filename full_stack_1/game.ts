var prompt = require('prompt');

enum EnumMoveDirection {
    UP = 'u',
    DOWN = 'd',
    LEFT = 'l',
    RIGHT = 'r',
}

interface Position {
    x: number;
    y: number;
}

class Item {
    _position: Position = {} as Position;

    isDeadly(): boolean {
        return false;
    }

    isVictory(): boolean {
        return false;
    }
}

// Actor
class Actor extends Item {
    move(direction: EnumMoveDirection): void {
        switch (direction) {            
            case EnumMoveDirection.UP:
                this._position.y = Math.min(this._position.y + 1, game._mapSize.y - 1);
                break;

            case EnumMoveDirection.DOWN:
                this._position.y = Math.max(this._position.y - 1, 0);
                break;

            case EnumMoveDirection.LEFT:
                this._position.x = Math.max(this._position.x - 1, 0);
                break;

            case EnumMoveDirection.RIGHT:
                this._position.x = Math.min(this._position.x + 1, game._mapSize.x - 1);
                break;
        }
    }
}

class Agent extends Actor {
    
}

class Wumpus extends Actor {
    isDeadly(): boolean {
        return true;
    }
}

var agent = new Agent();
agent._position.x = 0;
agent._position.y = 0;
var wumpus = new Wumpus();

// ItemImmovable
class ItemImmovable extends Item {
    isTemporary(): boolean {
        return false;
    }
}

class Stench extends ItemImmovable {
    //Code
}

class Gold extends ItemImmovable {
    isVictory(): boolean {
        return true;
    }
}

class Pit extends ItemImmovable {
    isDeadly(): boolean {
        return true;
    }
}

class Wind extends ItemImmovable {
    //Code
}

// Game
class Game {
    _mapSize: Position = {} as Position;
    _actors: Actor[];
    _items: Item[] = [] as Item[];
    _mapHidden: boolean[][];

    newGame(): void {
        agent._position.x = 0;
        agent._position.y = 0;

        this._mapHidden = [];
        for(let i = 0; i < this._mapSize.x; i++) {
            this._mapHidden[i] = [];
            for(let j = 0; j< this._mapSize.y; j++) {
                this._mapHidden[i][j] = true;
            }
        }
        this._mapHidden[agent._position.x][agent._position.y] = false;

        this._items = [];
        this._actors = [];

        let pit1 = new Pit();
        let pit2 = new Pit();
        let pit3 = new Pit();
        let gold = new Gold();
        setRandomPosition(wumpus._position, this._mapSize.x, this._mapSize.y, [agent._position]);
        setRandomPosition(pit1._position, this._mapSize.x, this._mapSize.y, [agent._position, wumpus._position]);
        setRandomPosition(pit2._position, this._mapSize.x, this._mapSize.y, [agent._position, wumpus._position, pit1._position]);
        setRandomPosition(pit3._position, this._mapSize.x, this._mapSize.y, [agent._position, wumpus._position, pit1._position, pit2._position]);
        setRandomPosition(gold._position, this._mapSize.x, this._mapSize.y, [agent._position, wumpus._position, pit1._position, pit2._position, pit3._position]);
        this._items.push(wumpus);
        this._items.push(pit1);
        this._items.push(pit2);
        this._items.push(pit3);
        this._items.push(gold);
        this._items.push(agent);

        for (let i = 0; i < this._items.length; i++) {
            if (this._items[i] instanceof Wumpus) {
                this._items = this._items.concat(createItemsAround(this._items[i]._position, Stench));
            }
            
            if (this._items[i] instanceof Pit) {
                this._items = this._items.concat(createItemsAround(this._items[i]._position, Wind));
            }
        }

        this.drawGame();
    }
    
    movePlayer(direction: EnumMoveDirection): void {
        agent.move(direction);
        this._mapHidden[agent._position.x][agent._position.y] = false;
        wumpusMove(wumpus);
        
        let funcLose = (function(item: Item) { return (item.isDeadly()); });
        let funcWin = (function(item: Item) { return (item.isVictory()); });
        if (isConditionInRange(0, funcLose)) {
            console.log('You have died!\n  n - New game\n  q - Quit game');
        } else if (isConditionInRange(0, funcWin)) {
            console.log('You have won!\n  n - New game\n  q - Quit game');
        }else this.drawGame();
    }
    
    //Rooms adjacent to wumpus = stench
    //Rooms adjacent to pit = wind
    drawGame(): void {
        let message = `
A - Agent
P - Pit
W - Wumpus
G - Gold`;
        console.log(message);
        console.log('\n-----------------------');
        // Initialize info var
        let info: String[][] = [[]] as String[][];
        for (let i = 0; i < this._mapSize.x; i++) {
            info[i] = [];
            for (let j = 0; j < this._mapSize.y; j++) {
                info[i].push('');
            }
        }
        // Fill info var
        for (let i = 0; i < this._items.length; i++) {
            let char:string = '';
            if (this._items[i] instanceof Agent) char = 'A';
            if (this._items[i] instanceof Wumpus) char = 'W';
            if (this._items[i] instanceof Pit) char = 'P';
            if (this._items[i] instanceof Gold) char = 'G';
            //if (this._items[i] instanceof Stench) char = 'S';
            //if (this._items[i] instanceof Wind) char = 'B';
            info[this._items[i]._position.x][this._items[i]._position.y] += char;
        }
        // Show info var
        for (let i = this._mapSize.y - 1; i >= 0; i--) {
            let line:string = '';
            for (let j = 0; j < this._mapSize.x; j++) {
                let infoFinal = info[j][i];
                let infoFinalLength = infoFinal.length;
                for (let k = 0; k < 5 - infoFinalLength; k++) {
                    infoFinal += '_';
                }
                line += (this._mapHidden[j][i] ? '?????' : infoFinal) + ' ';
                //line += (this._mapHidden[j][i] ? infoFinal : infoFinal) + ' ';
            }
            console.log(line + (i == 0 ? '' : '\n'));
        }
        console.log('-----------------------');

        if (this.isStench()) console.log('You feel a stench nearby!');
        if (this.isBreeze()) console.log('You feel a breeze nearby!');
    }

    isStench(): boolean {
        let func = (function(item: Item) { return (item instanceof Stench); });
        return isConditionInRange(1, func);
    }

    isBreeze(): boolean {
        let func = (function(item: Item) { return (item instanceof Wind); });
        return isConditionInRange(1, func);
    }
}

function createItemsAround(position: Position, ItemClass: typeof Item): Item[] {
    let createdItems: Item[] = [];
    createItemAtPosition(position.x, position.y, ItemClass, createdItems);
    if (position.x - 1 >= 0) createItemAtPosition(position.x - 1, position.y, ItemClass, createdItems);
    if (position.x + 1 < game._mapSize.x) createItemAtPosition(position.x + 1, position.y, ItemClass, createdItems);
    if (position.y - 1 >= 0) createItemAtPosition(position.x, position.y - 1, ItemClass, createdItems);
    if (position.y + 1 < game._mapSize.y) createItemAtPosition(position.x, position.y + 1, ItemClass, createdItems);
    return createdItems;
}

function createItemAtPosition(x: number, y: number, ItemClass: typeof Item, createdItems: Item[]) {
    for (let i = 0; i < game._items.length; i++) {
        if (game._items[i] instanceof ItemClass && game._items[i]._position.x == x && game._items[i]._position.y == y) return;
    }
    let createdItem = new ItemClass();
    createdItem._position.x = x;
    createdItem._position.y = y;
    createdItems.push(createdItem);
}

function isConditionInRange(range: number, condition: Function):boolean {
    for(let i = 0; i < game._items.length; i++){
        if (!(condition(game._items[i]))) continue;
        let Xdelta = Math.abs(game._items[i]._position.x - agent._position.x);
        let Ydelta = Math.abs(game._items[i]._position.y - agent._position.y);
        if (Xdelta + Ydelta <= range) return true;
    }
    return false;
}

function setRandomPosition(position: Position, maxX: number, maxY: number, notPos?: Position[]) {
    let availablePos: number[][] = [];
    for (let i = 0; i < maxX; i++) {
        for (let j = 0; j < maxY; j++) {
            if (typeof notPos !== 'undefined') {
                let found = false;
                for (let k = 0; k < notPos.length; k++) {
                    if (notPos[k].x == i && notPos[k].y == j) {
                        found = true;
                        break;
                    }
                }
                if (found) continue; 
            }
            availablePos.push([i, j]);
        }
    }
    let randomIndex = Math.floor(Math.random() * availablePos.length);
    position.x = availablePos[randomIndex][0];
    position.y = availablePos[randomIndex][1];
}

function wumpusMove(wumpus: Wumpus) {
    let pos: Position = wumpus._position;
    let freeMoves = [[pos.x + 1, pos.y], [pos.x - 1, pos.y], [pos.x, pos.y + 1], [pos.x, pos.y - 1]];
    for (let i = 0; i < game._items.length; i++) {
        let item = game._items[i];
        if (!item.isDeadly()) continue;
        let freeMovesLength = freeMoves.length;
        for (let j = 0; j < freeMovesLength; j++) {
            if (!freeMoves[j]) continue;
            if (item._position.x == freeMoves[j][0] && item._position.y == freeMoves[j][1]) {
                freeMoves.splice(j, 1);
                j--;
            } else if (freeMoves[j][0] < 0 || freeMoves[j][0] >= game._mapSize.x) {
                freeMoves.splice(j, 1);
                j--;
            } else if (freeMoves[j][1] < 0 || freeMoves[j][1] >= game._mapSize.y) {
                freeMoves.splice(j, 1);
                j--;
            }
        }
    }
    if (freeMoves.length > 0) {
        let randomIndex = Math.floor(Math.random() * freeMoves.length);
        pos.x = freeMoves[randomIndex][0];
        pos.y = freeMoves[randomIndex][1];
    }
    let gameItemsLength = game._items.length;
    for (let i = 0; i < gameItemsLength; i++) {
        if (game._items[i] instanceof Stench) {
            game._items.splice(i, 1);
            i--;
        }
    }
    game._items = game._items.concat(createItemsAround(pos, Stench));
}

const game = new Game();
game._mapSize.x = 4;
game._mapSize.y = 4;
game.newGame();

prompt.start();
function getInput(): void {
    prompt.get(['input'],
        function (err, result) {
            if (result.input == 'q') return;
            if (result.input == 'n') game.newGame();
            if (Object.values(EnumMoveDirection).includes(result.input)) {
                game.movePlayer(result.input);
            }
            getInput();
    });
}
getInput();