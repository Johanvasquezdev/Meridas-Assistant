(function() {
  'use strict';

  // MERIDAS Operational Intelligence Widget - Standalone Embed Script
  // Scoped to avoid global namespace pollution
  const MRD_VERSION = '2.0.0';
  const STORAGE_KEY = 'mrd_session_id';
  const LEGACY_STORAGE_KEY = 'smk_session_id';
  
  // Configuration read from script tag
  const scriptTag = document.currentScript || Array.from(document.querySelectorAll('script')).find(s => 
    s.src.includes('meridas-widget.js') || s.src.includes('supportmind-widget.js')
  );
  
  const apiKey = scriptTag 
    ? (scriptTag.getAttribute('data-api-key') || scriptTag.getAttribute('data-key')) 
    : (window.MeridasApiKey || window.SupportMindApiKey);
    
  const backendUrl = scriptTag 
    ? (scriptTag.getAttribute('data-backend-url') || scriptTag.getAttribute('data-url')) 
    : (window.MeridasBackendUrl || window.SupportMindBackendUrl || 'http://localhost:3001');

  if (!apiKey) {
    console.error('[MERIDAS] Operational API key not detected. Provide data-api-key attribute on the script tag.');
    return;
  }

  // --- State ---
  let isOpen = false;
  let config = null;
  let sessionId = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY) || crypto.randomUUID();
  let messages = [];

  // Persist session ID
  localStorage.setItem(STORAGE_KEY, sessionId);

  // --- UI Elements ---
  let shadowRoot = null;
  let container = null;
  let launcher = null;
  let chatWindow = null;
  let messageList = null;
  let inputField = null;

  // --- Styles ---
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

    :host {
      --mrd-primary: #9E1B32;
      --mrd-primary-hover: #BA243F;
      --mrd-gold: #C9A227;
      --mrd-gold-light: #DFB943;
      --mrd-bg: #151417;
      --mrd-surface: #1C1B20;
      --mrd-surface-card: #222027;
      --mrd-text: #F7F3EA;
      --mrd-text-muted: #8C8A94;
      --mrd-border: #2A2832;
      --mrd-border-gold: rgba(201, 162, 39, 0.35);
      --mrd-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.05);
      font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      z-index: 999999;
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: block;
    }

    .mrd-ai-notice {
      background: rgba(201, 162, 39, 0.08);
      border-bottom: 1px solid rgba(201, 162, 39, 0.2);
      padding: 7px 16px;
      font-size: 11px;
      color: var(--mrd-gold);
      display: flex;
      align-items: center;
      gap: 6px;
      line-height: 1.35;
      font-weight: 500;
      flex-shrink: 0;
    }

    .mrd-ai-notice svg {
      flex-shrink: 0;
    }

    :host([data-position="bottom-left"]) {
      right: auto;
      left: 24px;
    }

    .mrd-launcher {
      width: 58px;
      height: 58px;
      border-radius: 16px;
      background: linear-gradient(135deg, var(--mrd-primary) 0%, #6E1222 100%);
      box-shadow: 0 8px 24px -4px rgba(158, 27, 50, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
      border: 1px solid var(--mrd-border-gold);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      outline: none;
      user-select: none;
    }

    .mrd-launcher:hover {
      transform: translateY(-2px) scale(1.03);
      box-shadow: 0 12px 28px -4px rgba(158, 27, 50, 0.55), 0 0 0 1px var(--mrd-gold);
    }

    .mrd-launcher:active {
      transform: scale(0.96);
    }

    .mrd-launcher svg {
      width: 26px;
      height: 26px;
      color: var(--mrd-text);
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .mrd-launcher.open svg.icon-compass {
      transform: rotate(180deg) scale(0);
      display: none;
    }

    .mrd-launcher.open svg.icon-close {
      display: block;
      transform: rotate(0deg) scale(1);
    }

    .mrd-launcher:not(.open) svg.icon-close {
      display: none;
    }

    .mrd-chat-window {
      position: absolute;
      bottom: 74px;
      right: 0;
      width: 410px;
      height: 620px;
      max-height: calc(100vh - 110px);
      background: var(--mrd-bg);
      border-radius: 18px;
      box-shadow: var(--mrd-shadow);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      transform: translateY(16px) scale(0.96);
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid var(--mrd-border);
    }

    :host([data-position="bottom-left"]) .mrd-chat-window {
      right: auto;
      left: 0;
    }

    .mrd-chat-window.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }

    .mrd-header {
      padding: 16px 20px;
      background: var(--mrd-surface);
      border-bottom: 1px solid var(--mrd-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
    }

    .mrd-header::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, var(--mrd-border-gold) 50%, transparent 100%);
    }

    .mrd-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .mrd-crest {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(158, 27, 50, 0.2);
      border: 1px solid var(--mrd-border-gold);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mrd-crest svg {
      width: 18px;
      height: 18px;
      color: var(--mrd-gold);
    }

    .mrd-header-info h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--mrd-text);
    }

    .mrd-header-info p {
      margin: 2px 0 0 0;
      font-size: 11px;
      color: var(--mrd-text-muted);
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .mrd-status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 8px #10B981;
      display: inline-block;
    }

    .mrd-close-btn {
      background: transparent;
      border: 1px solid transparent;
      border-radius: 8px;
      color: var(--mrd-text-muted);
      cursor: pointer;
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .mrd-close-btn:hover {
      background: var(--mrd-surface-card);
      border-color: var(--mrd-border);
      color: var(--mrd-text);
    }

    .mrd-message-list {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding: 18px 18px 32px 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      scroll-behavior: smooth;
      scrollbar-width: thin;
      scrollbar-color: var(--mrd-border) transparent;
    }

    .mrd-message-list::-webkit-scrollbar {
      width: 5px;
    }

    .mrd-message-list::-webkit-scrollbar-thumb {
      background: var(--mrd-border);
      border-radius: 6px;
    }

    .mrd-message {
      max-width: 88%;
      padding: 12px 15px;
      font-size: 13.5px;
      line-height: 1.55;
      word-wrap: break-word;
      animation: mrd-fade-in 0.25s ease-out;
    }

    @keyframes mrd-fade-in {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .mrd-message-user {
      align-self: flex-end;
      background: var(--mrd-primary);
      color: var(--mrd-text);
      border-radius: 14px 14px 2px 14px;
      border: 1px solid var(--mrd-border-gold);
      box-shadow: 0 4px 12px rgba(158, 27, 50, 0.25);
    }

    .mrd-message-bot {
      align-self: flex-start;
      background: var(--mrd-surface);
      color: var(--mrd-text);
      border-radius: 14px 14px 14px 2px;
      border: 1px solid var(--mrd-border);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .mrd-verified-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--mrd-gold);
      background: rgba(201, 162, 39, 0.12);
      border: 1px solid var(--mrd-border-gold);
      padding: 2px 6px;
      border-radius: 4px;
      margin-bottom: 8px;
    }

    .mrd-sources-tray {
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.07);
      font-size: 11px;
    }

    .mrd-sources-label {
      color: var(--mrd-text-muted);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .mrd-source-chip {
      display: block;
      background: var(--mrd-surface-card);
      border: 1px solid var(--mrd-border);
      border-radius: 6px;
      padding: 4px 8px;
      margin-top: 4px;
      color: var(--mrd-gold);
      font-family: monospace;
      font-size: 10.5px;
      text-decoration: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mrd-input-area {
      padding: 14px 16px;
      background: var(--mrd-surface);
      border-top: 1px solid var(--mrd-border);
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .mrd-input {
      flex: 1;
      background: var(--mrd-bg);
      border: 1px solid var(--mrd-border);
      border-radius: 10px;
      padding: 11px 14px;
      color: var(--mrd-text);
      font-size: 13.5px;
      outline: none;
      transition: all 0.2s ease;
    }

    .mrd-input::placeholder {
      color: #63616B;
    }

    .mrd-input:focus {
      border-color: var(--mrd-gold);
      box-shadow: 0 0 0 2px rgba(201, 162, 39, 0.15);
    }

    .mrd-send-btn {
      background: var(--mrd-primary);
      color: var(--mrd-text);
      border: 1px solid var(--mrd-border-gold);
      border-radius: 10px;
      width: 42px;
      height: 42px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .mrd-send-btn:hover {
      background: var(--mrd-primary-hover);
      transform: scale(1.04);
    }

    .mrd-send-btn:active {
      transform: scale(0.96);
    }

    .mrd-send-btn svg {
      width: 18px;
      height: 18px;
      color: var(--mrd-gold);
    }

    .mrd-footer {
      padding: 8px 16px;
      text-align: center;
      font-size: 10.5px;
      color: var(--mrd-text-muted);
      background: var(--mrd-bg);
      border-top: 1px solid var(--mrd-border);
      letter-spacing: 0.02em;
    }

    .mrd-footer a {
      color: var(--mrd-gold);
      text-decoration: none;
      font-weight: 600;
    }

    .mrd-footer a:hover {
      text-decoration: underline;
    }

    /* Typing indicator */
    .mrd-typing {
      display: flex;
      gap: 5px;
      padding: 4px 6px;
      align-items: center;
    }

    .mrd-typing span {
      width: 6px;
      height: 6px;
      background: var(--mrd-gold);
      border-radius: 50%;
      animation: mrd-pulse 1.3s infinite ease-in-out both;
    }

    .mrd-typing span:nth-child(2) { animation-delay: 0.18s; }
    .mrd-typing span:nth-child(3) { animation-delay: 0.36s; }

    @keyframes mrd-pulse {
      0%, 80%, 100% { opacity: 0.25; transform: scale(0.85); }
      40% { opacity: 1; transform: scale(1.15); }
    }

    @media (max-width: 480px) {
      :host {
        bottom: 12px;
        right: 12px;
      }
      :host([data-position="bottom-left"]) {
        left: 12px;
      }
      .mrd-chat-window {
        width: calc(100vw - 24px);
        height: calc(100vh - 96px);
        bottom: 68px;
      }
    }
  `;

  // Sanitize header inputs
  const sanitizeHeader = (str) => {
    if (!str) return '';
    return str.replace(/[^\x20-\x7E]/g, '').trim();
  };

  const cleanApiKey = sanitizeHeader(apiKey);
  const cleanBackendUrl = sanitizeHeader(backendUrl).replace(/\/$/, '');

  // --- Initialization ---

  async function init() {
    let host = document.getElementById('meridas-widget-host');
    if (!host) {
      host = document.getElementById('supportmind-widget-host');
    }
    if (!host) {
      host = document.createElement('div');
      host.id = 'meridas-widget-host';
      document.body.appendChild(host);
    }
    
    shadowRoot = host.shadowRoot || host.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = '';

    // Inject styles
    const styleTag = document.createElement('style');
    styleTag.textContent = styles;
    shadowRoot.appendChild(styleTag);

    // Create container
    container = document.createElement('div');
    shadowRoot.appendChild(container);

    // Fetch config
    try {
      const response = await fetch(`${cleanBackendUrl}/widget/config`, {
        headers: { 'x-api-key': cleanApiKey }
      });
      if (response.ok) {
        config = await response.json();
      }
    } catch (e) {
      console.warn('[MERIDAS] Running with default configuration:', e);
    }

    if (config && config.isEnabled === false) return;

    if (config && config.position === 'bottom-left') {
      host.setAttribute('data-position', 'bottom-left');
    }

    renderLauncher();
    renderChatWindow();
    
    // Load historical conversation for session
    loadHistory();
  }

  function renderLauncher() {
    launcher = document.createElement('button');
    launcher.className = 'mrd-launcher';
    launcher.setAttribute('aria-label', 'Open MERIDAS Operational Intelligence Console');
    
    // SVG icons: Compass and Close
    launcher.innerHTML = `
      <svg class="icon-compass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="#C9A227" stroke="none"/>
      </svg>
      <svg class="icon-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    `;
    
    launcher.onclick = toggleChat;
    container.appendChild(launcher);
    
    if (config && config.primaryColor) {
      launcher.style.background = `linear-gradient(135deg, ${config.primaryColor} 0%, #4D0916 100%)`;
      shadowRoot.host.style.setProperty('--mrd-primary', config.primaryColor);
    }
  }

  function renderChatWindow() {
    chatWindow = document.createElement('div');
    chatWindow.className = 'mrd-chat-window';
    
    chatWindow.innerHTML = `
      <div class="mrd-header">
        <div class="mrd-brand">
          <div class="mrd-crest">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/>
            </svg>
          </div>
          <div class="mrd-header-info">
            <h3>${config?.title || 'MERIDAS AI Assistant'}</h3>
            <p><span class="mrd-status-dot"></span> AI Assistant • Policy Verified</p>
          </div>
        </div>
        <button class="mrd-close-btn" title="Close assistant">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="mrd-ai-notice">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span>AI Notice: You are chatting with an AI assistant. Responses are based on official company documentation.</span>
      </div>
      <div class="mrd-message-list" id="mrd-messages">
        <!-- Messages rendered here -->
      </div>
      <div class="mrd-input-area">
        <input type="text" class="mrd-input" placeholder="${config?.placeholder || 'Ask a question about policies or procedures...'}" id="mrd-input" autocomplete="off">
        <button class="mrd-send-btn" id="mrd-send" title="Send message">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
      <div class="mrd-footer">
        Powered by <a href="https://meridas.ai" target="_blank" rel="noopener">MERIDAS AI Assistant</a>
      </div>
    `;

    container.appendChild(chatWindow);
    messageList = chatWindow.querySelector('#mrd-messages');
    inputField = chatWindow.querySelector('#mrd-input');
    
    const sendBtn = chatWindow.querySelector('#mrd-send');
    const closeBtn = chatWindow.querySelector('.mrd-close-btn');

    sendBtn.onclick = sendMessage;
    closeBtn.onclick = toggleChat;
    inputField.onkeydown = (e) => {
      if (e.key === 'Enter') sendMessage();
    };

    // Welcome message if initial launch
    if (messages.length === 0) {
      const welcome = config?.welcomeMessage || 'Hello! I am your MERIDAS AI Assistant. You are chatting with an AI assistant trained on your organization\'s verified policies, SOPs, and operating procedures. How can I assist you today?';
      addMessage('assistant', welcome, [], false);
    }
  }

  function toggleChat() {
    isOpen = !isOpen;
    launcher.classList.toggle('open', isOpen);
    chatWindow.classList.toggle('open', isOpen);
    if (isOpen) {
      setTimeout(() => inputField.focus(), 150);
      scrollToBottom();
    }
  }

  async function loadHistory() {
    try {
      const response = await fetch(`${cleanBackendUrl}/widget/history/${sessionId}`, {
        headers: { 'x-api-key': cleanApiKey }
      });
      if (response.ok) {
        const history = await response.json();
        if (Array.isArray(history) && history.length > 0) {
          messageList.innerHTML = '';
          history.forEach(m => {
            const sources = Array.isArray(m.sources) ? m.sources : [];
            addMessage(m.role, m.content, sources, false);
          });
        }
      }
    } catch (e) {
      console.warn('[MERIDAS] Prior session history unavailable');
    }
  }

  async function sendMessage() {
    const text = inputField.value.trim();
    if (!text) return;

    inputField.value = '';
    addMessage('user', text, [], true);
    
    // Typing indicator
    const typingId = 'typing-' + Date.now();
    const typingMsg = document.createElement('div');
    typingMsg.id = typingId;
    typingMsg.className = 'mrd-message mrd-message-bot';
    typingMsg.innerHTML = '<div class="mrd-typing"><span></span><span></span><span></span></div>';
    messageList.appendChild(typingMsg);
    scrollToBottom();

    try {
      const response = await fetch(`${cleanBackendUrl}/widget/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': cleanApiKey
        },
        body: JSON.stringify({
          message: text,
          sessionId: sessionId,
          conversationHistory: messages.slice(-4).map(m => ({ role: m.role, content: m.content }))
        })
      });

      typingMsg.remove();

      if (response.ok) {
        const data = await response.json();
        addMessage('assistant', data.answer, data.sources || [], true);
      } else {
        addMessage('assistant', 'Unable to retrieve verified evidence for this operational query. Please retry or contact the lead systems custodian.', [], true);
      }
    } catch (e) {
      typingMsg.remove();
      addMessage('assistant', 'Gateway connection error. Verify network connectivity to the MERIDAS endpoint.', [], true);
    }
  }

  function addMessage(role, content, sources = [], save = true) {
    if (save) messages.push({ role, content, sources });
    
    const div = document.createElement('div');
    div.className = `mrd-message mrd-message-${role === 'user' ? 'user' : 'bot'}`;
    
    let html = '';
    if (role === 'assistant') {
      html += `<div class="mrd-verified-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15 8L22 9L17 14L18 21L12 17.5L6 21L7 14L2 9L9 8L12 2Z"/></svg>
        AI Assistant • Verified Policy
      </div>`;
    }
    
    // Safe text formatting (linebreaks to p/br)
    const escapedContent = escapeHtml(content).replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
    html += `<div>${escapedContent}</div>`;

    if (role === 'assistant' && Array.isArray(sources) && sources.length > 0) {
      const uniqueSources = [];
      const seenTitles = new Set();
      for (const s of sources) {
        const title = s.documentTitle || s.metadata?.documentTitle || (s.text ? s.text.slice(0, 35) + '...' : 'Operational Directive');
        if (!seenTitles.has(title)) {
          seenTitles.add(title);
          uniqueSources.push({
            title,
            score: s.score ? Math.round(s.score * 100) : null
          });
        }
      }

      if (uniqueSources.length > 0) {
        html += `<div class="mrd-sources-tray">
          <div class="mrd-sources-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Document Citations:
          </div>
          ${uniqueSources.slice(0, 3).map(s => `
            <span class="mrd-source-chip" title="${escapeHtml(s.title)}">
              ${escapeHtml(s.title)}${s.score ? ` (${s.score}%)` : ''}
            </span>
          `).join('')}
        </div>`;
      }
    }

    div.innerHTML = html;
    messageList.appendChild(div);
    scrollToBottom();
  }

  function escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function scrollToBottom() {
    messageList.scrollTop = messageList.scrollHeight;
  }

  // Ready handler
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
