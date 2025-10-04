const btn = document.querySelector("#btn");
const content = document.querySelector("#content");
const voiceGif = document.querySelector("#voice");

let maleVoice;

window.speechSynthesis.onvoiceschanged = () => {
  const voices = window.speechSynthesis.getVoices();
  maleVoice = voices.find(v => v.name === "Google UK English Male") || voices[0];
};

// Speak Function
function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.voice = maleVoice;
  utter.rate = 1;
  utter.pitch = 1;
  utter.volume = 1;
  window.speechSynthesis.speak(utter);
}

// Wish on load
function wishMe() {
  const hour = new Date().getHours();
  if (hour < 12) speak("Good Morning Miss");
  else if (hour < 17) speak("Good Afternoon Miss");
  else speak("Good Evening Miss");
}

window.addEventListener("load", wishMe);

// Voice Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-IN";

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  content.innerText = transcript;
  takeCommand(transcript.toLowerCase());
};

// Start Listening
btn.addEventListener("click", () => {
  recognition.start();
  btn.style.display = "none";
  voiceGif.style.display = "block";
});

// Process Command
function takeCommand(message) {
  btn.style.display = "flex";
  voiceGif.style.display = "none";

  if (message.includes("hello") || message.includes("hey")) {
    speak("Hello Miss, how can I help you?");
  } else if (message.includes("who are you")) {
    speak("I am Cool, your virtual assistant created by Miss Nidhi.");
  } else if (message.includes("open youtube")) {
    speak("Opening YouTube.");
    window.open("https://www.youtube.com", "_blank");
  } else if (message.includes("open google")) {
    speak("Opening Google.");
    window.open("https://www.google.com", "_blank");
  } else {
    const searchQuery = message.replace("cool", "").trim();
    speak(`Here's what I found for ${searchQuery}`);
    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, "_blank");
  }
}
