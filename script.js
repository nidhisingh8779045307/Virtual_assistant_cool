// Voice Assistant Module
const VoiceAssistant = (() => {
  let teenMaleVoice = null;
  const isSpeechSupported = !!window.speechSynthesis;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isRecognitionSupported = !!SpeechRecognition;

  // Initialize voices
  const initVoices = () => {
    return new Promise((resolve) => {
      if (!isSpeechSupported) {
        console.warn("Speech synthesis not supported in this browser.");
        alert("This browser does not support speech synthesis. Please use Chrome or Edge.");
        resolve();
        return;
      }

      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();

        // Pick a male English voice (closest to teen male)
        teenMaleVoice =
          voices.find(v => v.name.toLowerCase().includes("male") && v.lang.startsWith("en")) ||
          voices.find(v => v.lang.startsWith("en")) ||
          voices[0];

        console.log("Selected voice:", teenMaleVoice?.name);
        console.log("Available voices:", voices.map(v => v.name));
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
  const speak = async (text, outputElement) => {
    if (!isSpeechSupported) return;

    await initVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    if (teenMaleVoice) utterance.voice = teenMaleVoice;
    utterance.rate = 1;
    utterance.pitch = 1.1; // slightly higher pitch for teen effect
    utterance.volume = 1;

    if (outputElement) outputElement.textContent = text;

    // Cancel any previous speech to avoid overlap
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // Time-based greeting
  const wishMe = async () => {
    await initVoices();
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
      { keywords: ["hello", "hey"], action: () => speak("Hello Miss, how can I help you?", content) },
      { keywords: ["who are you"], action: () => speak("I am Cool, your virtual assistant created by Miss Nidhi.", content) },
      { keywords: ["open youtube"], action: () => { speak("Opening YouTube.", content); window.open("https://www.youtube.com", "_blank"); } },
      { keywords: ["open google"], action: () => { speak("Opening Google.", content); window.open("https://www.google.com", "_blank"); } },
    ];

    const matchedCommand = commands.find(cmd =>
      cmd.keywords.some(keyword => message.includes(keyword))
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
      speak("Speech recognition is not supported in this browser. Please use Chrome or Edge.", content);
      alert("Speech recognition is not supported. Please use Chrome or Edge.");
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
        if (content) content.textContent = "Listening...";
      }
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (content) content.textContent = transcript;
      takeCommand(transcript, { btn, voice, content });
    };

    recognition.onerror = (event) => {
      speak(`Speech recognition error: ${event.error}. Please try again.`, content);
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

    try {
      recognition.start();
    } catch (error) {
      speak("Failed to start recognition. Please check microphone permissions.", content);
      console.error("Recognition start error:", error);
      if (btn && voice) {
        btn.style.display = "flex";
        voice.style.display = "none";
      }
    }
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
    alert("Page elements are missing. Please check the HTML structure.");
    return;
  }

  VoiceAssistant.wishMe();

  btn.addEventListener("click", () => {
    VoiceAssistant.startRecognition(btn, voice, content);
  });

  document.querySelectorAll("img").forEach(img => {
    img.onerror = () => console.error(`Failed to load image: ${img.src}`);
  });
});