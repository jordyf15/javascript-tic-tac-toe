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
            _boardGrids[(i*3)+1] == _boardGrids[(i*3)+2]) return true;
            if(_boardGrids[0+i] == _boardGrids[3+i] &&
                _boardGrids[3+i] == _boardGrids[6+i]) return true;
        }
        if(_boardGrids[0] == _boardGrids[4] && _boardGrids[4] == _boardGrids[8]) return true;
        if(_boardGrids[2] == _boardGrids[4] && _boardGrids[4] == _boardGrids[6]) return true;
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
        gameBoard.markGrid(gridIndex, _currentPlayer.getMarker());
        _currentPlayer = _currentPlayer == _player1 ? _player2 : _player1;
        return _currentPlayer == _player1 ? _player2.getMarker() : _player1.getMarker();
    }

    return {playerTurn}
})();



