/*globals createjs, alert, Image, document*/

/**
 * Mock-up function for bootstrap the engine
 * @author Miguelcldn
 */
function main() {
    new Engine("gameCanvas");
}

/**
 * Main engine of the game
 * @author Miguelcldn
 * @param   {[[Type]]} canvasID The ID of the canvas to darw in
 */
function Engine(canvasID) {
    
    var CELL_WIDTH = 40;
    var CELL_HEIGHT = 40;
    var LETTERS = "ABCDEFGHIJ";
    var GAME_MODES = {
        PREPARING: 1,
        ACTIVE: 2,
        PASSIVE: 3,
        SPECTATOR: 4
    };
    var SHIPS = {
        battleship : 4,
        carrier : 5,
        cruiser: 3,
        destroyer: 2,
        submarine : 3
    };

    var stage = null;
    var tables = {
        playerTable : {
            posX: 0,
            posY: 0,
            cells: {}
        },
        enemyTable : {
            posX: CELL_HEIGHT * 12,
            posY: 0,
            cells: {}
        }
    };
    
    var currentMode;
    var shipStates = {};

    /**
     * Construction code
     * @author Miguelcldn
     */
    function main() {
        stage = new createjs.Stage(canvasID);
        stage.enableMouseOver(10);
        stage.mouseMoveOutside = true; 
        
        setGameMode(GAME_MODES.PREPARING, stage);
    }

    /**
     * Draws a table and its labels
     * @author Miguelcldn
     * @param {object} table The enemys or players table
     */
    function drawTable(table) {
        
        var i = 0, j = 0, row, col;
        
        for(i = 0; i < 10; i++) {
            row = (i + 1) + '';
            col = LETTERS[i];
            //Numbers
            new CellLabel((i + 1) * CELL_WIDTH + CELL_WIDTH / 2 + table.posX, 0, CELL_HEIGHT, row, stage);
            //Letters
            new CellLabel(CELL_WIDTH / 2 + table.posX, (i + 1) * CELL_HEIGHT, CELL_HEIGHT, col, stage);
        }
        
        for(i = 1; i < 11; i++) {
            for(j = 1; j < 11; j++) {
                //Set cell name
                col = i + '';
                row = LETTERS[j - 1];
                
                if(!table.cells[row]) table.cells[row] = {};
                
                table.cells[row][col] = new Cell(
                    i, j,
                    i * CELL_WIDTH + table.posX,
                    j * CELL_HEIGHT + table.posY,
                    CELL_WIDTH,
                    CELL_HEIGHT,
                    row + col,
                    stage
                );
            }
        }
        
        update();
    }
    
    /**
     * Returns wether the user has put all the ships in the table or not
     * @author Miguelcldn
     * @returns {boolean} True if all the ships are in the table
     */
    function isReady() {
        var ready = true;
        
        for(var ship in shipStates) {
            if(!shipStates[ship].hasAssignedCells())
                ready = false;
        }
        
        return ready;
    }

    /**
     * Updates the screen
     * @author Miguelcldn
     */
    function update() {
        stage.update();
    }

    /**
     * Changes the game mode
     * @author Miguelcldn
     * @param {GAME_MODES}     newMode The new mode to set
     * @param {createjs.Stage} stage   The stage to update
     */
    function setGameMode(newMode, stage) {
        switch(newMode) {
            case GAME_MODES.PREPARING:
                
                enterPreparingMode();
                
                break;
            case GAME_MODES.ACTIVE:
                break;
            case GAME_MODES.PASSIVE:
                break;
            case GAME_MODES.SPECTATOR:
                break;
        }
        
        currentMode = newMode;
    }
    
    /**
     * Main code of the PREPARING mode
     * @author Miguelcldn
     */
    function enterPreparingMode() {
        drawTable(tables.playerTable);
        var shipY = 20;
        var dragging = null;

        //Draw the ships at the right of the table
        for(var ship in SHIPS) {
            var newShip = new Ship(ship, SHIPS[ship], stage, onPressMove, onDrop, tables.enemyTable.posX, shipY);
            shipStates[ship] = newShip;
            shipY += 100;
        }
        
        update();
        
        /**
         * Drag handler
         * @author Miguelcldn
         * @param {object} event Event of the drag
         */
        function onPressMove(event) {
            if(currentMode == GAME_MODES.PREPARING) {
                
                document.addEventListener('keydown', onKeyDown);
                
                dragging = event.ship;
                event.ship.releaseCells();
                
                event.target.x = event.stageX - 20;
                if(event.ship.pos === 'v') 
                    event.target.x = event.stageX + 60;
                
                event.target.y = event.stageY - event.target.getBounds().height;
                update();
            }
        }

        /**
         * Drop event handler
         * @author Miguelcldn
         * @param {object} event Event of the drop
         */
        function onDrop(event) {
            document.removeEventListener('keydown', onKeyDown);
            
            if(setShipOnCell(dragging, event.stageX, event.stageY)) {
            }
            else {
                dragging.resetPosition();
                update();
            }
            
            dragging = null;
        }
        
        /**
         * Temporal key down event to use when drawing
         * @author Miguelcldn
         * @param {Event} event default event
         */
        function onKeyDown(event) {
            if(dragging) {
                dragging.togglePosition();
                update();
            }
        }
        
        /**
         * Sets the dropped ship on a cell and checks everything
         * @author Miguelcldn
         * @param   {object}  ship The ship to set
         * @param   {number}  x    The stageX position
         * @param   {number}  y    The stageY position
         * @returns {boolean} True if set, false if it was in an invalid location
         */
        function setShipOnCell(ship, x, y) {
            //Look for cell below
            var originCell = null;
            
            var row = Math.floor((y + tables.playerTable.posY) / CELL_HEIGHT) - 1;
            var col = Math.floor((x + tables.playerTable.posX) / CELL_WIDTH);
            
            var rowLetter = LETTERS[row];
            var colLetter = col + '';
            
            originCell = tables.playerTable.cells[rowLetter][colLetter];
            
            //Check other cells and fill them and snap to them
            var i, nextCell;
            var cellsToFill = [originCell];
            
            if(ship.pos === 'v') { 
                
                if(row + ship.size > 11) { return false; }
                
                for(i = 0; i < ship.size; i++) {
                    nextCell = tables.playerTable.cells[LETTERS[row + i]];
                    
                    if(!nextCell) return false;
                    
                    nextCell = nextCell[colLetter];
                    
                    if(nextCell.isFilled()) {
                        return false;
                    }
                    else {
                        cellsToFill.push(nextCell);
                    }
                }
                
                ship.shipSprite.x = originCell.x + ship.shipSprite.getBounds().height / 1;
                ship.shipSprite.y = originCell.y;
            }
            
            if(ship.pos === 'h') {
                
                if(col + ship.size > 11) { return false; }
                
                for(i = 0; i < ship.size; i++) {
                    nextCell = tables.playerTable.cells[rowLetter];
                    
                    if(!nextCell) return false;
                    
                    nextCell = nextCell[col + i + ''];
                    
                    if(nextCell.isFilled()) {
                        return false;
                    }
                    else {
                        cellsToFill.push(nextCell);
                    }
                }
                
                ship.shipSprite.x = originCell.x;
                ship.shipSprite.y = originCell.y - ship.shipSprite.getBounds().height / 4;
            }
            
            //Fill the other cells
            ship.assignCells(cellsToFill);
            
            return true;
        }
    }
    
    main();
}

