// import React, { useState, useEffect } from 'react';

// const SpeechRecognizer = ({ onResult, onError }) => {
//   const [isListening, setIsListening] = useState(false);
//   const [transcript, setTranscript] = useState('');
//   const recognitionRef = React.useRef(null);

//   useEffect(() => {
//     if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
//       onError("Web Speech API is not supported by this browser.");
//       return;
//     }

//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();
//     recognition.continuous = true; // Keep listening
//     recognition.interimResults = true; // Get interim results

//     recognition.onstart = () => {
//       setIsListening(true);
//       setTranscript('');
//     };

//     recognition.onresult = (event) => {
//       let interimTranscript = '';
//       let finalTranscript = '';
//       for (let i = event.resultIndex; i < event.results.length; ++i) {
//         const transcriptSegment = event.results[i][0].transcript;
//         if (event.results[i].isFinal) {
//           finalTranscript += transcriptSegment;
//         } else {
//           interimTranscript += transcriptSegment;
//         }
//       }
//       setTranscript(finalTranscript + interimTranscript);
//       onResult(finalTranscript); // Pass final transcript to parent
//     };

//     recognition.onerror = (event) => {
//       setIsListening(false);
//       console.error('Speech recognition error:', event.error);
//       onError(`Speech recognition error: ${event.error}`);
//     };

//     recognition.onend = () => {
//       setIsListening(false);
//       console.log('Speech recognition ended.');
//     };

//     recognitionRef.current = recognition;

//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//     };
//   }, [onResult, onError]);

//   const startListening = () => {
//     if (recognitionRef.current) {
//       try {
//         recognitionRef.current.start();
//       } catch (e) {
//         console.error("Error starting speech recognition:", e);
//         onError("Microphone already in use or error starting recognition.");
//       }
//     }
//   };

//   const stopListening = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//     }
//   };

//   return (
//     <div>
//       <button onClick={isListening ? stopListening : startListening}>
//         {isListening ? 'Stop Listening' : 'Start Listening'}
//       </button>
//       <p>Transcript: {transcript}</p>
//     </div>
//   );
// };

// export default SpeechRecognizer;

import React, { useState, useEffect, useRef } from 'react';

const SpeechRecognizer = ({ onResult, onError }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    // Check if Web Speech API is supported
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      onError("Web Speech API is not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      finalTranscriptRef.current = '';
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = finalTranscriptRef.current;

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const segment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += segment + ' ';
        } else {
          interim += segment;
        }
      }

      finalTranscriptRef.current = final;
      setTranscript(final + interim);

      if (final.trim()) {
        onResult(final.trim());
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      onError(`Speech recognition error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('Speech recognition ended');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [onResult, onError]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Error starting speech recognition:", e);
        onError("Microphone already in use or recognition already started.");
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? '🛑 Stop Listening' : '🎙️ Start Listening'}
      </button>
      <p><strong>Transcript:</strong> {transcript}</p>
    </div>
  );
};

export default SpeechRecognizer;
