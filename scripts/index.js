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
    let _gameplayMode = null;

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

    function getCurrentPlayer(){
        return _currentPlayer.getName();
    }

    function setGameplayMode(gameplayMode) {
        _gameplayMode = gameplayMode;
    }

    function getGameplayMode(){
        return _gameplayMode;
    }

    return {playerTurn, gameOver, getWinner, getCurrentPlayer, setGameplayMode, getGameplayMode}
})();

const displayController = (function() {
    const boardGrids = Array.from(document.getElementsByClassName('board-grids'));
    boardGrids.forEach((boardGrid) => {
        boardGrid.addEventListener('click', clickBoardGrid);
    });
    displayTurn(game.getCurrentPlayer());
    displayChooseGameplayForm();

    function clickBoardGrid() {
        const selectedGridIndex = getBoardGridIndex(this);
        const playerMark = game.playerTurn(selectedGridIndex);
        if (playerMark){
            markDomGrid(selectedGridIndex, playerMark);
            if(game.gameOver()) {
                const winner = game.getWinner();
                displayWinner(winner);
                disableBoardGrids();
            }else{
                const currentPlayerName = game.getCurrentPlayer();
                displayTurn(currentPlayerName);
            }
        }
    }

    function displayWinner(winner) {
        const statusMsg = document.querySelector('#status-msg');
        statusMsg.textContent = `${winner} has won!`;
    }

    function displayTurn(currentPlayerName){
        const statusMsg = document.querySelector('#status-msg');
        statusMsg.textContent = `${currentPlayerName}'s turn`;
    }

    function getBoardGridIndex(clickedGrid){
        return parseInt(clickedGrid.id.split('-')[1]);
    }

    function markDomGrid(gridIndex, marker) {
        const selectedGrid = document.querySelector(`#grid-${gridIndex}`);
        selectedGrid.textContent = marker;
    }
    
    function disableBoardGrids(){
        boardGrids.forEach((boardGrid)=>{
            boardGrid.disabled = true;
        })
    }
    
    function enableBoardGrids(){
        boardGrids.forEach((boardGrid)=> {
            boardGrid.disabled = false;
        })
    }

    function displayChooseGameplayForm(){
        const main = document.querySelector('main');
        const chooseGameplayBg = document.createElement('div');
        chooseGameplayBg.id = 'choose-gameplay-bg';
        main.appendChild(chooseGameplayBg);

        const chooseGameplayForm = document.createElement('form');
        chooseGameplayForm.id = 'choose-gameplay-form';
        chooseGameplayBg.appendChild(chooseGameplayForm);

        const chooseGameplayHeading = document.createElement('h2');
        chooseGameplayHeading.textContent = 'Choose the gameplay';
        chooseGameplayForm.appendChild(chooseGameplayHeading);

        const vsAIRadio = document.createElement('input');
        vsAIRadio.className = 'gameplayRB';
        vsAIRadio.type = 'radio';
        vsAIRadio.name = 'gameplay';
        vsAIRadio.value = 'vsAI';
        vsAIRadio.id = 'vsAI';
        chooseGameplayForm.appendChild(vsAIRadio);

        const vsAILabel = document.createElement('label');
        vsAILabel.className = 'gameplay-lbl';
        vsAILabel.setAttribute('for', 'vsAI');
        vsAILabel.appendChild(renderPlayerIcon());
        vsAILabel.appendChild(renderVsIcon());
        vsAILabel.appendChild(renderAiIcon());
        chooseGameplayForm.appendChild(vsAILabel);
        
        const vsAIText = document.createElement('p');
        vsAIText.className = 'gameplay-desc';
        vsAIText.textContent = 'Play against a computer';
        chooseGameplayForm.appendChild(vsAIText);

        const vsPlayerRadio = document.createElement('input');
        vsPlayerRadio.className = 'gameplayRB';
        vsPlayerRadio.type = 'radio';
        vsPlayerRadio.name = 'gameplay';
        vsPlayerRadio.value = 'vsPlayer';
        vsPlayerRadio.id = 'vsPlayer';
        chooseGameplayForm.appendChild(vsPlayerRadio);

        const vsPlayerLabel = document.createElement('label');
        vsPlayerLabel.className = 'gameplay-lbl';
        vsPlayerLabel.setAttribute('for','vsPlayer');
        vsPlayerLabel.appendChild(renderPlayerIcon());
        vsPlayerLabel.appendChild(renderVsIcon());
        vsPlayerLabel.appendChild(renderPlayerIcon());
        chooseGameplayForm.appendChild(vsPlayerLabel);

        const vsPlayerText = document.createElement('p');
        vsPlayerText.className = 'gameplay-desc';
        vsPlayerText.textContent = 'Play against a computer';
        chooseGameplayForm.appendChild(vsPlayerText);

        const errorMsg = document.createElement('p');
        errorMsg.className = 'error-msg';
        chooseGameplayForm.appendChild(errorMsg);

        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.textContent = 'Confirm';
        submitButton.id = 'gameplay-form-button';
        submitButton.addEventListener('click', chooseGameplaySubmit);
        chooseGameplayForm.appendChild(submitButton);
    }

    function chooseGameplaySubmit(){
        const checkedRB = document.querySelector('input[name="gameplay"]:checked');
        if(checkedRB){
            game.setGameplayMode(checkedRB.value);
            const main = document.querySelector('main');
            const chooseGameplayBg = document.querySelector('#choose-gameplay-bg');
            main.removeChild(chooseGameplayBg);
        }else{
            const errorMsg = document.querySelector('#choose-gameplay-form .error-msg');
            errorMsg.textContent = "Please choose a gameplay";
        }
    }

    function renderAiIcon() {
        const robotIcon = document.createElement('i');
        robotIcon.classList.add('fas', 'fa-robot');
        return robotIcon;
    }

    function renderPlayerIcon() {
        const humanIcon = document.createElement('i');
        humanIcon.classList.add('fas', 'fa-user');
        return humanIcon;
    }

    function renderVsIcon() {
        const vsSpan = document.createElement('span');
        vsSpan.className='vs';
        vsSpan.textContent = 'VS';
        return vsSpan;
    }
})();
