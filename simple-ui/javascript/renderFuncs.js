/**
 * Render the given maze into the mazeView css-grid by
 * generating grid-items and appending them to the
 * grid-container.
 *
 * @param {*} maze
 */
function renderMaze(curMaze) {
    const mv = $('#mazeView');
    mv.empty();

    // loop through the cells array to build and style the grid
    for (let row = 0; row < curMaze.cells.length; row++) {
        for (let col = 0; col < curMaze.cells[0].length; col++) {
            const cell = curMaze.cells[row][col];
            const cId = cell.pos.row + '-' + cell.pos.col;
            mv.append("<div id='" + cId + "'></div>");
            styleCellDiv(cell, $('#' + cId), {row: curMaze.startCell.row, col: curMaze.startCell.col});
        }
    }
    // mark the path
    markPath(curMaze, curMaze.cells[curMaze.startCell.row][curMaze.startCell.col], DIRS.NORTH);

    // and resize the grid (just in case)
    resizeGrid();
}

function styleCellDiv(cell, cDiv, pLoc) {
    if (!cell) {
        console.log('styleCell(cell, cDiv, pLoc) : WARNING - cell is undefined.');
        return;
    }

    const row = cell.pos.row;
    const col = cell.pos.col;

    cDiv.remove;

    // set the base classes (clearing any others)
    cDiv.attr('class', 'grid-item cell');

    // set exit classes
    if (!!(cell.exits & DIRS.NORTH) && !(cell.tags & CELL_TAGS.START)) cDiv.addClass('ceNorth');
    if (!!(cell.exits & DIRS.SOUTH) && !(cell.tags & CELL_TAGS.FINISH)) cDiv.addClass('ceSouth');
    if (!!(cell.exits & DIRS.EAST)) cDiv.addClass('ceEast');
    if (!!(cell.exits & DIRS.WEST)) cDiv.addClass('ceWest');

    // thicken outer walls
    if (!(cell.tags & CELL_TAGS.START) && row === 0) cDiv.addClass('cwNorth');
    if (!(cell.tags & CELL_TAGS.FINISH) && row === curMaze.cells.length - 1) cDiv.addClass('cwSouth');
    if (col === 0) cDiv.addClass('cwWest');
    if (col === curMaze.cells[0].length - 1) cDiv.addClass('cwEast');

    // set start cell class
    if (!!(cell.tags & CELL_TAGS.START)) {
        cDiv.addClass('cStart');
        cDiv.addClass('material-icons');
        cDiv.text('arrow_downward');
    }

    // set finish cell class
    if (!!(cell.tags & CELL_TAGS.FINISH)) {
        cDiv.addClass('cFinish');
        cDiv.addClass('material-icons');
        cDiv.text('arrow_downward');
    }

    // clear any other classes and set player
    if (row === pLoc.row && col === pLoc.col) {
        // console.log('pLoc: ' + pLoc.row + ', ' + pLoc.col);
        cDiv.removeClass('cPath material-icons');
        cDiv.addClass('player');
        cDiv.text('');
    }
}

/**
 * Dynamically resizes the mazeView css-grid based on the
 * dimentions of the maze being rendered.
 */
function resizeGrid() {
    const mv = $('#mazeView');
    console.log('Resize to mazeView to ' + mv.css('width') + 'x' + mv.css('height'));
    const rowCount = parseInt($(':root').css('--rows'));
    const colCount = parseInt($(':root').css('--cols'));
    const width = parseFloat(mv.css('width')) / colCount;
    const height = parseFloat(mv.css('height')) / rowCount;
    const newSize = width < height ? width.toString() + 'px ' : height.toString() + 'px ';

    // console.log('MV Height: ' + mv.css('height'));
    // console.log('MV Width: ' + mv.css('width'));
    // console.log('GI Height: ' + height);
    // console.log('GI Width: ' + width);
    // console.log('View Size: ' + newSize);

    // push new cell / grid sizes
    mv.css('grid-template-rows', newSize.repeat(rowCount));
    mv.css('grid-template-columns', newSize.repeat(colCount));

    // set the new cell-icon font size
    $(':root').css('--cellIconFontSize', height / 3 + 'px');
    // console.log('Icon Size: ' + $(':root').css('--cellIconFontSize'));

    // calculate and set wall and edge widths based on maze size
    $(':root').css('--wallWidth', Math.ceil(10 / colCount) + 'px');
    $(':root').css('--edgeWidth', Math.ceil(10 / colCount) * 2 + 'px');
    // console.log('Wall Width: ' + $(':root').css('--wallWidth'));
    // console.log('Edge Width: ' + $(':root').css('--edgeWidth'));
}

