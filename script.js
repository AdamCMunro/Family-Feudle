const answerData = '[{ "date": "2024-1-31", "question": "Name an occupation that begins with the letter J.", "answers": ["Janitor", "Jeweler", "Jockey", "Journalist", "Judge"]}]'
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
    for (let i = 0; i < answers.length; i++) {
        answerBox = document.createElement("div");
        answerBox = document.createElement("div");
        answerBox.classList.add("answer");
        answerBox.classList.add("container");
        answerBox.setAttribute("id", "answer" + i);
        answerDiv.appendChild(answerBox);
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
    let correctGuess = false;
    guess = document.getElementById("guess").value;
    guessBtn = document.getElementById("guessBtn");
    console.log(guess);
    for (let i = 0; i < answers.length; i++) {
        if (correct[i] == "0") {
            currentAnswerBox = document.getElementById("answer" + i);
            currentAnswerBox.style.backgroundColor = "#8CB5FF";
            currentAnswerBox.style.outlineColor = "#3F84FF";
            await sleep(1500);
            if (answers[i] == document.getElementById("guess").value) {
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
                rightGuess++;
                break;
            }
            else if (correct[i] == "0") {
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

async function gameOver() {
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
    displayEndScreen(true);
}

function displayEndScreen(winLose)
{

}
