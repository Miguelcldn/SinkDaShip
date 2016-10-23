
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
    //@TODO remove / return to test only
    return Math.random() >= 0.5;

    $.ajax({
        url: "http://rnlabs.com.br:8080/sinkdaship/@TODO endpoint for attack",
        method: "POST",
        data: {pos:position},
        beforeSend: function( xhr ) {
            //something
        }
    }).done(function( data ) {
        //END TURN !important
        return data;
    });
}

/*
 yourTurn(): void //Function to call when it's the players turn, to enable user interaction
 */
window.yourTurn = function(){
    //@TODO remove / return to test only
    return Math.random() >= 0.5;

    var sTimeOut = setTimeout(function () {
        // Depois, em outra página ou aba, recupera esse item
        var matchId = window.sessionStorage.getItem('matchId');

        $.ajax({
            url: "http://rnlabs.com.br:8080/sinkdaship/match/player-turn/" + matchId,
            method: "GET",
        }).done(function (data) {
            if(data.ok){
                console.log('checl in turn');
            } else {
                timeOutId = setTimeout(ajaxFn, 10000);
            }
        });
    }, 3000);
}

/*
 `endGame(didWin: boolean)`: void //Function to call when game is over, and `didWin` tells if the current player won
 */
window.endGame = function(didWin){
    //@TODO remove / return to test only
    return Math.random() >= 0.5;


}

/*
 OUT are functions I will call and you must write its code
 `attack(position: string): void` //Function that will be called when user attacks a position

 */
window.attack = function(position){
    //@TODO remove / return to test only
    return Math.random() >= 0.5;

    $.ajax({
        url: "http://rnlabs.com.br:8080/sinkdaship/match/attack/",
        method: "POST",
        data: {},
        beforeSend: function( xhr ) {
            //something
        }
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
        url: "http://rnlabs.com.br:8080/sinkdaship/player/add-new",
        method: "POST",
        data: {name: name, board: boardData}
    }).done(function( data ) {
        if(data.ok){
            console.log('Joined Queue');

            matchId = data.resultObject.hashId;
            console.log('match id ', matchId);

            window.sessionStorage.setItem('matchId', matchId);


        } else {
            console.log('Error on joining the Queue');
        }
        return data;
    });
}



