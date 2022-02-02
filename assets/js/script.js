
var highscores = [{name: 'aaa', score: 31} ];
var timer = 0;
var qindex = 0;
var questions = questionBank;
var inQuiz; 

let primaryAreaEl = document.querySelector('#primary-area');
let timerEl = document.querySelector('#timer');

var makeStartButton = function() {
    var startButtonEl = document.createElement('button');
    startButtonEl.className = 'start-btn btn btn-primary';
    startButtonEl.textContent = 'Start the Quiz!'

    primaryAreaEl.append(startButtonEl);
};

//start button handler
//set qindex to 0
//start a timer
//call next question

nextQuestion = () => {
    if(qindex == questions.length){
        endQuiz();
        return;
    }
    var newQuestion = makeQuestion(questions[qindex]);

    primaryAreaEl.innerHTML = '';
    primaryAreaEl.append(newQuestion);

    qindex++;
};

//timer function
//set visible timer to the time
//when time <= 0, end quiz
// TODO: create timer element 
setTimer = () => {
    timer = 60;

    // Use the `setInterval()` method to call a function to be executed every 1000 milliseconds
    var timeInterval = setInterval(function () {
        if(!inQuiz){
            clearInterval(timeInterval);
        }
        // As long as the `timeLeft` is greater than or equal 1
        if (timer >= 1) {
        // Set the `textContent` of `timerEl` to show the remaining seconds
        timerEl.textContent = 'Time Remaining: ' + timer;
        // Decrement `timer` by 1
        timer--;
        } else {
        // Once `timer` gets to 0, set `timerEl` to an empty string
        timerEl.textContent = 'placeholder';
        // Use `clearInterval()` to stop the timer
        clearInterval(timeInterval);
        // Call the `endQuiz()` function
        endQuiz();
        }
    }, 1000);
}

endQuiz = () => {
    //generate score and score submission form
    inQuiz = false;

    primaryAreaEl.innerHTML = '';
    const scoreForm = makeScoreForm((timer + qindex));
    console.log(scoreForm);
    primaryAreaEl.appendChild( scoreForm );

};

makeQuestion = (questionObj) => {
    //create question as article
    let questionEl = document.createElement('article');
    //have question as h3
    let questionTextEl = document.createElement('h3');
    questionTextEl.className = 'question-text';
    questionTextEl.textContent = questionObj.question;
    //have answer choices as an ol
    let answerListEl = document.createElement('ol');
    answerListEl.className = 'answer-list';
    //convert answer array in questionObj to li elements
    for (let index = 0; index < questionObj.answers.length; index++) {
        let answerChoiceEl = document.createElement('li');
        answerChoiceEl.className = 'answer-choice';
        answerChoiceEl.setAttribute('data-choice', index);
        answerChoiceEl.textContent = questionObj.answers[index];
        answerListEl.appendChild(answerChoiceEl);
    }

    //append question and answer to article
    questionEl.appendChild(questionTextEl);
    questionEl.appendChild(answerListEl);

    return questionEl;
};

makeScoreForm = (score) => {
    let scoreArticleEl = document.createElement('article');

    let scoreFormLabelEl = document.createElement('div');
    scoreFormLabelEl.className = 'score-info';
    scoreFormLabelEl.innerHTML = "<h3 class=''>Your score is: " + score + ". Enter Name for Scoreboard</h3>"
    scoreArticleEl.appendChild(scoreFormLabelEl);

    let scoreFormEl = document.createElement('form');
    scoreFormEl.className = 'score-form';
    scoreFormEl.setAttribute('data-score', score);

    let inputContainerEl = document.createElement('div');
    inputContainerEl.className = 'form-group';
    inputContainerEl.innerHTML = '<input type="text" name="score-name" placeholder="Enter Name" />'
    scoreFormEl.appendChild(inputContainerEl);

    let buttonContainerEl = document.createElement('div');
    buttonContainerEl.className = 'form-group';

    let formSubmitBtnEl = document.createElement('button');
    formSubmitBtnEl.className = 'btn btn-primary';    
    formSubmitBtnEl.id = 'submit-score';
    //formSubmitBtnEl.type = "submit";
    formSubmitBtnEl.textContent = 'Save Score';
    buttonContainerEl.appendChild(formSubmitBtnEl);

    scoreFormEl.appendChild(buttonContainerEl);

    scoreArticleEl.appendChild(scoreFormEl);

    console.log('adding handler', scoreFormHandler);
    scoreFormEl.addEventListener('submit', scoreFormHandler);

    return scoreArticleEl;
}

makeScoreArea = () => {
    console.log('making score')
    var scoreAreaEl = document.createElement('article');

    var scoreLabelEl = document.createElement('h3');
    scoreLabelEl.className = 'score-label';
    scoreLabelEl.textContent = "High Scores:";
    scoreAreaEl.appendChild(scoreLabelEl);

    var scoreListEl = document.createElement('ol');
    let scoreLength = Math.min(10, highscores.length);
    for (let index = 0; index < scoreLength; index++) {
        let scoreEl = document.createElement('li');
        scoreEl.className = 'score-individual';
        scoreEl.textContent = highscores[index].name + ": " + highscores[index].score;
        scoreListEl.appendChild(scoreEl);        
    };
    scoreAreaEl.appendChild(scoreListEl);

    return scoreAreaEl;
};

startButtonHandler = (event) => {
    event.preventDefault();

    if(event.target.matches('.start-btn') ){
        qindex = 0;
        inQuiz = true;
        setTimer();
        nextQuestion();
    }
}

questionChoiceHandler = (event) => {
    event.preventDefault();

    var targetEl = event.target;

    if(targetEl.matches('.answer-choice')){
        var chosen = targetEl.getAttribute('data-choice');
        
        var correct = questions[qindex-1].correct;
        if(chosen != correct){
            event.target.classList.add('answer-wrong');
            timer -= 5;
        } else {
            nextQuestion();
        }
    }

}

// add form submit handler function
//    be sure to call save scores
scoreFormHandler = (event) => {
    event.preventDefault();
    console.log(event);
    let form = document.querySelector('.score-form');
    var nameInput = form.querySelector("input[name='score-name']");

    highscores.push({ name: nameInput, score: form.getAttribute('data-score') });

    highscores.sort((itemA, itemB) => itemA.score - itemB.score)

    saveScores();

    primaryAreaEl.innerHTML = '';
    makeStartButton();

    primaryAreaEl.appendChild(makeScoreArea() );
}


//add save scores function
saveScores = () => {
    //save scores to local storage
    localStorage.setItem('scores', JSON.stringify(highscores));
}

//add a retrieve scores function
retrieveScores = () => {
    var savedScores = localStorage.getItem('scores');
    if(savedScores == null){
        return false;
    }
    highscores = JSON.parse(savedScores);
}

//run a retrieve scores call
retrieveScores();

//on script load create a start button
makeStartButton();
primaryAreaEl.addEventListener('click', questionChoiceHandler);
primaryAreaEl.addEventListener('click', startButtonHandler);
//document.querySelector('main').addEventListener('submit', scoreFormHandler);

//test code region. Remove from final project
/* document.querySelector("#check-question").appendChild( makeQuestion(questions[0]) );
document.querySelector("#highscore").appendChild( makeScoreForm(33) );
document.querySelector("#highscore").appendChild( makeScoreArea() ); */