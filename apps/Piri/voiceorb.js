// Voice Recognition Orb for Piri
// Uses Web Speech API to capture user speech and return as JavaScript object

class VoiceOrb {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.initRecognition();
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech Recognition API not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('Voice recognition started');
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      console.error('Voice recognition error', event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Voice recognition ended');
    };
  }

  listen() {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech Recognition API not supported or initialized'));
        return;
      }

      if (this.isListening) {
        reject(new Error('Already listening'));
        return;
      }

      let finalTranscript = '';

      this.recognition.onresult = (event) => {
        const results = event.results;
        for (let i = 0; i < results.length; i++) {
          finalTranscript += results[i][0].transcript;
        }
        resolve(this.createResultObject(finalTranscript));
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (!finalTranscript) {
          resolve({ ok: false, error: 'No speech detected' });
        }
      };

      try {
        this.recognition.start();
      } catch (error) {
        reject(error);
      }
    });
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  createResultObject(transcript) {
    return {
      timestamp: new Date().toISOString(),
      text: transcript,
      ok: true
    };
  }

  isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }
}

window.VoiceOrb = VoiceOrb;
