# Report
## Function
### Implemented function using cycles
Function takes in x and b, and then multiplies the result with x\*b, b times.
```javascript
function mult_pow(x, b) {
    let result = 1;
    for (let i = 0; i < b; i++) result *= x*b;
    return result;
}
```
Full code with prompt:
```javascript
var prompt = require('prompt');

function mult_pow(x, b) {
    let result = 1;
    for (let i = 0; i < b; i++) result *= x*b;
    return result;
}

prompt.start();
prompt.get(['x', 'b'],
    function (err, result) {
        console.log('result: ', mult_pow(result.x,result.b));
});
```
### Test sample:
Input:
```javascript
prompt: x:  2
prompt: b:  4
```
Output:
```javascript
result:  4096
```
## Game
<img width="393" alt="Code_PYUbUCPsGT" src="https://github.com/XP20/course/assets/67698795/2cd8a04e-33e7-4b75-bfd0-60ab92211aba">

### Implemented the UML Diagram
### Implemented custom code for moving the agent
Handling console input:
```typescript
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
```
This calls a function that, upon receiving an input, calls the function again.
This allows for continuous input from the user.

Moving the player:
```typescript
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
```
This takes in the EnumMoveDirection and using a switch statement changes the position.
Math.min and Math.max is used here to not allow the player to move outside the map.

This is the movePlayer function which handles other game events:
```typescript
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
```
- This moves the player in the given direction.
- Then it sets the tile where the player is now to be shown.
- Then it moves wumpus.
- Then it checks if the player has died or won the game using a function as an argument for another function.
Here funcLose is the argument that returns the isDeadly property of an item.
It is passed to a function which checks if an item, where the player is, has that property:
```typescript
function isConditionInRange(range: number, condition: Function):boolean {
    for(let i = 0; i < game._items.length; i++){
        if (!(condition(game._items[i]))) continue;
        let Xdelta = Math.abs(game._items[i]._position.x - agent._position.x);
        let Ydelta = Math.abs(game._items[i]._position.y - agent._position.y);
        if (Xdelta + Ydelta <= range) return true;
    }
    return false;
}
```
This is also used for isStench() and isBreeze() functions.
### Console output
The console output was hardcoded with a 4x4 grid with 5 characters per tile.
Outputs ????? when a tile is unknown
Outputs a unique letter for each Item on a tile with definitions for the characters
```typescript
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
        if (this._items[i] instanceof Stench) char = 'S';
        if (this._items[i] instanceof Wind) char = 'B';
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

    console.log(this.isBreeze());
    if (this.isStench()) console.log('You feel a stench nearby!');
    if (this.isBreeze()) console.log('You feel a breeze nearby!');
}
```

### Implemented wumpus moving each turn
Made Wumpus move to nearby, non-deadly tiles each turn
It uses a for loop for checking deadly tiles and remove them from available moves.
It also updates stench for the new stench positions.
```typescript
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
```
- First it splices from freeMoves array all where the tile has a deadly item on it.
- Then it gets a random position from freeMoves if it exists and sets it.
- Then it updates the Stench around Wumpus.

## Other custom functions
### createItemAtPosition()
This creates an Item that is a subclass of Item at a given position
```typescript
function createItemAtPosition(x: number, y: number, ItemClass: typeof Item, createdItems: Item[]) {
    for (let i = 0; i < game._items.length; i++) {
        if (game._items[i] instanceof ItemClass && game._items[i]._position.x == x && game._items[i]._position.y == y) return;
    }
    let createdItem = new ItemClass();
    createdItem._position.x = x;
    createdItem._position.y = y;
    createdItems.push(createdItem);
}
```
### createItemsAround()
This creates a given subclass of an item all around an object using the previous function
```typescript
function createItemsAround(position: Position, ItemClass: typeof Item): Item[] {
    let createdItems: Item[] = [];
    createItemAtPosition(position.x, position.y, ItemClass, createdItems);
    if (position.x - 1 >= 0) createItemAtPosition(position.x - 1, position.y, ItemClass, createdItems);
    if (position.x + 1 < game._mapSize.x) createItemAtPosition(position.x + 1, position.y, ItemClass, createdItems);
    if (position.y - 1 >= 0) createItemAtPosition(position.x, position.y - 1, ItemClass, createdItems);
    if (position.y + 1 < game._mapSize.y) createItemAtPosition(position.x, position.y + 1, ItemClass, createdItems);
    return createdItems;
}
```

### setRandomPosition()
This sets an items poosition to a random position which is not one of the given notPos argument positions.
```typescript
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
```
