/*globals createjs, alert, Image, document, window, console*/

/**
 * Mock-up function for bootstrap the engine
 * @author Miguelcldn
 */
function main() {
	window.engine = new Engine("gameCanvas");
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
		battleship: 4,
		carrier: 5,
		cruiser: 3,
		destroyer: 2,
		submarine: 3
	};
	var self = this;

	var stage = null;
	var tables = {
		playerTable: {
			posX: 0,
			posY: 0,
			cells: {},
			hitPoints: [],
			labels: []
		},
		enemyTable: {
			posX: CELL_HEIGHT * 12,
			posY: 0,
			cells: {},
			hitPoints: [],
			labels: []
		}
	};

	var currentMode;
    var captionManager = null;
	var shipStates = {};
	var assets = new createjs.LoadQueue(true);
	assets.installPlugin(createjs.Sound);
	assets.loadManifest("assets/manifest.json");
	assets.on("complete", main, this);

	//*********** VIRTUAL FUNCTIONS ***********************************************+**

	/**
	 * Function that will be called when the user has put all his ships on board
	 * @author Miguelcldn
	 * @param {object} boardData A list of every ship, its position and location
	 */
	this.isReady = function (boardData) {
		console.log("isReady() is not implemented.");
	};

	/**
	 * Function that will be called when the user sends an attack order
	 * @author Miguelcldn
	 * @param {string} position The target position (e.g. "A1")
	 */
	this.attack = function (position) {
		console.log("attack() is not implemented.");
	};

	//**************** PUBLIC FUNCTIONS ++++++++++++++++++++++++++++++++++++++++

	/**
	 * Converts a position name to Array locations, eg "A1" to [0, 0]
	 * @author Miguelcldn
	 * @param   {string} position Position name
	 * @returns {Array}  [row, col]
	 */
	this.toArrayLocations = function (position) {
		return [
			LETTERS.indexOf(position[0]),
			parseInt(position[1]) - 1
		];
	};

	/**
	 * Converts an array location to a position name, eg [0, 0] to "A1"
	 * @author Miguelcldn
	 * @param   {number} row The row value
	 * @param   {number} col The collumn valu
	 * @returns {string} The position name
	 */
	this.toName = function (row, col) {
		var rowL = LETTERS[row];
		var colL = (colL + 1) + '';

		return rowL + colL;
	};
    
    /**
     * Function to call when a match is found
     * @author Miguelcldn
     */
    this.matchFound = function() {
        createjs.Sound.play("game_found");
    };

	/**
	 * Function to call when user is looking for matchmaking, renders the enemy table
	 * @author Miguelcldn
	 */
	this.prepareToPlay = function () {
		setGameMode(GAME_MODES.PASSIVE);
	};

	/**
	 * Function to call when the user received an attack, for drawing on his table
	 * @author Miguelcldn
	 * @param {Array} position Position of the hit [row, col]
	 */
	this.receiveAttack = function (position) {
        var pos = self.toName(position[0], position[1]);
        
		var cell = tables.playerTable.cells[pos[0]][pos[1]];
		var hitPoint = new HitPoint(cell, CELL_WIDTH / 2, stage);

		tables.playerTable.hitPoints.push(hitPoint);
        
        var hit = cell.isFilled();

		hitPoint.confirmHit(hit);
        
        if (hit) {
            createjs.Sound.play("hit");
        }
        else {
            createjs.Sound.play("no_hit");
        }


	};

	/**
	 * Function to call to activate Active mode
	 * @author Miguelcldn
	 */
	this.yourTurn = function () {
		setGameMode(GAME_MODES.ACTIVE);
	};

	/**
	 * Function to call when there is confirmation if the attack was successful or not
	 * @author Miguelcldn
	 * @param {Array}   position Position of the cell [row, col]
	 * @param {boolean} result   True if it hit, false otherwise
	 */
	this.confirmAttack = function (position, result) {
        
        var pos = self.toName(position[0], position[1]);
		var hitpoints = tables.enemyTable.hitPoints;

		for (var i = 0; i < hitpoints.length; i++) {
			if (hitpoints[i].getCellName() === pos) {
				hitpoints[i].confirmHit(result);

				if (result) {
					createjs.Sound.play("hit");
				}
				else {
					createjs.Sound.play("no_hit");
				}
			}
		}
	};
    
    this.endGame = function(won) {
        captionManager.gameOverMessage(won, document.getElementById(canvasID), function() { setGameMode(GAME_MODES.PREPARING); });
    };

	//*********************** PRIVATE FUNCTIONS **********************

	/**
	 * Construction code
	 * @author Miguelcldn
	 */
	function main() {
		stage = new createjs.Stage(canvasID);
		stage.enableMouseOver(10);
		stage.mouseMoveOutside = true;
        captionManager = new CaptionManager(stage);

        createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener('tick', stage);

		setGameMode(GAME_MODES.PREPARING);
	}

	/**
	 * Draws a table and its labels
	 * @author Miguelcldn
	 * @param {object} table The enemys or players table
	 */
	function drawTable(table) {

		var i = 0, j = 0, row, col;

		for (i = 0; i < 10; i++) {
			row = (i + 1) + '';
			col = LETTERS[i];
			//Numbers
			table.labels.push(new CellLabel((i + 1) * CELL_WIDTH + CELL_WIDTH / 2 + table.posX, 0, CELL_HEIGHT, row, stage));
			//Letters
			table.labels.push(new CellLabel(CELL_WIDTH / 2 + table.posX, (i + 1) * CELL_HEIGHT, CELL_HEIGHT, col, stage));
		}

		for (i = 1; i < 11; i++) {
			for (j = 1; j < 11; j++) {
				//Set cell name
				col = i + '';
				row = LETTERS[j - 1];

				if (!table.cells[row]) table.cells[row] = {};

				//Create the cell
				table.cells[row][col] = new Cell(
					i - 1, j - 1,
					i * CELL_WIDTH + table.posX,
					j * CELL_HEIGHT + table.posY,
					CELL_WIDTH,
					CELL_HEIGHT,
					row + col,
					onCellClick,
					table,
					stage
				);
			}
		}


	}

	/**
	 * Event to be triggered when the user clicks a cell
	 * @author Miguelcldn
	 * @param {Event} event Default click event
	 */
	function onCellClick(event) {
		if (currentMode === GAME_MODES.ACTIVE) {
			var cell = event.cell;
			var table = tables.enemyTable;

			if (cell.getParentTable() === table) {
				var repeated = false;

				for (var i = 0; i < table.hitPoints.length; i++) {
					if (table.hitPoints[i].getCellName() === cell.name) repeated = true;
				}

				if (!repeated) {
					tables.enemyTable.hitPoints.push(new HitPoint(cell, CELL_WIDTH / 2, stage));

					self.attack(self.toArrayLocations(cell.name));
				}
			}

			setGameMode(GAME_MODES.PASSIVE);
		}
	}

	/**
	 * Erases a table
	 * @author Miguelcldn
	 * @param {object} table Table to remove
	 */
	function removeTable(table) {
		var i, j;

		for (i = 0; i < table.labels.length; i++) {
			table.labels[i].erase();
		}
		table.labels = [];

		for (i = 0; i < table.hitPoints.length; i++) {
			table.hitPoints[i].erase();
		}
		table.hitPoints = [];

		for (i in table.cells) {
			for (j in table.cells[i]) {
				table.cells[i][j].erase();
			}
		}
		table.cells = {};


	}

	/**
	 * Changes the game mode
	 * @author Miguelcldn
	 * @param {GAME_MODES}     newMode The new mode to set
	 * @param {createjs.Stage} stage   The stage to update
	 */
	function setGameMode(newMode) {
		switch (newMode) {
			case GAME_MODES.PREPARING:

				//if there is enemy table, remove it
				if (tables.enemyTable.cells.A) {
					removeTable(tables.enemyTable);
				}
                
                //Clear hitpoins
                tables.playerTable.hitPoints.forEach(function(hp) { hp.erase(); });

				enterPreparingMode();

				break;
			case GAME_MODES.ACTIVE:
                
                if(currentMode === GAME_MODES.PASSIVE) {
                    captionManager.turnMessage("Your turn!");
                }
                
				break;
			case GAME_MODES.PASSIVE:

				//If no enemy table is rendered, show it
				if (!tables.enemyTable.cells.A) {
					drawTable(tables.enemyTable);
				}
                
                if(currentMode === GAME_MODES.ACTIVE) {
                    captionManager.turnMessage("Enemy's turn!");
                }

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
        
        var dragging = null;
        
        if(!tables.playerTable.cells.A) {
            
            drawTable(tables.playerTable);
            var shipY = 20;

            //Draw the ships at the right of the table
            for (var ship in SHIPS) {
                var newShip = new Ship(ship, SHIPS[ship], stage, onPressMove, onDrop, tables.enemyTable.posX, shipY);
                shipStates[ship] = newShip;
                shipY += 100;
            }
        }
        
        checkShips();



		/**
		 * Drag handler
		 * @author Miguelcldn
		 * @param {object} event Event of the drag
		 */
		function onPressMove(event) {
			if (currentMode == GAME_MODES.PREPARING) {

				document.addEventListener('keydown', onKeyDown);

				dragging = event.ship;
				event.ship.releaseCells();

				event.target.x = event.stageX - 20;
				if (event.ship.pos === 'v')
					event.target.x = event.stageX + 60;

				event.target.y = event.stageY - event.target.getBounds().height;

			}
		}

		/**
		 * Drop event handler
		 * @author Miguelcldn
		 * @param {object} event Event of the drop
		 */
		function onDrop(event) {
			if (currentMode === GAME_MODES.PREPARING) {

				document.removeEventListener('keydown', onKeyDown);

				if (setShipOnCell(dragging, event.stageX, event.stageY)) {
					if (checkShips()) {

					}
				}
				else {
					dragging.resetPosition();

				}

				dragging = null;
			}
		}

		/**
		 * Temporal key down event to use when drawing
		 * @author Miguelcldn
		 * @param {Event} event default event
		 */
		function onKeyDown(event) {
			if (currentMode === GAME_MODES.PREPARING) {
				if (dragging) {
					dragging.togglePosition();

				}
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

			if (ship.pos === 'v') {

				if (row + ship.size > 11) { return false; }

				for (i = 0; i < ship.size; i++) {
					nextCell = tables.playerTable.cells[LETTERS[row + i]];

					if (!nextCell) return false;

					nextCell = nextCell[colLetter];

					if (nextCell.isFilled()) {
						return false;
					}
					else {
						cellsToFill.push(nextCell);
					}
				}

				ship.shipSprite.x = originCell.x + ship.shipSprite.getBounds().height / 1;
				ship.shipSprite.y = originCell.y;
			}

			if (ship.pos === 'h') {

				if (col + ship.size > 11) { return false; }

				for (i = 0; i < ship.size; i++) {
					nextCell = tables.playerTable.cells[rowLetter];

					if (!nextCell) return false;

					nextCell = nextCell[col + i + ''];

					if (nextCell.isFilled()) {
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
			ship.originCell = originCell;
			ship.assignCells(cellsToFill);

			return true;
		}


		function checkShips() {

			var ready = true;
			var boardData = {};

			for (var ship in shipStates) {

				var shipState = shipStates[ship];

				if (!shipState.hasAssignedCells()) {
					ready = false;
					break;
				}

				boardData[ship] = {
					x: shipState.originCell.tx,
					y: shipState.originCell.ty,
					pos: shipState.pos
				};
			}

			if (ready) {
				self.isReady(boardData);
			}
		}
	}
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
	this.assignCells = function (cells) {
		assignedCells = cells;

		for (var i = 0; i < assignedCells.length; i++) {
			assignedCells[i].fill();
		}
	};

	/**
	 * Releases the cells and empties them
	 * @author Miguelcldn
	 */
	this.releaseCells = function () {
		if (assignedCells) {
			for (var i = 0; i < assignedCells.length; i++) {
				assignedCells[i].empty();
			}
			assignedCells = null;
			self.originCell = null;
		}
	};

	/**
	 * Check if has assigned cells
	 * @author Miguelcldn
	 * @returns {boolean} True if has, false otherwise
	 */
	this.hasAssignedCells = function () { return !!assignedCells; };

	/**
	 * Toggles between Horizontal and vertical
	 * @author Miguelcldn
	 */
	this.togglePosition = function () {

		var degrees = (self.pos === 'h') ? 90 : 0;
		self.pos = (self.pos === 'h') ? 'v' : 'h';
		var x = self.shipSprite.x;
		var y = self.shipSprite.y;

		self.shipSprite.setTransform(0, 0, 1, 1, degrees);

		if (self.pos === 'v') x += 60;
		else x -= 20;

		self.shipSprite.x = x;
		self.shipSprite.y = y;
	};

	/**
	 * Puts back the ship to its original position
	 * @author Miguelcldn
	 */
	this.resetPosition = function () {
		self.shipSprite.x = x;
		self.shipSprite.y = y;
		if (self.pos != 'h') self.togglePosition();
		self.releaseCells();
	};

	image.onload = function () {

		self.shipSprite = new createjs.Bitmap(image);
        self.shipSprite.alpha = 0;
		self.shipSprite.x = x;
		self.shipSprite.y = y;
        
        createjs.Tween.get(self.shipSprite)
        .to({alpha: 1}, 1000);

		var bounds = self.shipSprite.getBounds();
		//self.shipSprite.hitArea = (new createjs.Shape()).graphics.beginFill("#000").drawRect(0, 0, bounds.width, bounds.height);

		self.shipSprite.addEventListener('pressmove', function (event) { event.ship = self; onPressMove(event); });
		self.shipSprite.addEventListener('pressup', onDrop);

		stage.addChild(self.shipSprite);

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
function Cell(tx, ty, x, y, w, h, name, onClick, table, stage) {

	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.name = name;
	this.tx = tx;
	this.ty = ty;

	var self = this;

	var filled = false;

	/**
	 * Gets the referece of the table where this cell belongs
	 * @author Miguelcldn
	 * @returns {object} The parent table
	 */
	this.getParentTable = function () {
		return table;
	};

	/**
	 * Marks the cell as filled
	 * @author Miguelcldn
	 */
	this.fill = function () {
		filled = true;
		shape.alpha = 0.5;
	};

	/**
	 * Empties the cell
	 * @author Miguelcldn
	 */
	this.empty = function () {
		filled = false;
		shape.alpha = 1;
	};

	/**
	 * Check if it's filled
	 * @author Miguelcldn
	 * @returns {boolean} True if filled, false otherwise
	 */
	this.isFilled = function () {
		return filled;
	};

	/**
	 * Erases the cell
	 * @author Miguelcldn
	 */
	this.erase = function () {
        createjs.Tween.get(shape)
        .to({alpha: 0}, 1000)
        .call(function() {stage.removeChild(shape);});
	};

	var shape = new createjs.Shape();
    shape.alpha = 0;
	shape.graphics.beginFill("#000").beginStroke("#FFF").drawRect(x, y, w, h);
    createjs.Tween.get(shape)
    .to({alpha: 1}, 1000);

	//Set the events
	shape.addEventListener('click', function (event) { event.cell = self; onClick(event); });
	shape.addEventListener('mouseover', function (event) { shape.alpha = 0.5; });
	shape.addEventListener('mouseout', function (event) { if (!filled) { shape.alpha = 1; } });

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
    shape.alpha = 0;
	shape.x = x;
	shape.y = y;
	shape.textBaseline = "top";
	shape.textAlign = "center";
    createjs.Tween.get(shape)
    .to({alpha: 1}, 1000);

	stage.addChild(shape);

	/**
	 * Removes the label
	 * @author Miguelcldn
	 */
	this.erase = function () {
		createjs.Tween.get(shape)
        .to({alpha: 0}, 1000)
        .call(function() {stage.removeChild(shape);});
	};
}


/**
 * Represents a place where the user or enemy has attacked
 * @author Miguelcldn
 * @param {object}         cell  The related cell of the attack
 * @param {number}         r     The radius of the mark
 * @param {createjs.Stage} stage The stage to update
 */
function HitPoint(cell, r, stage) {

	var self = this;
	var confirmed = false;
	var hit = false;

	var shape = new createjs.Shape();
    shape.alpha = 0;
	shape.graphics.beginFill("white").drawCircle(0, 0, r);
    shape.x = cell.x + r;
    shape.y = cell.y + r;
    shape.scaleX = 2;
    shape.scaleY = 2;
	stage.addChild(shape);
    
    createjs.Tween.get(shape)
    .to({alpha: 1, scaleX: 1, scaleY: 1}, 1000);

	/**
	 * Gets the related cell's name
	 * @author Miguelcldn
	 * @returns {string} The name of the related cell
	 */
	this.getCellName = function () {
		return cell.name;
	};

	/**
	 * Changes the color of the mark depending if hit or no hit
	 * @author Miguelcldn
	 * @param {boolean} wasHit True if the attack made damage to a ship
	 */
	this.confirmHit = function (wasHit) {

		var color = '';
		stage.removeChild(shape);

		if (wasHit) {
			color = 'red';
		}
		else {
			color = 'blue';
		}

		shape = new createjs.Shape();
		shape.graphics.beginFill(color).drawCircle(0, 0, r);
        shape.x = cell.x + r;
        shape.y = cell.y + r;
		stage.addChild(shape);
        
        createjs.Tween.get(shape)
        .to({scaleX: 1.5, scaleY: 1.5}, 500)
        .wait(50)
        .to({scaleX: 1, scaleY: 1}, 500);
        
		hit = wasHit;
		confirmed = true;
	};

	/**
	 * Removes the mark from the board
	 * @author Miguelcldn
	 */
	this.erase = function () {
        createjs.Tween.get(shape)
        .to({alpha: 0, scaleX: 0.1, scaleY: 0.1}, 1000)
        .call(function() {
            stage.removeChild(shape);
            shape = null;
        });
	};

}

/**
 * Dedicated to draw and control text on the screen
 * @author Miguelcldn
 * @param {createjs.Stage} stage    The stage to work on
 * @param {function}       callback Callback for when the campios disappears
 */
function CaptionManager(stage, callback) {
    
    var self = this;
    
    this.turnMessage = function(text, callback) {
        var caption = new createjs.Text(text, "bold italic 48px Arial", "#ffd700");
        caption.alpha = 0;
        caption.x = 0;
        caption.y = stage.getBounds().height / 2;
        caption.align = "center";
        var middle = stage.getBounds().width / 2;
        stage.addChild(caption);
        
        createjs.Tween.get(caption)
        .to({x: middle, alpha: 1}, 1000)
        .wait(500)
        .to({x: stage.getBounds().width, alpha: 0}, 1000)
        .call(destroy, [caption])
        .call(function() { if(callback) callback(); });
    };
    
    this.gameOverMessage = function(win, canvas, clickEvent) {
        
        var text = (win) ? "You win!" : "You loose";
        var color = (win) ? "#ffd700" : "#ff3333";
        
        var caption = new createjs.Text(text, "bold italic 48px Arial", color);
        caption.alpha = 0;
        caption.x = stage.getBounds().width / 2;
        caption.y = stage.getBounds().height / 2;
        caption.align = "center";
        stage.addChild(caption);
        
        canvas.addEventListener("click", function(event) {
            createjs.Tween.removeTweens(caption);
            destroy(caption);
            if(clickEvent) clickEvent(event);
        });
        
        createjs.Tween.get(caption)
        .to({alpha: 1}, 500);
        
        createjs.Tween.get(caption, {loop: true})
        .to({scaleX: 1.5, scaleY: 1.5}, 1000)
        .to({scaleX: 1.0, scaleY: 1.0}, 1000);
    };
    
    function destroy(element) {
        stage.removeChild(element);
        element = null;
    }
    
}
