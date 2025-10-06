function takeCommand(message) {
  btn.style.display = "flex";
  voiceGif.style.display = "none";

  message = message.toLowerCase();

  // Greetings
  if (message.includes("hello") || message.includes("hey") || message.includes("hi")) {
    speak("Hello Miss, how can I help you today?");
  }
  // About assistant
  else if (message.includes("who are you") || message.includes("what are you")) {
    speak("I am Cool, your virtual assistant created by Miss Nidhi.");
  }
  // Time and date
  else if (message.includes("time")) {
    const time = new Date().toLocaleTimeString();
    speak(`The time is ${time}`);
  } else if (message.includes("date") || message.includes("day")) {
    const date = new Date().toLocaleDateString();
    speak(`Today's date is ${date}`);
  }
  // Open websites
  else if (message.includes("open youtube")) {
    speak("Opening YouTube.");
    window.open("https://www.youtube.com", "_blank");
  } else if (message.includes("open google")) {
    speak("Opening Google.");
    window.open("https://www.google.com", "_blank");
  } else if (message.includes("open facebook")) {
    speak("Opening Facebook.");
    window.open("https://www.facebook.com", "_blank");
  }
  // Simple math
  else if (message.includes("add") || message.includes("sum") || message.includes("plus")) {
    try {
      let numbers = message.match(/\d+/g);
      if (numbers) {
        let sum = numbers.map(Number).reduce((a, b) => a + b, 0);
        speak(`The sum is ${sum}`);
      } else speak("I couldn't find numbers to add.");
    } catch {
      speak("Sorry, I couldn't calculate that.");
    }
  }
  // Weather info
  else if (message.includes("weather") || message.includes("temperature")) {
    speak("Please check the weather on Google.");
    window.open("https://www.google.com/search?q=weather", "_blank");
  }
  // Jokes
  else if (message.includes("joke")) {
    const jokes = [
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "Why don't scientists trust atoms? Because they make up everything!",
      "Why did the math book look sad? Because it had too many problems."
    ];
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    speak(randomJoke);
  }
  // Personal assistant tasks
  else if (message.includes("reminder") || message.includes("note")) {
    speak("I cannot set reminders yet, but you can write them somewhere!");
  }
  // General search fallback
  else {
    const searchQuery = message.replace("cool", "").trim();
    speak(`Here's what I found for ${searchQuery}`);
    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, "_blank");
  }
  
  let teenMaleVoice;

window.speechSynthesis.onvoiceschanged = () => {
  const voices = window.speechSynthesis.getVoices();
  // Try finding a male voice, adjust if you see better names in your browser
  teenMaleVoice = voices.find(v => v.name.includes("Google US English") && v.lang === "en-US") || voices[0];
};

// Speak Function
function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.voice = teenMaleVoice;
  utter.rate = 1;      // Normal speaking speed
  utter.pitch = 1.2;   // Slightly higher pitch to sound younger
  utter.volume = 1;
  window.speechSynthesis.speak(utter);
}
window.speechSynthesis.getVoices().forEach(voice => console.log(voice.name, voice.lang));
}