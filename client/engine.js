/*globals createjs, alert*/

function main() {
    new Engine("gameCanvas");
}

function Engine(canvasID) {
    
    var CELL_WIDTH = 40;
    var CELL_HEIGHT = 40;
    var LETTERS = "ABCDEFGHIJ";

    var stage = null;
    var tables = {
        playerTable : {},
        enemyTable : {}
    };    

    var main = function() {
        stage = new createjs.Stage(canvasID);
        stage.enableMouseOver(10);
        
        DrawTable("playerTable", 0, 0);
        DrawTable("enemyTable", CELL_HEIGHT * 12, 0);
    };

    var DrawTable = function(tableName, originX, originY) {
        
        var i = 0, j = 0, row, col;
        
        for(i = 0; i < 10; i++) {
            row = (i + 1) + '';
            col = LETTERS[i];
            //Numbers
            new CellLabel((i + 1) * CELL_WIDTH + CELL_WIDTH / 2 + originX, 0, CELL_HEIGHT, row, stage);
            //Letters
            new CellLabel(CELL_WIDTH / 2 + originX, (i + 1) * CELL_HEIGHT, CELL_HEIGHT, col, stage);
        }
        
        for(i = 1; i < 11; i++) {
            for(j = 1; j < 11; j++) {
                //Set cell name
                col = i + '';
                row = LETTERS[j - 1];
                
                tables[tableName] = {};
                tables[tableName][row] = {};
                
                tables[tableName][row][col] = new Cell(
                    i * CELL_WIDTH + originX,
                    j * CELL_HEIGHT + originY,
                    CELL_WIDTH,
                    CELL_HEIGHT,
                    row + col,
                    stage
                );
            }
        }
        
        update();
    };

    var update = function() {
        stage.update();
    };
    
    main();
}

function Cell(x, y, w, h, name, stage) {
    
    var shape = new createjs.Shape();
    shape.graphics.beginFill("#000").beginStroke("#FFF").drawRect(x, y, w, h);
    
    //Set the events
    shape.addEventListener('click', function(event) { alert("Clicked on " + name); });
    shape.addEventListener('mouseover', function(event) { shape.alpha = 0.5; stage.update(); });
    shape.addEventListener('mouseout', function(event) { shape.alpha = 1; stage.update(); });
    
    stage.addChild(shape);
}

function CellLabel(x, y, h, text, stage) {
    var shape = new createjs.Text(text, h + "px Arial", "#000");
    shape.x = x;
    shape.y = y;
    shape.textBaseline = "top";
    shape.textAlign = "center";
    
    stage.addChild(shape);
}


/*
    IN are functions you call to the engine,
    receiveAttack(position: string): boolean //Function to call when user is attacked, where position is a table position such as "F3". Returns `true` if attack hit and `false` otherwise.
 */
window.receiveAttack = function(position){
    //@TODO remove / return to test only
    return Math.random() >= 0.5;

    $.ajax({
        url: "@TODO endpoint for attack",
        method: "POST",
        data: {pos:position},
        beforeSend: function( xhr ) {
            //something
        }
    }).done(function( data ) {
        return data;
    });
}
/*
 yourTurn(): void //Function to call when it's the players turn, to enable user interaction
 */
window.yourTurn = function(){
    //@TODO remove / return to test only
    return Math.random() >= 0.5;

    $.ajax({
        url: "@TODO endpoint for checking turn",
        method: "POST",
        data: {pos:position},
        beforeSend: function( xhr ) {
            //something
        }
    }).done(function( data ) {
        return data;
    });
}

/*
 `endGame(didWin: boolean)`: void //Function to call when game is over, and `didWin` tells if the current player won
 */
window.endGame = function(didWin){
    //@TODO remove / return to test only
    return Math.random() >= 0.5;

    $.ajax({
        url: "@TODO endpoint for checking which use won",
        method: "POST",
        data: {pos:position},
        beforeSend: function( xhr ) {
            //something
        }
    }).done(function( data ) {
        return data;
    });
}

/*
    OUT are functions I will call and you must write its code
 `attack(position: string): void` //Function that will be called when user attacks a position

 */
window.attack = function(position){

}

/*
 `turnEnded(): void` //Function that will be called when the user ends its turn and will wait for enemy's turn to end
 */
window.turnEnded = function(){

}

/*
    `lookForMatch(board: BoardData): void` //Function that will be called when the user arranged his board
 */
window.lookForMatch = function(board){

}




