function markPath(maze, cell, fromDir) {
    const rows = maze.cells.length - 1;
    const cols = maze.cells[0].length - 1;
    const cPos = cell.pos;
    let cNext;
    let toIcon;
    let fromIcon;

    // follow the path all the way tot he finish
    if (!!(cell.tags & CELL_TAGS.FINISH)) {
        console.log('markPath() -> End of path reached.');
        return;
    }

    // console.log('Entered markPath() -> cPos: ' + cPos.row, cPos.col);
    for (var dirName in DIRS) {
        let pathFound = false;
        const dir = DIRS[dirName];
        if (dir > 0 && dir !== fromDir && !!(cell.exits & dir)) {
            // console.log('markPath() -> Checking for path in dir ' + dir);

            switch (dir) {
                case DIRS.NORTH: {
                    // don't continue of we're at the top of the maze
                    if (cPos.row > 0) {
                        // console.log('HIT ' + dirName);
                        cNext = maze.cells[cPos.row - 1][cPos.col];
                        if (!!(cNext.tags & CELL_TAGS.PATH)) {
                            toIcon = 'expand_less';
                            fromIcon = 'expand_more';
                            fromDir = DIRS.SOUTH;
                            pathFound = true;
                        }
                    }
                    break;
                }
                case DIRS.SOUTH: {
                    // don't continue of we're at the bottom of the maze
                    if (cPos.row < rows) {
                        // console.log('HIT ' + dirName);
                        cNext = maze.cells[cPos.row + 1][cPos.col];
                        if (!!(cNext.tags & CELL_TAGS.PATH)) {
                            toIcon = 'expand_more';
                            fromIcon = 'expand_less';
                            fromDir = DIRS.NORTH;
                            pathFound = true;
                        }
                    }
                    break;
                }
                case DIRS.EAST: {
                    // don't continue of we're at the right edge of the maze
                    if (cPos.col < cols) {
                        // console.log('HIT ' + dirName);
                        cNext = maze.cells[cPos.row][cPos.col + 1];
                        if (!!(cNext.tags & CELL_TAGS.PATH)) {
                            toIcon = 'chevron_right';
                            fromIcon = 'chevron_left';
                            fromDir = DIRS.WEST;
                            pathFound = true;
                        }
                    }
                    break;
                }
                case DIRS.WEST: {
                    // don't continue of we're at the left edge of the maze
                    if (cPos.col > 0) {
                        // console.log('HIT ' + dirName);
                        cNext = maze.cells[cPos.row][cPos.col - 1];
                        if (!!(cNext.tags & CELL_TAGS.PATH)) {
                            toIcon = 'chevron_left';
                            fromIcon = 'chevron_right';
                            fromDir = DIRS.EAST;
                            pathFound = true;
                        }
                    }
                    break;
                }
                default: {
                    console.log('markPath() -> Error: No path direction found.');
                }
            }

            // if we found the path, stop iterating
            if (pathFound) break;
        }
    }

    if (!cNext) {
        console.log('markPath() -> Error: cNext is not set.');
        return;
    }

    let cDiv = $('#' + cell.pos.row + '-' + cell.pos.col);
    let cNextDiv = $('#' + cNext.pos.row + '-' + cNext.pos.col);
    if (cNextDiv.text() !== fromIcon && !(cell.tags & CELL_TAGS.FINISH) && !(cell.tags & CELL_TAGS.START) && !cDiv.hasClass('player')) {
        // console.log('markPath(' + dirName + ') -> TAGGING cPos: ' + cDiv.attr('id'));
        cDiv.addClass('cPath material-icons');
        cDiv.text(toIcon);
    } // else {
    //     console.log('markPath(' + dirName + ') -> NOT TAGGING cPos: ' + cDiv.attr('id'));
    // }

    // follow the path...
    markPath(maze, cNext, fromDir);
}
