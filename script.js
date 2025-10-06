// Voice Assistant Module
const VoiceAssistant = (() => {
  let teenMaleVoice = null;
  let isSpeechSupported = !!window.speechSynthesis;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isRecognitionSupported = !!SpeechRecognition;

  // Initialize voices
  const initVoices = () => {
    return new Promise((resolve) => {
      if (!isSpeechSupported) {
        console.warn("Speech synthesis not supported in this browser.");
        resolve();
        return;
      }

      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        teenMaleVoice = voices.find(
          (v) => v.name.includes("Google US English") && v.lang === "en-US"
        ) || voices[0];
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
  const speak = (text) => {
    if (!isSpeechSupported) {
      console.warn("Cannot speak: Speech synthesis not supported.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (teenMaleVoice) utterance.voice = teenMaleVoice;
    utterance.rate = 1;
    utterance.pitch = 1.2;
    utterance.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // Extract numbers from message
  const extractNumbers = (message) => {
    const numberWords = {
      zero: 0, one: 1, two: 2, three: 3, four: 4,
      five: 5, six: 6, seven: 7, eight: 8, nine: 9
    };
    const words = message.split(/\s+/);
    const numbers = words
      .map((word) => numberWords[word] ?? parseFloat(word))
      .filter((num) => !isNaN(num));
    return numbers.length ? numbers : null;
  };

  // Process voice command
  const takeCommand = async (message, { btn, voice } = {}) => {
    if (btn && voice) {
      btn.style.display = "flex";
      voice.style.display = "none";
    }

    if (!message || typeof message !== "string") {
      speak("Sorry, I didn't understand the command.");
      return;
    }

    message = message.toLowerCase().trim();
    await initVoices();

    const commands = [
      {
        keywords: ["hello", "hey", "hi"],
        action: () => speak("Hello, how can I help you today?"),
      },
      {
        keywords: ["who are you", "what are you"],
        action: () => speak("I am Cool, your virtual assistant created by Miss Nidhi."),
      },
      {
        keywords: ["time"],
        action: () => {
          const time = new Date().toLocaleTimeString();
          speak(`The time is ${time}`);
        },
      },
      {
        keywords: ["date", "day"],
        action: () => {
          const date = new Date().toLocaleDateString();
          speak(`Today's date is ${date}`);
        },
      },
      {
        keywords: ["open youtube"],
        action: () => {
          speak("Opening YouTube.");
          window.open("https://www.youtube.com", "_blank");
        },
      },
      {
        keywords: ["open google"],
        action: () => {
          speak("Opening Google.");
          window.open("https://www.google.com", "_blank");
        },
      },
      {
        keywords: ["open facebook"],
        action: () => {
          speak("Opening Facebook.");
          window.open("https://www.facebook.com", "_blank");
        },
      },
      {
        keywords: ["add", "sum", "plus"],
        action: () => {
          const numbers = extractNumbers(message);
          if (numbers) {
            const sum = numbers.reduce((a, b) => a + b, 0);
            speak(`The sum is ${sum}`);
          } else {
            speak("I couldn't find numbers to add. Please say numbers clearly, like 'add two and three'.");
          }
        },
      },
      {
        keywords: ["weather", "temperature"],
        action: () => {
          speak("Please check the weather on Google.");
          window.open("https://www.google.com/search?q=weather", "_blank");
        },
      },
      {
        keywords: ["joke"],
        action: () => {
          const jokes = [
            "Why did the scarecrow win an award? Because he was outstanding in his field!",
            "Why don't scientists trust atoms? Because they make up everything!",
            "Why did the math book look sad? Because it had too many problems.",
          ];
          const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
          speak(randomJoke);
        },
      },
      {
        keywords: ["reminder", "note"],
        action: () => speak("I cannot set reminders yet, but you can write them down or ask me to search for a reminder app!"),
      },
    ];

    const matchedCommand = commands.find((cmd) =>
      cmd.keywords.some((keyword) => message.includes(keyword))
    );

    if (matchedCommand) {
      matchedCommand.action();
    } else {
      const searchQuery = message.replace("cool", "").trim();
      speak(`Here's what I found for ${searchQuery}`);
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, "_blank");
    }
  };

  // Initialize speech recognition
  const startRecognition = (btn, voice) => {
    if (!isRecognitionSupported) {
      speak("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      if (btn && voice) {
        btn.style.display = "none";
        voice.style.display = "block";
      }
    };

    recognition.onresult = (event) => {
      const message = event.results[0][0].transcript;
      takeCommand(message, { btn, voice });
    };

    recognition.onerror = (event) => {
      speak("Sorry, I encountered an error while listening. Please try again.");
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

  return { takeCommand, speak, initVoices, startRecognition };
})();

// Initialize assistant
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("#btn");
  const voice = document.querySelector("#voice");

  if (!btn || !voice) {
    console.error("Required DOM elements (#btn or #voice) not found.");
    return;
  }

  btn.addEventListener("click", () => {
    VoiceAssistant.startRecognition(btn, voice);
  });
});