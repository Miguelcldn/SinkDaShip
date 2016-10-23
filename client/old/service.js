
/*
 IN are functions you call to the engine,
 receiveAttack(position: string): boolean //Function to call when user is attacked, where position is a table position such as "F3". Returns `true` if attack hit and `false` otherwise.
 */
/*
 request the server with the clicked position and return hit or no hit
 @position: string
 @return: boolean
 */
window.receiveAttack = function(position){

}

/*
 yourTurn(): void //Function to call when it's the players turn, to enable user interaction
 */
window.yourTurn = function(){
    console.log('your turn');

    var matchId = window.sessionStorage.getItem('matchId');
    var playerNumber = window.sessionStorage.getItem('playerNumber');

    $.ajax({
        //url: "http://rnlabs.com.br:8080/sinkdaship/match/player-turn/" + matchId,
        url: 'https://api.portalqualis.com.br:8443/api/recommendations/20422/51804',
        method: "GET",
    }).done(function (data) {
        console.log(data);
        if(data.ok){
            if(data.resultObject.playerTurn == playerNumber){
                console.log('your turn');
                engine.yourTurn();
            } else {
                setTimeout(function () {
                    yourTurn();
                }, 3000);
            }
        } else {
            console.log('no return');
            setTimeout(function () {
                yourTurn();
            }, 3000);
        }
    });

}

/*
 `endGame(didWin: boolean)`: void //Function to call when game is over, and `didWin` tells if the current player won
 */
window.endGame = function(didWin){
    //@TODO remove / return to test only
    return Math.random() >= 0.5;
    engine.endGame(win);
}

/*
 OUT are functions I will call and you must write its code
 `attack(position: string): void` //Function that will be called when user attacks a position

 */
window.attack = function(position){
    //@TODO remove / return to test only
    var matchId = window.sessionStorage.getItem('matchId');

    $.ajax({
        url: "http://rnlabs.com.br:8080/sinkdaship/match/attack/"+ matchId,
        method: "POST",
        data: {}
    }).done(function( data ) {
        return data;
    });
}

/*
 `lookForMatch(board: BoardData): void` //Function that will be called when the user arranged his board
 */
window.lookForMatch = function(name, boardData) {
    window.sessionStorage.removeItem('matchId');

    $.ajax({
        url: "http://rnlabs.com.br:8080/sinkdaship/match/add-new",
        method: "POST",
        data: {name: name, board: boardData}
    }).done(function( data ) {
    /*var data = {
        "ok": true,
        "resultObject":    {
            "playerNumber": 1,
            "matchIdentificator": "999E76BDE5CB535D39CCB651745F6F429E6EFBB593F6CB977E5ED2472AF63724"
        }
    };*/
        if(data.ok){
            console.log('Joined Queue');

            var matchId = data.resultObject.matchIdentificator;
            console.log('Match ID ', matchId);

            var playerNumber = data.resultObject.playerNumber;
            console.log('Player Number', matchId);

            window.sessionStorage.setItem('matchId', matchId);
            window.sessionStorage.setItem('playerNumber', playerNumber);

            yourTurn();

        } else {
            console.log('Error on joining the Queue');
        }
        return data;
    });
}



