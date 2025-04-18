const words = [
  "bap", "bim", "bop", "bub", "buk", "dap", "deb", "dif", "dun", "fap", "feg", "fim",
  "gak", "gep", "gib", "gup", "hap", "hep", "hik", "hob", "jeb", "jig", "jup", "kab",
  "kef", "kim", "kub", "lap", "lep", "lop", "lum", "mab", "mep", "mip", "mub", "nab",
  "neb", "nim", "nop", "nup", "pab", "pek", "pip", "pub", "qub", "rab", "rek", "rip",
  "rub", "sab", "sep", "sip", "sub", "tad", "tek", "tip", "tup", "vab", "vek", "vip",
  "vup", "wab", "web", "wim", "wop", "yab", "yep", "yip", "yop", "zap", "zep", "zip", "zup"
];

let currentIndex = 0;
let timedMode = false;
let recognition;
let attempts = 0;

function startPractice(timed) {
  timedMode = timed;
  currentIndex = 0;
  attempts = 0;
  speakText("Let's begin.");
  nextWord();
}

function nextWord() {
  if (currentIndex >= words.length) {
    document.getElementById("wordContainer").textContent = "Done!";
    return;
  }

  const word = words[currentIndex];
  const wordEl = document.getElementById("wordContainer");
  wordEl.textContent = word;
  wordEl.className = "word";
  attempts = 0;

  startListening(word);

  if (timedMode) {
    setTimeout(() => {
      if (attempts === 0) {
        speakText(word);
        wordEl.classList.add("incorrect");
        setTimeout(() => {
          currentIndex++;
          nextWord();
        }, 1500);
      }
    }, 3000);
  }
}

function startListening(expectedWord) {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Speech recognition not supported in this browser.");
    return;
  }

  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = function(event) {
    const spokenWord = event.results[0][0].transcript.trim().toLowerCase();
    console.log("Heard:", spokenWord);
    if (spokenWord === expectedWord) {
      document.getElementById("wordContainer").classList.add("correct");
      currentIndex++;
      setTimeout(nextWord, 1000);
    } else {
      attempts++;
      document.getElementById("wordContainer").classList.add("incorrect");
      if (attempts >= 2 && !timedMode) {
        speakText(expectedWord);
        setTimeout(() => {
          currentIndex++;
          nextWord();
        }, 1500);
      } else {
        startListening(expectedWord); // retry
      }
    }
  };

  recognition.onerror = function(event) {
    console.error("Error:", event.error);
    if (event.error === "no-speech") {
      startListening(expectedWord);
    }
  };

  recognition.start();
}

function speakText(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  speechSynthesis.speak(utter);
}
