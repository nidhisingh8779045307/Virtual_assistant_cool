const btn = document.querySelector("#btn");
const content = document.querySelector("#content");
const voiceGif = document.querySelector("#voice");

let youngMaleVoice;

// Load voices and select a youthful male voice
window.speechSynthesis.onvoiceschanged = () => {
  const voices = window.speechSynthesis.getVoices();
  // Try to find a youthful-sounding male voice (example names, adjust based on available voices)
  youngMaleVoice =
    voices.find(
      (v) =>
        (v.name.includes("Male") || v.name.includes("male")) &&
        (v.name.includes("English") || v.lang.includes("en")) &&
        !v.name.includes("Google") // Optional: Avoid Google voices if they sound too mature
    ) || voices[0]; // Fallback to the first voice if none match
  console.log("Selected voice:", youngMaleVoice.name); // Log selected voice for debugging
};

// Speak Function
function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.voice = youngMaleVoice;
  utter.rate = 1.1; // Slightly faster rate for a youthful feel
  utter.pitch = 1.2; // Slightly higher pitch for a teenage voice
  utter.volume = 1;
  window.speechSynthesis.speak(utter);
}

// Wish on load
function wishMe() {
  const hour = new Date().getHours();
  if (hour < 12) speak("Good Morning!");
  else if (hour < 17) speak("Good Afternoon!");
  else speak("Good Evening!");
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
    speak("Yo, what's up? How can I help you?");
  } else if (message.includes("who are you")) {
    speak("I'm Cool, your awesome virtual assistant created by Nidhi!");
  } else if (message.includes("open youtube")) {
    speak("Opening YouTube, let's check it out!");
    window.open("https://www.youtube.com", "_blank");
  } else if (message.includes("open google")) {
    speak("Google's coming right up!");
    window.open("https://www.google.com", "_blank");
  } else {
    const searchQuery = message.replace("cool", "").trim();
    speak(`Here's what I found for ${searchQuery}, check it out!`);
    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, "_blank");
  }
}