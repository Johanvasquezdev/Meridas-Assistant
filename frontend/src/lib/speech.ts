/**
 * Browser Speech Synthesis Utility
 * Provides reliable, natural text-to-speech fallback using Web Speech API
 */

export function playBrowserSpeech(
  text: string,
  onEnd?: () => void,
  onError?: () => void
): () => void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onError?.();
    return () => {};
  }

  // Cancel any active speech before starting new
  window.speechSynthesis.cancel();

  // Strip markdown, citation brackets [1], [^2], headers, etc. for clear speech
  const clean = text
    .replace(/\[\^?\d+\]/g, "")
    .replace(/[*#`_~]/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) {
    onEnd?.();
    return () => {};
  }

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  // Select the highest quality natural English voice available in the client browser
  const voices = window.speechSynthesis.getVoices();
  const naturalVoice =
    voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Natural") ||
          v.name.includes("Online") ||
          v.name.includes("Neural") ||
          v.name.includes("Google") ||
          v.name.includes("Samantha"))
    ) || voices.find((v) => v.lang.startsWith("en"));

  if (naturalVoice) {
    utterance.voice = naturalVoice;
  }

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = (e) => {
    console.warn("Browser speech synthesis notice:", e);
    onError?.();
  };

  window.speechSynthesis.speak(utterance);

  // Return a cancellation callback
  return () => {
    window.speechSynthesis.cancel();
    onEnd?.();
  };
}

export function stopBrowserSpeech(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
