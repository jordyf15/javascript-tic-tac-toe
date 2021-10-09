const gameBoard = (function() {
    const _boardGrids = [null,null,null,
                        null,null,null,
                        null,null,null];

    function getBoardGrids() {
        return _boardGrids;
    }

    function markGrid(grid, mark){
        const gridIndex = grid-1;
        _boardGrids[gridIndex] = mark;
    }
    function checkLegalGrid(grid) {
        const gridIndex = grid-1;
        return _boardGrids[gridIndex] ? false : true;
    }
    function checkWin(){
        for(let i = 0; i<3; i++){
            if(_boardGrids[(i*3)] == _boardGrids[(i*3)+1] && 
            _boardGrids[(i*3)+1] == _boardGrids[(i*3)+2] && 
            _boardGrids[(i*3)] !== null) return true;
            if(_boardGrids[0+i] == _boardGrids[3+i] &&
                _boardGrids[3+i] == _boardGrids[6+i] &&
                _boardGrids[0+i] !== null) return true;
        }
        if(_boardGrids[0] == _boardGrids[4] && _boardGrids[4] == _boardGrids[8]
            &&_boardGrids[0] !== null) return true;
        if(_boardGrids[2] == _boardGrids[4] && _boardGrids[4] == _boardGrids[6]
            && _boardGrids[2] !== null) return true;
        return false;
    }

    return {markGrid, checkLegalGrid, checkWin, getBoardGrids};
})();

function PlayerFactory(name, marker) {

    function getMarker(){
        return marker;
    }
    function getName() {
        return name;
    }

    return{getMarker, getName}
}

const game = (function() {
    const _player1 = PlayerFactory('Player X', 'X');
    const _player2 = PlayerFactory('Player O', 'O');
    let _currentPlayer = _player1;

    function playerTurn(gridIndex) {
        const validMove = gameBoard.checkLegalGrid(gridIndex);
        if (validMove){
            gameBoard.markGrid(gridIndex, _currentPlayer.getMarker());
            _currentPlayer = _currentPlayer == _player1 ? _player2 : _player1;
            return _currentPlayer == _player1 ? _player2.getMarker() : _player1.getMarker();
        }
        return false;
    }

    function gameOver() {
        const gameOver = gameBoard.checkWin();
        return gameOver;
    }

    function getWinner(){
        return _currentPlayer == _player1 ? _player2.getName() : _player1.getName();
    }

    return {playerTurn, gameOver, getWinner}
})();

const displayController = (function() {
    const boardGrids = Array.from(document.getElementsByClassName('board-grids'));
    boardGrids.forEach((boardGrid) => {
        boardGrid.addEventListener('click', clickBoardGrid);
    });

    function clickBoardGrid() {
        const selectedGridIndex = getBoardGridIndex(this);
        const playerMark = game.playerTurn(selectedGridIndex);
        if (playerMark){
            markDomGrid(selectedGridIndex, playerMark);
            if(game.gameOver()) {
                const winner = game.getWinner();
                displayWinner(winner);
            }
        }
    }

    function displayWinner(winner) {
        const statusMsg = document.querySelector('#status-msg');
        statusMsg.textContent = `${winner} has won!`;
    }

    function getBoardGridIndex(clickedGrid){
        return parseInt(clickedGrid.id.split('-')[1]);
    }

    function markDomGrid(gridIndex, marker) {
        const selectedGrid = document.querySelector(`#grid-${gridIndex}`);
        selectedGrid.textContent = marker;
    }
})();
