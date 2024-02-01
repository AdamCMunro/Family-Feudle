const answerData = '[{ "date": "2024-2-1", "question": "Name something associated with vampires.", "answers": ["Twilight (33)", "Blood (29)", "Garlic (9)", "Bat (7)", "Cape (7)", "Dracula (5)", "Fangs (4)", "Halloween (4)"]}]'
var answers = [];
var correct = []
var wrongGuess = 0;
var rightGuess = 0;

var sleepSetTimeout_ctrl;

function sleep(ms) {
    clearInterval(sleepSetTimeout_ctrl);
    return new Promise(resolve => sleepSetTimeout_ctrl = setTimeout(resolve, ms));
}

window.addEventListener("load", readIn());


function readIn() {
    index = getAnswer();
    parsedAnswerData = JSON.parse(answerData);
    question = parsedAnswerData[index].question;
    answers = parsedAnswerData[index].answers;
    questionBox = document.getElementById("question");
    questionText = document.createElement("p");
    questionText.innerHTML = question;
    questionBox.appendChild(questionText);
    answerDiv = document.getElementById("answerBox");
    if (answers.length > 4) {
        answerDiv.classList.add("row");
        answerDiv.classList.add("mx-auto");
        answerColLeft = document.createElement("div");
        answerColLeft.classList.add("col");
        answerDiv.appendChild(answerColLeft);
        answerColRight = document.createElement("div");
        answerColRight.classList.add("col");
        answerColRight.setAttribute("id", "leftCol")
        answerDiv.appendChild(answerColRight);
    }
    for (let i = 0; i < answers.length; i++) {
        answerBox = document.createElement("div");
        answerBox = document.createElement("div");
        answerBox.classList.add("answer");
        answerBox.classList.add("container");
        answerBox.setAttribute("id", "answer" + i);
        if (answers.length > 4) {
            if (i >= answers.length / 2) {
                answerColRight.appendChild(answerBox);
            }
            else {
                answerColLeft.appendChild(answerBox);
            }
        }
        else {
            answerDiv.appendChild(answerBox);
        }
        correct[i] = "0";

    }

}

function getAnswer() {
    parsedAnswerData = JSON.parse(answerData);

    if ((window.location.href).includes("?")) {
        url = (window.location.href).split("?");
        answerDate = url[1];
        for (let i = 0; i < parsedAnswerData.length; i++) {
            if (answerDate == parsedAnswerData[i].date) {
                return i;
            }
        }
    }

    const date = new Date();

    for (let i = 0; i < parsedAnswerData.length; i++) {
        if ((date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()) == parsedAnswerData[i].date) {
            return i;
        }
    }
}

async function guessFunction() {
    guessBtn = document.getElementById("guessBtn");
    if (!guessBtn.classList.contains("btnDisabled"))
    {
    let correctGuess = false;
    guess = document.getElementById("guess").value;
    console.log(guess);
    for (let i = 0; i < answers.length; i++) {
        if (correct[i] == "0") {
            currentAnswerBox = document.getElementById("answer" + i);
            currentAnswerBox.style.backgroundColor = "#8CB5FF";
            currentAnswerBox.style.outlineColor = "#3F84FF";
            currentAnswerBox.classList.add("glow");
            await sleep(1200);
            if (checkAnswer(document.getElementById("guess").value, answers[i])) {
                correctGuess = true;
                correct[i] = "1";
                currentAnswerBox.classList.add('flip');
                answerText = document.createElement("p");
                answerText.innerHTML = answers[i];
                currentAnswerBox.addEventListener("animationend", function (e) {
                    currentAnswerBox.classList.remove('flip');
                })
                await sleep(986);
                currentAnswerBox.appendChild(answerText);
                currentAnswerBox.classList.remove("glow");
                rightGuess++;
                break;
            }
            else if (correct[i] == "0") {
                currentAnswerBox.classList.remove("glow");
                currentAnswerBox.style.backgroundColor = "transparent";
                currentAnswerBox.style.outlineColor = "#1b1b1c";
            }
        }
    }
    document.getElementById("guess").value = "";
    if (rightGuess == answers.length) {
        gameWin();
    }
    if (correctGuess == false) {
        guessBtn.classList.add('shake');
        guessBtn.addEventListener("animationend", function (e) {
            guessBtn.classList.remove('shake');
        })
        wrongGuess++;
        wrongAttempt = document.getElementById("atmpt" + wrongGuess);
        wrongAttempt.style.backgroundColor = "#e37171"
        if (wrongGuess == 3) {
            gameOver();
        }
    }
}

}

function checkAnswer(guess, answer) {
    answrArr = answer.split(" ");
    answer = answrArr[0];
    guess = guess.toLowerCase();
    answer = answer.toLowerCase();
    if (guess == answer) {
        return true;
    }
    else if (answer.includes("/")) {
        answrArr = answer.split("/");
        for (let i = 0; i < answrArr.length; i++) {
            if (guess == answrArr[i]) {
                return true;
            }
            else if (answrArr[i].includes(" ")) {
                answrArr2 = answer.split(" ");
                for (let j = 0; j < answrArr2.length; j++) {
                    if (guess == answrArr2[i]) {
                        return true;
                    }
                }
            }
        }
    }
    else if (answer.includes(" ")) {
        answrArr = answer.split(" ");
        for (let j = 0; j < answrArr.length; j++) {
            if (guess == answrArr[i]) {
                return true;
            }
        }
    }
    return false;
}

async function gameOver() {
    disableGuessing();
    for (let i = 0; i < answers.length; i++) {
        if (correct[i] == "0") {
            currentAnswerBox = document.getElementById("answer" + i);
            currentAnswerBox.style.backgroundColor = "#FFD143";
            currentAnswerBox.style.outlineColor = "#FFAC29";
            await sleep(1100);
            currentAnswerBox.classList.add('flip');
            answerText = document.createElement("p");
            answerText.innerHTML = answers[i];
            currentAnswerBox.addEventListener("animationend", function (e) {
                currentAnswerBox.classList.remove('flip');
            })
            await sleep(986);
            currentAnswerBox.appendChild(answerText);
        }
    }
    await sleep(500);
    displayEndScreen(false);
}

function gameWin() {
    disableGuessing();
    displayEndScreen(true);
}

function displayEndScreen(winLose) {
    
}

function disableGuessing() {
    guessBtn = document.getElementById("guessBtn");
    guessBtn.classList.add("btnDisabled");
    guess = document.getElementById("guess");
    guess.classList.add("textDisabled");
    guess.readOnly = true;
}

document.querySelector('#guess').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        event.preventDefault();
        guessFunction();
    }
});
