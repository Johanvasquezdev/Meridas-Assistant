const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function transcribeAudio(blob: Blob, token: string): Promise<{ text: string }> {
  const formData = new FormData();
  formData.append('audio', blob);

  const response = await fetch(`${API_URL}/voice/transcribe`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Transcription failed');
  }

  return response.json();
}

export async function synthesizeSpeech(text: string, token: string): Promise<Blob> {
  const response = await fetch(`${API_URL}/voice/synthesize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Synthesis failed');
  }

  return response.blob();
}

export async function summarizeDocument(documentId: string, token: string): Promise<{ audioBlob: Blob, summaryText: string }> {
  const response = await fetch(`${API_URL}/voice/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ documentId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Summarization failed');
  }

  const contentType = response.headers.get('content-type') || '';
  let audioBlob: Blob | null = null;
  let summaryText = '';

  if (contentType.includes('audio')) {
    audioBlob = await response.blob();
  } else {
    try {
      const data = await response.json();
      summaryText = data.summaryText || '';
    } catch (e) {
      // fallback to header
    }
  }

  const summaryTextBase64 = response.headers.get('X-Summary-Text');
  
  // Safely decode UTF-8 from base64 if not already decoded
  if (summaryTextBase64 && !summaryText) {
    try {
      const binaryString = atob(summaryTextBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      summaryText = new TextDecoder().decode(bytes);
    } catch (e) {
      console.error('Failed to decode summary text', e);
    }
  }

  return { audioBlob: audioBlob || new Blob([], { type: 'audio/mpeg' }), summaryText };
}

export async function voiceSearch(blob: Blob, token: string): Promise<{ query: string, results: any[] }> {
  const formData = new FormData();
  formData.append('audio', blob);

  const response = await fetch(`${API_URL}/voice/search`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Voice search failed');
  }

  return response.json();
}