/**
 * Ship class
 * @author Miguelcldn
 * @param {string}         model       Ship's model
 * @param {number}         size        Size of the ship
 * @param {createjs.Stage} stage       The stage to update
 * @param {function}       onPressMove Drag handler
 * @param {function}       onDrop      Drop handler
 * @param {number}         x           stageX position
 * @param {number}         y           stageY position
 */
function Ship(model, size, stage, onPressMove, onDrop, x, y) {
    var image = new Image();
    
    var self = this;
    var assignedCells = null;
    
    this.shipSprite = null;
    this.originCell = null;
    this.pos = 'h';
    this.size = size;
        
    /**
     * Assign the cells to the ship, filling them
     * @author Miguelcldn
     * @param {Array} cells The cells to assign
     */
    this.assignCells = function(cells) {
        assignedCells = cells;
        
        for(var i = 0; i < assignedCells.length; i++) {
            assignedCells[i].fill();
        }
    };
    
    /**
     * Releases the cells and empties them
     * @author Miguelcldn
     */
    this.releaseCells = function() {
        if(assignedCells) {
            for(var i = 0; i < assignedCells.length; i++) {
                assignedCells[i].empty();
            }
            assignedCells = null;
        }
    };
    
    /**
     * Check if has assigned cells
     * @author Miguelcldn
     * @returns {boolean} True if has, false otherwise
     */
    this.hasAssignedCells = function() { return !!assignedCells; };
    
    /**
     * Toggles between Horizontal and vertical
     * @author Miguelcldn
     */
    this.togglePosition = function() {
        
        var degrees = (self.pos === 'h') ? 90 : 0;
        self.pos = (self.pos === 'h') ? 'v' : 'h';
        var x = self.shipSprite.x;
        var y = self.shipSprite.y;
        
        self.shipSprite.setTransform(0, 0, 1, 1, degrees);
        
        if(self.pos === 'v') x += 60;
        else x -= 20;
        
        self.shipSprite.x = x;
        self.shipSprite.y = y;
    };
    
    /**
     * Puts back the ship to its original position
     * @author Miguelcldn
     */
    this.resetPosition = function() {
        self.shipSprite.x = x;
        self.shipSprite.y = y;
        if(self.pos != 'h') self.togglePosition();
        self.releaseCells();
    };

    image.onload = function() {

        self.shipSprite = new createjs.Bitmap(image);
        self.shipSprite.x = x;
        self.shipSprite.y = y;

        var bounds = self.shipSprite.getBounds();

        self.shipSprite.addEventListener('pressmove', function(event) { event.ship = self; onPressMove(event); });
        self.shipSprite.addEventListener('pressup', onDrop);

        stage.addChild(self.shipSprite);
        stage.update();
    };
    image.src = 'assets/img/' + model + '.png';
}

