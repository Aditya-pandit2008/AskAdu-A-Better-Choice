// chat.js — Full Chat + STT + Streaming TTS + Queue + Auto-read + Controls (No Waveform)
// UX: shows "Listening..." and "Thinking..." states + Theme toggle

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.main-search-input');
  const buttons = Array.from(document.querySelectorAll('.main-search-option'));
  const searchButton = buttons.find(btn => btn.textContent.includes('Search'));
  const voiceBtn = document.getElementById('voiceBtn');
  const speakBtn = document.getElementById('speakBtn');
  const stopBtn = document.getElementById('stopBtn');
  const voiceSelect = document.getElementById('voiceSelect');
  const themeToggle = document.getElementById('themeToggle');

  if (!searchInput) return;

// ===== Theme Toggle (Light → Gradient → Gray) =====
const THEMES = ['light', 'gradient', 'gray'];

function applyTheme(theme) {
  document.body.classList.remove('gradient', 'gray');

  if (theme === 'gradient') document.body.classList.add('gradient');
  if (theme === 'gray') document.body.classList.add('gray');

  localStorage.setItem('theme', theme);

  if (themeToggle) {
    themeToggle.textContent =
      theme === 'light' ? '🌤️ Light' :
      theme === 'gradient' ? '🌈 Gradient' :
      '🌫️ Gray';
  }
}

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.onclick = () => {
    const current = localStorage.getItem('theme') || 'light';
    const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
    applyTheme(next);
  };
}

  let conversationHistory = [];
  const MAX_HISTORY = 10;

  const SYSTEM_MESSAGE = {
    role: 'system',
    content: `
You are a friendly, supportive AI friend.
you are also a romantic AI.
Use a warm, casual tone.
Use light emojis naturally (like 🙂🔥🚀) but don’t overdo it.
Explain things simply and clearly.
Be patient and reassuring if the user seems confused.
Keep replies concise and practical.
`
  };

  // ===== Chat container =====
  let chatContainer = document.getElementById('ai-chat-container');
  if (!chatContainer) {
    chatContainer = document.createElement('div');
    chatContainer.id = 'ai-chat-container';
    chatContainer.style.border = '1px solid rgba(0,0,0,0.1)';
    chatContainer.style.borderRadius = '12px';
    chatContainer.style.padding = '12px';
    chatContainer.style.marginTop = '16px';
    chatContainer.style.maxHeight = '450px';
    chatContainer.style.overflow = 'auto';
    chatContainer.style.background = 'transparent';
    searchInput.parentNode.insertBefore(chatContainer, searchInput.nextSibling);
  }

  // ===== Timestamp helper =====
  function getTimestamp() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function appendMessage(role, text) {
    const wrapper = document.createElement('div');
    wrapper.style.margin = '10px 0';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = role === 'user' ? 'flex-end' : 'flex-start';

    const time = document.createElement('small');
    time.textContent = getTimestamp();
    time.style.opacity = '0.6';
    time.style.fontSize = '11px';
    time.style.color = document.body.classList.contains('gradient') ? '#fff' : '#111';
    time.style.marginBottom = '4px';

    const bubble = document.createElement('div');
    bubble.style.padding = '10px 12px';
    bubble.style.borderRadius = '14px';
    bubble.style.maxWidth = '85%';
    bubble.style.whiteSpace = 'pre-wrap';
    bubble.style.lineHeight = '1.5';
    bubble.style.border = '1px solid rgba(0,0,0,0.08)';
    bubble.style.color = document.body.classList.contains('gradient') ? '#fff' : '#111';
    bubble.style.background = role === 'user'
      ? (document.body.classList.contains('gradient') ? 'rgba(0,0,0,0.45)' : '#e5e7eb')
      : (document.body.classList.contains('gradient') ? 'rgba(255,255,255,0.15)' : '#f3f4f6');

    // Markdown rendering fix
    if (window.marked) {
      bubble.innerHTML = marked.parse(text);
    } else {
      bubble.textContent = text;
    }

    wrapper.appendChild(time);
    wrapper.appendChild(bubble);
    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // ===== Status message =====
  let statusEl = null;

  function showStatus(text) {
    if (!statusEl) {
      statusEl = document.createElement('div');
      statusEl.style.margin = '8px 0';
      statusEl.style.fontSize = '13px';
      statusEl.style.opacity = '0.85';
      statusEl.style.color = document.body.classList.contains('gradient') ? '#fff' : '#111';
      chatContainer.appendChild(statusEl);
    }
    statusEl.textContent = text;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function clearStatus() {
    if (statusEl) {
      statusEl.remove();
      statusEl = null;
    }
  }

  // ===== Clear chat =====
  const clearBtn = document.createElement('button');
  clearBtn.textContent = '🧹 Clear Chat';
  clearBtn.className = 'main-search-option';
  clearBtn.onclick = () => {
    chatContainer.innerHTML = '';
    conversationHistory = [];
  };

  const optionsBar = document.querySelector('.main-search-options');
  if (optionsBar && !document.getElementById('clearChatBtn')) {
    clearBtn.id = 'clearChatBtn';
    optionsBar.appendChild(clearBtn);
  }

  // ===== TTS Queue =====
  let ttsQueue = [];
  let isSpeaking = false;
  let currentAudio = null;

  function detectLanguage(text) {
    if (/[\u0900-\u097F]/.test(text)) return 'hi';
    if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
    if (/[\u3040-\u30FF]/.test(text)) return 'ja';
    return 'en';
  }

  async function speakTextStream(text) {
    const voiceId = voiceSelect ? voiceSelect.value : 'EXAVITQu4vr4xnSDxMaL';
    const language = detectLanguage(text);

    const res = await fetch('/api/tts-stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice_id: voiceId, language })
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    currentAudio = new Audio(url);
    return new Promise(resolve => {
      currentAudio.onended = resolve;
      currentAudio.play();
    });
  }

  async function processQueue() {
    if (isSpeaking || ttsQueue.length === 0) return;
    isSpeaking = true;
    const next = ttsQueue.shift();
    try {
      await speakTextStream(next);
    } finally {
      isSpeaking = false;
      processQueue();
    }
  }

  if (stopBtn) {
    stopBtn.onclick = () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      ttsQueue = [];
      isSpeaking = false;
    };
  }

  // ===== Send message =====
  async function sendMessage(text) {
    if (!text || !text.trim()) return;

    appendMessage('user', text);
    conversationHistory.push({ role: 'user', content: text });
    if (conversationHistory.length > MAX_HISTORY) conversationHistory = conversationHistory.slice(-MAX_HISTORY);
    searchInput.value = '';

    showStatus('🤖 Thinking...');

    try {
      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [SYSTEM_MESSAGE, ...conversationHistory] })
      });
      const data = await res.json();

      clearStatus();

      const reply = data.reply || 'No response';
      appendMessage('assistant', reply);
      conversationHistory.push({ role: 'assistant', content: reply });
      window.lastReply = reply;

      ttsQueue.push(reply);
      processQueue();

    } catch (e) {
      clearStatus();
      appendMessage('assistant', 'Oops, something went wrong 😅 Try again in a sec.');
    }
  }

  // ===== Events =====
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage(searchInput.value);
  });

  if (searchButton) searchButton.addEventListener('click', () => sendMessage(searchInput.value));

  // ===== STT =====
  if (voiceBtn) {
    let mediaRecorder;
    let chunks = [];

    voiceBtn.addEventListener('click', async () => {
      showStatus('🎙️ Listening...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorder = new MediaRecorder(stream);
      chunks = [];
      mediaRecorder.ondataavailable = e => chunks.push(e.data);

      mediaRecorder.onstop = async () => {
        clearStatus();
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const fd = new FormData();
        fd.append('audio', blob);
        const res = await fetch('/api/stt', { method: 'POST', body: fd });
        const data = await res.json();
        searchInput.value = data.text || '';
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 4000);
    });
  }

  // ===== Manual speak =====
  if (speakBtn) {
    speakBtn.onclick = () => {
      if (window.lastReply) {
        ttsQueue.push(window.lastReply);
        processQueue();
      }
    };
  }
});
