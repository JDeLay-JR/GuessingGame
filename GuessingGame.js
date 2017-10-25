var Game = function() {
    this.playersGuess = null;
    this.winningNumber = generateWinningNumber();
    this.pastGuesses = [];
}

function generateWinningNumber() {
    return Math.ceil(Math.random()*100);
}


function newGame() {
    return new Game(); //check that old game !== new game
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess-this.winningNumber);
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(guess) {
    if(typeof guess !== 'number' || guess < 1 || guess > 100) {
        throw "That is an invalid guess.";
    }
    this.playersGuess = guess;
    return this.checkGuess();
}

Game.prototype.checkGuess = function() {
    if(this.playersGuess===this.winningNumber) {
        $('#submit').prop('disabled', true);
        $('#hint').prop('disabled', true);
        $('#headers').find('h2').text('Please hit reset to play again.')
        return 'You Win!'
    }
    else {
        if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
            return 'You have already guessed that number.';
        }
        else {
            this.pastGuesses.push(this.playersGuess);
            //REVIEW THE BELOW nth-child CODE ==> HOW DOES IT WORK?
            $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);

            if(this.pastGuesses.length === 5) {
                $('#headers').find('h2').text('Please hit reset to play again.')
                $('#submit').prop('disabled', true);
                $('#hint').prop('disabled', true);
                return 'You Lose.';
            }
            else {
                var diff = this.difference();
                if(diff < 10) return 'You\'re burning up!';
                else if(diff < 25) return'You\'re lukewarm.';
                else if(diff < 50) return'You\'re a bit chilly.';
                else return'You\'re ice cold!';
            }
        }
    }
}

Game.prototype.provideHint = function() {
    var hintArray = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(hintArray);
}

function shuffle(arr) { //Fisher-Yates - https://bost.ocks.org/mike/shuffle/
   for(var i = arr.length-1; i > 0; i--) {
       var randomIndex = Math.floor(Math.random() * (i + 1));
       var temp = arr[i];
       arr[i] = arr[randomIndex];
       arr[randomIndex] = temp;
    }
    return arr;
}

  $(document).ready(function() {
    //Makes a new game instance
     var game = new Game();

     //Hint
     $("#hint").on('click', function() {
        var hints = game.provideHint().join(" ");
         $(this).parent().parents().parent().find('#headers').find('h2').text("The winning number is one of these three: " + hints);
     })

    $('#reset').on('click', function() {
        //Reset Game
        game = new Game();
        //Reset text
        $('#headers').find('h1').text("Guessing Game");
        $('#headers').find('h2').text(" Guess a number between 1 and 100");
        $('#guesses').find('.guess').text('-');
        //Reset buttons
        $('#submit').prop('disabled', false);
        $('#hint').prop('disabled', false);
        
        
    })

    //When submit is clicked it will extract the current val (as a number);
     $('#submit').on('click', function() {
        var currentGuess = +$("#input").val();
        $("#input").val("");

        //Changes header1 to result of playersGuessSubmission
        var output = game.playersGuessSubmission(currentGuess);
        $(this).parent().parent().parent().find('#headers').find('h1').text(output);

        //Changes header2 to higher or lower or Game Over based on guess
        var low = game.isLower();
        if(low && game.pastGuesses.length !== 5 && output !== 'You Win!') {
            $(this).parent().parent().parent().find('#headers').find('h2').text("Guess Higher!");
        } else if(!low && game.pastGuesses.length !== 5 && output !== 'You Win!') {
            $(this).parent().parent().parent().find('#headers').find('h2').text("Guess Lower!");
        } else {
            $(this).parent().parent().parent().find('#headers').find('h2').text("Game Over!");
        }
    });


     });