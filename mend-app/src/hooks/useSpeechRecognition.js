import { useRef } from 'react'

function transcriptFromResults(results) {
  let text = ''
  for (let i = 0; i < results.length; i += 1) {
    text += results[i][0]?.transcript ?? ''
  }
  return text
}

export function useSpeechRecognition({ onResult, onEnd }) {
  const recognitionRef = useRef(null)

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice input not supported in this browser. Please use Chrome or Edge.')
      return false
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort()
      } catch {
        /* ignore */
      }
      recognitionRef.current = null
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-IN'
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      const transcript = transcriptFromResults(event.results).trim()
      const last = event.results[event.results.length - 1]
      const isFinal = Boolean(last?.isFinal)
      onResult(transcript, isFinal)
    }

    recognition.onend = () => {
      onEnd()
    }

    recognition.onerror = (event) => {
      console.error('Speech error code:', event.error)
      if (event.error === 'not-allowed') {
        alert(
          'Microphone access denied. Please allow mic access in Chrome settings and refresh.',
        )
      }
      if (event.error === 'network') {
        alert('Network error with speech recognition. Try refreshing the page.')
      }
      if (event.error === 'audio-capture') {
        alert('No microphone found or it could not be opened. Check your device and try again.')
      }
      onEnd()
    }

    try {
      recognition.start()
    } catch (e) {
      console.error('recognition.start() failed:', e)
      onEnd()
      return false
    }

    recognitionRef.current = recognition
    return true
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {
        try {
          recognitionRef.current.abort()
        } catch {
          /* ignore */
        }
      }
    }
  }

  return { startListening, stopListening }
}
