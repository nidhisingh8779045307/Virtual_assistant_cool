// Voice Assistant Module
const VoiceAssistant = (() => {
  let maleVoice = null;
  const isSpeechSupported = !!window.speechSynthesis;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isRecognitionSupported = !!SpeechRecognition;

  // Initialize voices
  const initVoices = () => {
    return new Promise((resolve) => {
      if (!isSpeechSupported) {
        console.warn("Speech synthesis not supported.");
        resolve();
        return;
      }

      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        maleVoice = voices.find((v) => v.name === "Google UK English Male") || voices[0];
        resolve();
      };

      if (window.speechSynthesis.getVoices().length) {
        loadVoices();
      } else {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    });
  };

  // Speak function
  const speak = (text, outputElement) => {
    if (!isSpeechSupported) {
      console.warn("Cannot speak: Speech synthesis not supported.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (maleVoice) utterance.voice = maleVoice;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    if (outputElement) outputElement.textContent = text; // Visual feedback
    window.speechSynthesis.cancel(); // Prevent overlap
    window.speechSynthesis.speak(utterance);
  };

  // Time-based greeting
  const wishMe = () => {
    const hour = new Date().getHours();
    let greeting;
    if (hour < 12) greeting = "Good Morning Miss";
    else if (hour < 17) greeting = "Good Afternoon Miss";
    else greeting = "Good Evening Miss";
    speak(greeting);
  };

  // Process command
  const takeCommand = async (message, { btn, voice, content } = {}) => {
    if (btn && voice) {
      btn.style.display = "flex";
      voice.style.display = "none";
    }

    if (!message || typeof message !== "string") {
      speak("Sorry, I didn't understand the command.", content);
      return;
    }

    message = message.toLowerCase().trim();
    await initVoices();

    const commands = [
      {
        keywords: ["hello", "hey"],
        action: () => speak("Hello Miss, how can I help you?", content),
      },
      {
        keywords: ["who are you"],
        action: () => speak("I am Cool, your virtual assistant created by Miss Nidhi.", content),
      },
      {
        keywords: ["open youtube"],
        action: () => {
          speak("Opening YouTube.", content);
          window.open("https://www.youtube.com", "_blank");
        },
      },
      {
        keywords: ["open google"],
        action: () => {
          speak("Opening Google.", content);
          window.open("https://www.google.com", "_blank");
        },
      },
    ];

    const matchedCommand = commands.find((cmd) =>
      cmd.keywords.some((keyword) => message.includes(keyword))
    );

    if (matchedCommand) {
      matchedCommand.action();
    } else {
      const searchQuery = message.replace("cool", "").trim();
      if (searchQuery) {
        speak(`Here's what I found for ${searchQuery}`, content);
        window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, "_blank");
      } else {
        speak("Please provide a valid query to search.", content);
      }
    }
  };

  // Start speech recognition
  const startRecognition = (btn, voice, content) => {
    if (!isRecognitionSupported) {
      speak("Speech recognition is not supported in this browser.", content);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      if (btn && voice) {
        btn.style.display = "none";
        voice.style.display = "block";
      }
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (content) content.textContent = transcript;
      takeCommand(transcript.toLowerCase(), { btn, voice, content });
    };

    recognition.onerror = (event) => {
      speak("Sorry, I encountered an error while listening. Please try again.", content);
      console.error("Speech recognition error:", event.error);
      if (btn && voice) {
        btn.style.display = "flex";
        voice.style.display = "none";
      }
    };

    recognition.onend = () => {
      if (btn && voice) {
        btn.style.display = "flex";
        voice.style.display = "none";
      }
    };

    recognition.start();
  };

  return { takeCommand, speak, wishMe, startRecognition, initVoices };
})();

// Initialize assistant
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("#btn");
  const content = document.querySelector("#content");
  const voice = document.querySelector("#voice");

  if (!btn || !content || !voice) {
    console.error("Required DOM elements (#btn, #content, or #voice) not found.");
    return;
  }

  // Greet on load
  VoiceAssistant.wishMe();

  // Start recognition on button click
  btn.addEventListener("click", () => {
    VoiceAssistant.startRecognition(btn, voice, content);
  });
});