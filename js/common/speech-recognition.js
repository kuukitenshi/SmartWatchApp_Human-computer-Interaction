class MicrophoneSpeech {

    constructor() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            this.isAvailable = false;
            return;
        }
        this.isAvailable = true;
        this.speechRecognition = new SpeechRecognition();
        this.speechRecognition.continuous = false;
        this.speechRecognition.lang = "pt_PT";
        this.speechRecognition.interimResults = false;
        this.speechRecognition.maxAlternatives = 1;
        this.recording = false;
        this.onresult = () => {};
        this.onstart = () => {};
        this.onend = () => {};
        this.onerror = () => {};
        this.speechRecognition.onresult = (event) => {
            const result = event.results[0][0].transcript;
            this.onresult(result);
        };
        this.speechRecognition.onaudioend = () => {
            this.onend();
            this.recording = false;
        };
        this.speechRecognition.onaudiostart = () => {
            this.onstart();
            this.recording = true;
        };
        this.speechRecognition.onerror = () => {
            this.onerror();
        };
    }

    stop() {
        if (this.speechRecognition)
            this.speechRecognition.stop();
    }

    start() {
        if (this.isRecording() || !this.speechRecognition)
            return;
        this.speechRecognition.start();
    }

    isRecording() {
        return this.recording;
    }
}