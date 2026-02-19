// chat.js — Full Chat + FREE STT + FREE TTS (Hindi + Marathi + English) + Queue + Auto-read + Controls (No Waveform)
// UX: shows "Listening..." and "Thinking..." states + Theme toggle

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.main-search-input');
  const buttons = Array.from(document.querySelectorAll('.main-search-option'));
  const searchButton = buttons.find(btn => btn.textContent.includes('Search'));
  const voiceBtn = document.getElementById('voiceBtn');
  const speakBtn = document.getElementById('speakBtn');
  const stopBtn = document.getElementById('stopBtn');
  const voiceSelect = document.getElementById('voiceSelect'); // kept for UI (not used)
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

    if (window.marked) bubble.innerHTML = marked.parse(text);
    else bubble.textContent = text;

    wrapper.appendChild(time);
    wrapper.appendChild(bubble);
    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

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

  // ===== TTS Queue (FREE Browser TTS) =====
  let ttsQueue = [];
  let isSpeaking = false;

  function detectLangForTTS(text) {
    if (/[\u0900-\u097F]/.test(text)) return 'hi-IN'; // Hindi/Marathi script
    return 'en-IN';
  }

  function speakFreeTTS(text) {
    if (!('speechSynthesis' in window)) return Promise.resolve();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = detectLangForTTS(text);
    utter.rate = 1;
    utter.pitch = 1;

    return new Promise(resolve => {
      utter.onend = resolve;
      window.speechSynthesis.speak(utter);
    });
  }

  async function processQueue() {
    if (isSpeaking || ttsQueue.length === 0) return;
    isSpeaking = true;
    const next = ttsQueue.shift();
    try {
      await speakFreeTTS(next);
    } finally {
      isSpeaking = false;
      processQueue();
    }
  }

  if (stopBtn) {
    stopBtn.onclick = () => {
      window.speechSynthesis.cancel();
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
    } catch {
      clearStatus();
      appendMessage('assistant', 'Oops, something went wrong 😅 Try again in a sec.');
    }
  }

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage(searchInput.value);
  });
  if (searchButton) searchButton.addEventListener('click', () => sendMessage(searchInput.value));

  // ===== FREE STT (Hindi + Marathi + English) =====
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (voiceBtn) {
    if (!SpeechRecognition) {
      voiceBtn.disabled = true;
      voiceBtn.textContent = '❌ STT';
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      voiceBtn.onclick = () => {
        showStatus('🎙️ Listening...');
        recognition.lang = 'mr-IN'; // Marathi (change to hi-IN or en-IN if needed)
        recognition.start();
      };

      recognition.onresult = (e) => {
        let finalText = '';
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) finalText += t + ' ';
          else interim += t;
        }
        searchInput.value = finalText + interim;
        if (finalText.trim()) sendMessage(finalText);
      };

      recognition.onerror = () => clearStatus();
      recognition.onend = () => clearStatus();
    }
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