/**
 * Represents a cell in the table
 * @author Miguelcldn
 * @param   {number}         tx    The Table position x
 * @param   {number}         ty    The Table position y
 * @param   {number}         x     The stageX position
 * @param   {number}         y     The stageY position
 * @param   {number}         w     The width of the cell
 * @param   {number}         h     The height of the cell
 * @param   {string}         name  The name of the cell (eg. "A1")
 * @param   {createjs.Stage} stage The stage to update
 */
function Cell(tx, ty, x, y, w, h, name, stage) {
    
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.name = name;
    this.tx = tx;
    this.ty = ty;
    
    var filled = false;
    
    /**
     * Marks the cell as filled
     * @author Miguelcldn
     */
    this.fill = function() { 
        filled = true;
        shape.alpha = 0.5;
    };
    
    /**
     * Empties the cell
     * @author Miguelcldn
     */
    this.empty = function() { 
        filled = false;
        shape.alpha = 1;
    };
    
    /**
     * Check if it's filled
     * @author Miguelcldn
     * @returns {boolean} True if filled, false otherwise
     */
    this.isFilled = function() { 
        return filled;
    };
    
    var shape = new createjs.Shape();
    shape.graphics.beginFill("#000").beginStroke("#FFF").drawRect(x, y, w, h);
    
    //Set the events
    shape.addEventListener('click', function(event) { alert("Clicked on " + name); });
    shape.addEventListener('mouseover', function(event) { shape.alpha = 0.5; stage.update(); });
    shape.addEventListener('mouseout', function(event) { if(!filled) { shape.alpha = 1; } stage.update(); });
    
    stage.addChild(shape);
}

/**
 * Represents a cell label, to help the user find the coordinates of a cell
 * @author Miguelcldn
 * @param {number}         x     stageX position
 * @param {number}         y     stageY position
 * @param {number}         h     Height of the label
 * @param {number}         text  Text to display
 * @param {createjs.Stage} stage The stage to update
 */
function CellLabel(x, y, h, text, stage) {
    var shape = new createjs.Text(text, h + "px Arial", "#000");
    shape.x = x;
    shape.y = y;
    shape.textBaseline = "top";
    shape.textAlign = "center";
    
    stage.addChild(shape);
}