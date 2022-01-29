
var highscores = [];
var timer = 0;
var qindex = 0;
var questions = questionBank;
var inQuiz; 

let primaryAreaEl = document.querySelector('#primary-area');
let timerEl = document.querySelector('#timer');

var makeStartButton = function() {
    var startButtonEl = document.createElement('button');
    startButtonEl.className = 'start-btn';
    startButtonEl.textContent = 'Start the Quiz!'

    primaryAreaEl.append(startButtonEl);
};

//start button handler
//set qindex to 0
//start a timer
//call next question

nextQuestion = () => {
    console.log( "ind" + qindex,' ', questions.length)
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
    primaryAreaEl.innerHTML = "<h3>Congrats your score is "+ (timer + qindex)
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
        console.log(targetEl);
        var chosen = targetEl.getAttribute('data-choice');
        
        var correct = questions[qindex-1].correct;
        console.log(chosen,' ', correct);
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

//add save scores function

//add a retrieve scores function

//run a retrieve scores call

//on script load create a start button
makeStartButton();
primaryAreaEl.addEventListener('click', questionChoiceHandler);
primaryAreaEl.addEventListener('click', startButtonHandler);