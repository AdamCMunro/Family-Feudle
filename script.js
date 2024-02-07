const answerData = '[{ "date": "2024-2-7", "question": "What is a common item people forget to take with them when leaving the house?", "answers": ["Keys (50)", "Phone (25)", "Wallet (15)", "Sunglasses (10)"]}]'
var answers = [];
var correct = []
var wrongGuess = 0;
var rightGuess = 0;
var score = 100;

var sleepSetTimeout_ctrl;

function sleep(ms) {
    clearInterval(sleepSetTimeout_ctrl);
    return new Promise(resolve => sleepSetTimeout_ctrl = setTimeout(resolve, ms));
}

window.addEventListener("load", readIn(), displayEndScreen(true));


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
                score = (score + parseAnswerScore(answers[i]));
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
        wrongAttempt.classList.add('shake');
        wrongAttempt.addEventListener("animationend", function (e) {
            wrongAttempt.classList.remove('shake');
        })
        if (wrongGuess == 3) {
            gameOver();
        }
    }
}

}

function parseAnswerScore(str)
{
    let strArr = str.split('(');
    str = strArr[1];
    str = str.substring(0, str.length-1);
    return parseInt(str);

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
            else if (guess.slice(-1) == "s" && answer + "s" == guess)
            {
                return true;
            }
            else if (answer.slice(-1) == "s" && guess + "s" == answer)
            {
                return true;
            }
        }
    }
    else if (answer.includes(" ")) {
        answrArr = answer.split(" ");
        for (let j = 0; j < answrArr.length; j++) {
            if (guess == answrArr[i]) {
                return true;
            }
            else if (guess.slice(-1) == "s" && answer + "s" == guess)
            {
                return true;
            }
            else if (answer.slice(-1) == "s" && guess + "s" == answer)
            {
                return true;
            }
        }
    }
    else if (guess.slice(-1) == "s" && answer + "s" == guess)
            {
                return true;
            }
            else if (answer.slice(-1) == "s" && guess + "s" == answer)
            {
                return true;
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

async function gameWin() {
    disableGuessing();
    await sleep(500);
    displayEndScreen(true);
}

function displayEndScreen(winLose) {
    body = document.getElementsByTagName("body");
    main = document.getElementById("main");
    main.classList.add("gameEnd");
    endScreenDiv = document.createElement("div");
    endScreenDiv.setAttribute("id", "endScreenDiv");
    body[0].appendChild(endScreenDiv);
    endScreenTitleText = document.createElement("h1");
    if (winLose)
    {
        endScreenTitleText.innerHTML = "Well Done!"
    }
    else {
        endScreenTitleText.innerHTML = "Too Bad..."
    }
    endScreenScoreTitle = document.createElement("h4");
    endScreenScoreTitle.innerHTML = "Score:";
    endScreenScore = document.createElement("h1");
    endScreenDiv.appendChild(endScreenTitleText);
    endScreenDiv.appendChild(endScreenScoreTitle);
    endScreenDiv.appendChild(endScreenScore);
    endScreenDiv.classList.add("drop");
    endScreenDiv.addEventListener("animationend", function (e) {
        endScreenDiv.classList.remove('drop');
        endScreenDiv.classList.add("float");
        countUp(endScreenScore); 
    })
    
}

async function countUp(num)
{
    num.style.color = "#FFD143"
    for (let i = 0; i <= score; i++)
    {
        num.style.filter = "saturate(" + i + "%)";
        num.innerHTML = i;
        await sleep(22)
    }
    if (score == 100)
    {
        confetti(); //code from https://codepen.io/bananascript/pen/EyZeWm
    }
}

function confetti() {
        var random = Math.random
    , cos = Math.cos
    , sin = Math.sin
    , PI = Math.PI
    , PI2 = PI * 2
    , timer = undefined
    , frame = undefined
    , confetti = [];

  var particles = 10
    , spread = 40
    , sizeMin = 3
    , sizeMax = 12 - sizeMin
    , eccentricity = 10
    , deviation = 100
    , dxThetaMin = -.1
    , dxThetaMax = -dxThetaMin - dxThetaMin
    , dyMin = .13
    , dyMax = .18
    , dThetaMin = .4
    , dThetaMax = .7 - dThetaMin;

  var colorThemes = [
    function() {
      return color(200 * random()|0, 200 * random()|0, 200 * random()|0);
    }, function() {
      var black = 200 * random()|0; return color(200, black, black);
    }, function() {
      var black = 200 * random()|0; return color(black, 200, black);
    }, function() {
      var black = 200 * random()|0; return color(black, black, 200);
    }, function() {
      return color(200, 100, 200 * random()|0);
    }, function() {
      return color(200 * random()|0, 200, 200);
    }, function() {
      var black = 256 * random()|0; return color(black, black, black);
    }, function() {
      return colorThemes[random() < .5 ? 1 : 2]();
    }, function() {
      return colorThemes[random() < .5 ? 3 : 5]();
    }, function() {
      return colorThemes[random() < .5 ? 2 : 4]();
    }
  ];
  function color(r, g, b) {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  // Cosine interpolation
  function interpolation(a, b, t) {
    return (1-cos(PI*t))/2 * (b-a) + a;
  }

  // Create a 1D Maximal Poisson Disc over [0, 1]
  var radius = 1/eccentricity, radius2 = radius+radius;
  function createPoisson() {
    // domain is the set of points which are still available to pick from
    // D = union{ [d_i, d_i+1] | i is even }
    var domain = [radius, 1-radius], measure = 1-radius2, spline = [0, 1];
    while (measure) {
      var dart = measure * random(), i, l, interval, a, b, c, d;

      // Find where dart lies
      for (i = 0, l = domain.length, measure = 0; i < l; i += 2) {
        a = domain[i], b = domain[i+1], interval = b-a;
        if (dart < measure+interval) {
          spline.push(dart += a-measure);
          break;
        }
        measure += interval;
      }
      c = dart-radius, d = dart+radius;

      // Update the domain
      for (i = domain.length-1; i > 0; i -= 2) {
        l = i-1, a = domain[l], b = domain[i];
        // c---d          c---d  Do nothing
        //   c-----d  c-----d    Move interior
        //   c--------------d    Delete interval
        //         c--d          Split interval
        //       a------b
        if (a >= c && a < d)
          if (b > d) domain[l] = d; // Move interior (Left case)
          else domain.splice(l, 2); // Delete interval
        else if (a < c && b > c)
          if (b <= d) domain[i] = c; // Move interior (Right case)
          else domain.splice(i, 0, c, d); // Split interval
      }

      // Re-measure the domain
      for (i = 0, l = domain.length, measure = 0; i < l; i += 2)
        measure += domain[i+1]-domain[i];
    }

    return spline.sort();
  }

  // Create the overarching container
  var container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top      = '0';
  container.style.left     = '0';
  container.style.width    = '100%';
  container.style.height   = '0';
  container.style.overflow = 'visible';
  container.style.zIndex   = '9999';

  // Confetto constructor
  function Confetto(theme) {
    this.frame = 0;
    this.outer = document.createElement('div');
    this.inner = document.createElement('div');
    this.outer.appendChild(this.inner);

    var outerStyle = this.outer.style, innerStyle = this.inner.style;
    outerStyle.position = 'absolute';
    outerStyle.width  = (sizeMin + sizeMax * random()) + 'px';
    outerStyle.height = (sizeMin + sizeMax * random()) + 'px';
    innerStyle.width  = '100%';
    innerStyle.height = '100%';
    innerStyle.backgroundColor = theme();

    outerStyle.perspective = '50px';
    outerStyle.transform = 'rotate(' + (360 * random()) + 'deg)';
    this.axis = 'rotate3D(' +
      cos(360 * random()) + ',' +
      cos(360 * random()) + ',0,';
    this.theta = 360 * random();
    this.dTheta = dThetaMin + dThetaMax * random();
    innerStyle.transform = this.axis + this.theta + 'deg)';

    this.x = window.innerWidth * random();
    this.y = -deviation;
    this.dx = sin(dxThetaMin + dxThetaMax * random());
    this.dy = dyMin + dyMax * random();
    outerStyle.left = this.x + 'px';
    outerStyle.top  = this.y + 'px';

    // Create the periodic spline
    this.splineX = createPoisson();
    this.splineY = [];
    for (var i = 1, l = this.splineX.length-1; i < l; ++i)
      this.splineY[i] = deviation * random();
    this.splineY[0] = this.splineY[l] = deviation * random();

    this.update = function(height, delta) {
      this.frame += delta;
      this.x += this.dx * delta;
      this.y += this.dy * delta;
      this.theta += this.dTheta * delta;

      // Compute spline and convert to polar
      var phi = this.frame % 7777 / 7777, i = 0, j = 1;
      while (phi >= this.splineX[j]) i = j++;
      var rho = interpolation(
        this.splineY[i],
        this.splineY[j],
        (phi-this.splineX[i]) / (this.splineX[j]-this.splineX[i])
      );
      phi *= PI2;

      outerStyle.left = this.x + rho * cos(phi) + 'px';
      outerStyle.top  = this.y + rho * sin(phi) + 'px';
      innerStyle.transform = this.axis + this.theta + 'deg)';
      return this.y > height+deviation;
    };
  }

  function poof() {
    if (!frame) {
      // Append the container
      document.body.appendChild(container);

      // Add confetti
      var theme = colorThemes[0]
        , count = 0;
      (function addConfetto() {
        var confetto = new Confetto(theme);
        confetti.push(confetto);
        container.appendChild(confetto.outer);
        timer = setTimeout(addConfetto, spread * random());
      })(0);

      // Start the loop
      var prev = undefined;
      requestAnimationFrame(function loop(timestamp) {
        var delta = prev ? timestamp - prev : 0;
        prev = timestamp;
        var height = window.innerHeight;

        for (var i = confetti.length-1; i >= 0; --i) {
          if (confetti[i].update(height, delta)) {
            container.removeChild(confetti[i].outer);
            confetti.splice(i, 1);
          }
        }

        if (timer || confetti.length)
          return frame = requestAnimationFrame(loop);

        // Cleanup
        document.body.removeChild(container);
        frame = undefined;
      });
    }
  }

  poof();
    };


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
