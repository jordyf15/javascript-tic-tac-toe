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

    function checkDraw() {
        const emptyGrid = _boardGrids.filter((boardGrid)=>boardGrid===null);
        return emptyGrid.length === 0 ? true : false;
    }

    return {markGrid, checkLegalGrid, checkWin, getBoardGrids, checkDraw};
})();

function PlayerFactory(name, marker, type) {

    function getMarker(){
        return marker;
    }
    function getName() {
        return name;
    }

    function getType() {
        return type;
    }

    return{getMarker, getName, getType}
}

const AILogic = (function(){
    function getAllValidMoves() {
        console.log(gameBoard.getBoardGrids());
        const emptyGrids = [1,2,3,4,5,6,7,8,9].filter((idx)=>{
            return gameBoard.getBoardGrids()[idx-1] === null;
        })
        return emptyGrids;
    } 
    function randomMove(){
        const validGrids = getAllValidMoves();
        const randomMove = validGrids[Math.floor(Math.random() * validGrids.length)];
        return randomMove;
    }
    return {randomMove}
})();

const game = (function() {
    let _gameplayMode = null;
    let _player1 = null;
    let _player2 = null;
    let _currentPlayer = null;
    
    function playerTurn(gridIndex) {
        const validMove = gameBoard.checkLegalGrid(gridIndex);
        if (validMove){
            gameBoard.markGrid(gridIndex, _currentPlayer.getMarker());
            _currentPlayer = _currentPlayer == _player1 ? _player2 : _player1;
            return _currentPlayer == _player1 ? _player2.getMarker() : _player1.getMarker();
        }
        return false;
    }

    function checkNextPlayerAI(){
        if(_currentPlayer.getType() === 'AI'){
            const selectedGridIndex = AILogic.randomMove();
            const AIMarker = _currentPlayer.getMarker();
            gameBoard.markGrid(selectedGridIndex, AIMarker);
            _currentPlayer = _currentPlayer == _player1 ? _player2 : _player1;
            return {selectedGridIndex, AIMarker}
        }
    }

    function gameOver() {
        if(gameBoard.checkWin()){
            return 'win';
        }else if(gameBoard.checkDraw()){
            return 'draw';
        }else{
            return 'continue';
        }
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

    function setSecondPlayer(name, marker, type) {
        _player2 = PlayerFactory(name, marker, type);
    }

    function setFirstPlayer(name, marker, type) {
        _player1 = PlayerFactory(name, marker, type);
    }

    function getFirstPlayer() {
        return _player1;
    }

    function getSecondPlayer() {
        return _player2;
    }

    function setStarterPlayer() {
        console.log(_player1);
        _currentPlayer = _player1;
    }

    return {playerTurn, gameOver, getWinner, getCurrentPlayer, setGameplayMode, getGameplayMode, 
        setFirstPlayer, setSecondPlayer, getFirstPlayer, getSecondPlayer, setStarterPlayer,
        checkNextPlayerAI}
})();

const displayController = (function() {
    const boardGrids = Array.from(document.getElementsByClassName('board-grids'));
    boardGrids.forEach((boardGrid) => {
        boardGrid.addEventListener('click', clickBoardGrid);
    });
    disableBoardGrids();
    
    const startButton = document.querySelector('#start-button');
    startButton.addEventListener('click', startGame);

    function startGame(){
        displayChooseGameplayForm();
        enableBoardGrids();
    }

    function preparePlayers() {
        if(game.getGameplayMode() === 'vsAI' && !game.getSecondPlayer()){
            game.setSecondPlayer('computer', 'O', 'AI');
        }
        if(!game.getSecondPlayer() || !game.getFirstPlayer()){
            displayNameForm();
        }else{
            game.setStarterPlayer();
            const currentPlayerName = game.getCurrentPlayer();
            displayTurn(currentPlayerName);
        }
    }

    function clickBoardGrid() {
        const selectedGridIndex = getBoardGridIndex(this);
        const playerMark = game.playerTurn(selectedGridIndex);
        if (playerMark){
            markDomGrid(selectedGridIndex, playerMark);
            const gameStatus = game.gameOver();
            if(gameStatus !== 'continue') {
                if(gameStatus === 'win'){
                    const winner = game.getWinner();
                    displayWinner(winner);
                }else{
                    displayDraw();
                }
                disableBoardGrids();
            }else{
                const currentPlayerName = game.getCurrentPlayer();
                displayTurn(currentPlayerName);
                const AIResult = game.checkNextPlayerAI();
                if (AIResult) AIMovement(AIResult);
            }
        }
    }

    function AIMovement(AIResult){
        disableBoardGrids();
        setTimeout(()=>{
            markDomGrid(AIResult.selectedGridIndex, AIResult.AIMarker);
            const currentPlayerName = game.getCurrentPlayer();
            displayTurn(currentPlayerName);
            enableBoardGrids();
        }, 500);    
    }

    function displayWinner(winner) {
        const statusMsg = document.querySelector('#status-msg');
        statusMsg.textContent = `${winner} has won!`;
    }

    function displayDraw(){
        const statusMsg = document.querySelector('#status-msg');
        statusMsg.textContent = 'It\'s a draw';
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
            preparePlayers();
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

    function displayNameForm() {
        const main = document.querySelector('main');
        const formBg = document.createElement('div');
        formBg.id = 'name-form-bg';
        main.appendChild(formBg);

        const nameForm = document.createElement('form');
        nameForm.id = 'name-form';
        formBg.appendChild(nameForm);

        const formTitle = document.createElement('h2');
        let formTitleText = 'Insert ';
        if(game.getGameplayMode() == 'vsAI'){
            formTitleText+= 'your player name';
        }else{
            if(game.getFirstPlayer() === null){
                formTitleText+= 'first player name';
            }else{
                formTitleText+= 'second player name';
            }
        }
        formTitle.textContent = formTitleText;
        formTitle.id = 'name-form-title';
        nameForm.appendChild(formTitle);

        const nameInput = document.createElement('input');
        nameInput.required = true;
        nameInput.type = 'text';
        nameInput.id = 'input-name';
        nameInput.placeholder = 'Insert your name here';
        nameForm.appendChild(nameInput);

        const alertMsg = document.createElement('p');
        alertMsg.className = 'error-msg';
        nameForm.appendChild(alertMsg);

        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.textContent = 'Confirm';
        submitButton.id = 'name-form-button';
        submitButton.addEventListener('click', insertNameSubmit);

        nameForm.appendChild(submitButton);
    }

    function insertNameSubmit() {
        const playerName = document.querySelector('#input-name').value;
        if(playerName.length>0){
            const main = document.querySelector('main');
            const formBg = document.querySelector('#name-form-bg');
            main.removeChild(formBg);
            if(!game.getFirstPlayer()){
                game.setFirstPlayer(playerName, 'X', 'Player');
            }else{
                game.setSecondPlayer(playerName, 'O', 'Player');
            }
            preparePlayers();
        }else{
            const alertMsg = document.querySelector('.error-msg');
            alertMsg.textContent = 'Please input your name';
        }
    }
})();
