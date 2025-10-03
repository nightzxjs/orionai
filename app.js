let GEMINI_API_KEY =
  localStorage.getItem("ai_api_key") ||
  "AIzaSyABqrH6iKRXjJgMpaaST_ZzZfkArriOyQk";
const MODEL = "gemini-2.5-flash";
let history = JSON.parse(localStorage.getItem("ai_history") || "[]");
const css = `
      .ai-fab{position:fixed;bottom:24px;right:24px;width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);display:flex;justify-content:center;align-items:center;z-index:10000;cursor:pointer;transition:transform .3s ease;border:none;}
      .ai-fab:hover{transform:translateY(-4px);}
      .ai-fab:active{transform:translateY(-2px);}
      .ai-lens-btn{position:fixed;bottom:24px;right:100px;width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%);display:flex;justify-content:center;align-items:center;z-index:10000;cursor:pointer;transition:transform .3s ease;border:none;}
      .ai-lens-btn:hover{transform:translateY(-4px);}
      .ai-lens-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:9999;cursor:crosshair;}
      .ai-lens-overlay.active{display:block;}
      .ai-selection-box{position:absolute;border:2px dashed #667eea;background:rgba(102,126,234,.2);display:none;pointer-events:none;}
      .ai-lens-hint{position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#1a1a1a;color:#fff;padding:12px 24px;border-radius:8px;border:1px solid #333;font-size:14px;z-index:10000;display:none;}
      .ai-lens-hint.active{display:block;}
      .ai-modal{display:none;position:fixed;z-index:10001;}
      .ai-modal.active{display:block;}
      .ai-modal-content{width:540px;max-height:85vh;background:#1a1a1a;border-radius:16px;padding:0;color:#fff;border:1px solid #333;overflow:hidden;display:flex;flex-direction:column;}
      .ai-header{display:flex;justify-content:space-between;align-items:center;padding:16px 24px;background:#0a0a0a;cursor:move;user-select:none;border-bottom:1px solid #333;}
      .ai-title{font-size:18px;font-weight:700;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
      .ai-header-actions{display:flex;gap:12px;align-items:center;}
      .ai-icon-btn{width:24px;height:24px;cursor:pointer;opacity:.7;transition:opacity .2s;background:none;border:none;padding:0;color:#fff;}
      .ai-icon-btn:hover{opacity:1;}
      .ai-tabs{display:flex;background:#0a0a0a;border-bottom:1px solid #333;}
      .ai-tab{flex:1;padding:12px;text-align:center;cursor:pointer;border:none;background:none;color:#999;font-size:14px;font-weight:600;transition:all .3s;}
      .ai-tab.active{color:#667eea;border-bottom:2px solid #667eea;}
      .ai-tab:hover{color:#fff;}
      .ai-body{padding:24px;overflow-y:auto;flex:1;display:none;}
      .ai-body.active{display:block;}
      .ai-input{width:100%;min-height:100px;border:1px solid #333;border-radius:12px;padding:16px;margin-bottom:16px;background:#0a0a0a;color:#fff;resize:vertical;font-size:15px;font-family:inherit;transition:border-color .3s;}
      .ai-input:focus{outline:none;border-color:#667eea;}
      .ai-input::placeholder{color:#666;}
      .ai-send-btn{width:100%;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;font-weight:600;font-size:16px;border:none;padding:14px;border-radius:12px;cursor:pointer;transition:opacity .3s ease;margin-bottom:16px;}
      .ai-send-btn:hover:not(:disabled){opacity:.9;}
      .ai-send-btn:disabled{opacity:.5;cursor:not-allowed;}
      .ai-skeleton{display:none;margin-top:20px;}
      .ai-skeleton.active{display:block;}
      .ai-skeleton-line{height:16px;background:linear-gradient(90deg,#1a1a1a 0%,#2a2a2a 50%,#1a1a1a 100%);background-size:200% 100%;animation:skeleton-loading 1.5s ease-in-out infinite;border-radius:4px;margin-bottom:12px;}
      .ai-skeleton-line:nth-child(1){width:95%;}
      .ai-skeleton-line:nth-child(2){width:88%;}
      .ai-skeleton-line:nth-child(3){width:92%;}
      .ai-skeleton-line:nth-child(4){width:78%;}
      .ai-skeleton-line:nth-child(5){width:85%;}
      @keyframes skeleton-loading{0%{background-position:200% 0;}100%{background-position:-200% 0;}}
      .ai-response{margin-top:20px;max-height:300px;overflow-y:auto;padding:20px;background:#0a0a0a;border-radius:12px;border-left:3px solid #667eea;display:none;}
      .ai-response.active{display:block;}
      .ai-response-title{font-weight:700;margin-bottom:12px;font-size:16px;color:#667eea;}
      .ai-response-text{line-height:1.6;color:#e0e0e0;white-space:pre-wrap;word-wrap:break-word;}
      .ai-captured-text{max-width:100%;border-radius:8px;margin-bottom:16px;border:1px solid #333;padding:12px;background:#0a0a0a;color:#e0e0e0;font-size:14px;white-space:pre-wrap;}
      .ai-config-group{margin-bottom:20px;}
      .ai-config-label{display:block;margin-bottom:8px;color:#999;font-size:14px;font-weight:600;}
      .ai-config-input{width:100%;border:1px solid #333;border-radius:8px;padding:12px;background:#0a0a0a;color:#fff;font-size:14px;}
      .ai-config-input:focus{outline:none;border-color:#667eea;}
      .ai-save-btn{background:#667eea;color:#fff;border:none;padding:12px 24px;border-radius:8px;cursor:pointer;font-weight:600;transition:opacity .3s;}
      .ai-save-btn:hover{opacity:.9;}
      .ai-history-item{background:#0a0a0a;border:1px solid #333;border-radius:12px;padding:16px;margin-bottom:12px;}
      .ai-history-question{font-weight:600;color:#667eea;margin-bottom:8px;font-size:14px;}
      .ai-history-answer{color:#e0e0e0;font-size:13px;line-height:1.5;}
      .ai-history-date{color:#666;font-size:12px;margin-top:8px;}
      .ai-history-empty{text-align:center;color:#666;padding:40px 20px;font-size:14px;}
      .ai-clear-history{background:#333;color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:13px;margin-top:12px;transition:opacity .3s;}
      .ai-clear-history:hover{opacity:.8;}
      .ai-response::-webkit-scrollbar,.ai-body::-webkit-scrollbar{width:8px;}
      .ai-response::-webkit-scrollbar-track,.ai-body::-webkit-scrollbar-track{background:#1a1a1a;border-radius:4px;}
      .ai-response::-webkit-scrollbar-thumb,.ai-body::-webkit-scrollbar-thumb{background:#333;border-radius:4px;}
      .robot-svg{width:32px;height:32px;fill:none;stroke:#fff;stroke-width:2;}
      .lens-svg{width:32px;height:32px;fill:none;stroke:#fff;stroke-width:2;}
      `;
const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);
const fab = document.createElement("div");
fab.className = "ai-fab";
fab.innerHTML =
  '<svg class="robot-svg" viewBox="0 0 24 24"><path d="M9 12H15M9 12V15M15 12V15M9 12V9M15 12V9M12 17V19M12 7V5M7 19H17M7 5H17M7 19C7 19.5523 7.44772 20 8 20H16C16.5523 20 17 19.5523 17 19M7 5C7 4.44772 7.44772 4 8 4H16C16.5523 4 17 4.44772 17 5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
document.body.appendChild(fab);
const lensBtn = document.createElement("div");
lensBtn.className = "ai-lens-btn";
lensBtn.innerHTML =
  '<svg class="lens-svg" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="#fff" stroke-width="2"/><path d="M21 21l-4.35-4.35" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M11 8v6M8 11h6" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>';
document.body.appendChild(lensBtn);
const lensOverlay = document.createElement("div");
lensOverlay.className = "ai-lens-overlay";
document.body.appendChild(lensOverlay);
const selectionBox = document.createElement("div");
selectionBox.className = "ai-selection-box";
lensOverlay.appendChild(selectionBox);
const lensHint = document.createElement("div");
lensHint.className = "ai-lens-hint";
lensHint.textContent =
  "Arraste para selecionar uma área da tela • ESC para cancelar";
document.body.appendChild(lensHint);
const modal = document.createElement("div");
modal.className = "ai-modal";
modal.innerHTML = `<div class="ai-modal-content">
      <div class="ai-header">
      <div class="ai-title">OrionAI - by NGX1305</div>
      <div class="ai-header-actions">
      <svg class="ai-icon-btn ai-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
      </div>
      </div>
      <div class="ai-tabs">
      <button class="ai-tab active" data-tab="chat">Chat</button>
      <button class="ai-tab" data-tab="history">Histórico</button>
      <button class="ai-tab" data-tab="config">Configurações</button>
      </div>
      <div class="ai-body active" data-body="chat">
      <textarea class="ai-input" placeholder="Digite sua pergunta aqui..."></textarea>
      <button class="ai-send-btn">Enviar Pergunta</button>
      <div class="ai-skeleton">
      <div class="ai-skeleton-line"></div>
      <div class="ai-skeleton-line"></div>
      <div class="ai-skeleton-line"></div>
      <div class="ai-skeleton-line"></div>
      <div class="ai-skeleton-line"></div>
      </div>
      <div class="ai-response">
      <div class="ai-response-title">💬 Resposta</div>
      <div class="ai-response-text"></div>
      </div>
      </div>
      <div class="ai-body" data-body="history">
      <div class="ai-history-container"></div>
      </div>
      <div class="ai-body" data-body="config">
      <div class="ai-config-group">
      <label class="ai-config-label">API Key do Gemini</label>
      <input type="text" class="ai-config-input ai-api-key-input" value="${GEMINI_API_KEY}" placeholder="Cole sua API Key aqui">
      </div>
      <button class="ai-save-btn">Salvar Configurações</button>
      </div>
      </div>`;
document.body.appendChild(modal);
const input = modal.querySelector(".ai-input"),
  sendBtn = modal.querySelector(".ai-send-btn"),
  skeleton = modal.querySelector(".ai-skeleton"),
  response = modal.querySelector(".ai-response"),
  responseText = modal.querySelector(".ai-response-text"),
  closeIcon = modal.querySelector(".ai-close-icon"),
  header = modal.querySelector(".ai-header"),
  tabs = modal.querySelectorAll(".ai-tab"),
  bodies = modal.querySelectorAll(".ai-body"),
  apiKeyInput = modal.querySelector(".ai-api-key-input"),
  saveBtn = modal.querySelector(".ai-save-btn"),
  historyContainer = modal.querySelector(".ai-history-container"),
  chatBody = modal.querySelector('[data-body="chat"]');
let offsetX = 0,
  offsetY = 0,
  isDragging = false;
header.addEventListener("mousedown", (e) => {
  if (e.target.closest(".ai-icon-btn")) return;
  isDragging = true;
  offsetX = e.clientX - modal.getBoundingClientRect().left;
  offsetY = e.clientY - modal.getBoundingClientRect().top;
  header.style.cursor = "grabbing";
});
document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const x = e.clientX - offsetX;
  const y = e.clientY - offsetY;
  modal.style.left = x + "px";
  modal.style.top = y + "px";
  modal.style.transform = "none";
});
document.addEventListener("mouseup", () => {
  if (isDragging) {
    isDragging = false;
    header.style.cursor = "move";
  }
});
let isSelecting = false,
  startX,
  startY;
lensBtn.addEventListener("click", () => {
  lensOverlay.classList.add("active");
  lensHint.classList.add("active");
});
lensOverlay.addEventListener("mousedown", (e) => {
  isSelecting = true;
  startX = e.clientX;
  startY = e.clientY;
  selectionBox.style.left = startX + "px";
  selectionBox.style.top = startY + "px";
  selectionBox.style.width = "0px";
  selectionBox.style.height = "0px";
  selectionBox.style.display = "block";
});
lensOverlay.addEventListener("mousemove", (e) => {
  if (!isSelecting) return;
  const currentX = e.clientX;
  const currentY = e.clientY;
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);
  const left = Math.min(startX, currentX);
  const top = Math.min(startY, currentY);
  selectionBox.style.left = left + "px";
  selectionBox.style.top = top + "px";
  selectionBox.style.width = width + "px";
  selectionBox.style.height = height + "px";
});
lensOverlay.addEventListener("mouseup", async (e) => {
  if (!isSelecting) return;
  isSelecting = false;
  const endX = e.clientX;
  const endY = e.clientY;
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);
  if (width < 20 || height < 20) {
    lensOverlay.classList.remove("active");
    lensHint.classList.remove("active");
    selectionBox.style.display = "none";
    return;
  }
  const left = Math.min(startX, endX);
  const top = Math.min(startY, endY);
  const right = left + width;
  const bottom = top + height;
  lensOverlay.classList.remove("active");
  lensHint.classList.remove("active");
  selectionBox.style.display = "none";
  const extractedText = await extractTextFromArea(left, top, right, bottom);
  openModalWithText(extractedText);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lensOverlay.classList.contains("active")) {
    lensOverlay.classList.remove("active");
    lensHint.classList.remove("active");
    selectionBox.style.display = "none";
    isSelecting = false;
  }
});
async function extractTextFromArea(left, top, right, bottom) {
  let text = "";
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  let node;
  while ((node = walker.nextNode())) {
    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = Array.from(range.getClientRects());
    for (let rect of rects) {
      if (
        rect.left < right &&
        rect.right > left &&
        rect.top < bottom &&
        rect.bottom > top
      ) {
        text += node.textContent.trim() + " ";
        break;
      }
    }
  }
  return text.trim();
}
function openModalWithText(text) {
  modal.style.left = "50%";
  modal.style.top = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.classList.add("active");
  tabs.forEach((t) => t.classList.remove("active"));
  bodies.forEach((b) => b.classList.remove("active"));
  tabs[0].classList.add("active");
  chatBody.classList.add("active");
  const existingText = chatBody.querySelector(".ai-captured-text");
  if (existingText) existingText.remove();
  const textDiv = document.createElement("div");
  textDiv.textContent = text;
  textDiv.className = "ai-captured-text";
  chatBody.insertBefore(textDiv, input);
  input.value = `Analise este texto: ${text}`;
  input.focus();
}
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const targetTab = tab.dataset.tab;
    tabs.forEach((t) => t.classList.remove("active"));
    bodies.forEach((b) => b.classList.remove("active"));
    tab.classList.add("active");
    modal.querySelector(`[data-body="${targetTab}"]`).classList.add("active");
    if (targetTab === "history") renderHistory();
  });
});
function renderHistory() {
  if (history.length === 0) {
    historyContainer.innerHTML =
      '<div class="ai-history-empty">Nenhum histórico ainda. Faça sua primeira pergunta!</div>';
    return;
  }
  historyContainer.innerHTML =
    history
      .map(
        (item) => `
      <div class="ai-history-item">
      <div class="ai-history-question">❓ ${item.question}</div>
      <div class="ai-history-answer">${item.answer}</div>
      <div class="ai-history-date">${new Date(item.date).toLocaleString(
        "pt-BR"
      )}</div>
      </div>
      `
      )
      .reverse()
      .join("") + `<button class="ai-clear-history">Limpar Histórico</button>`;
  const clearBtn = historyContainer.querySelector(".ai-clear-history");
  clearBtn?.addEventListener("click", () => {
    if (confirm("Deseja limpar todo o histórico?")) {
      history = [];
      localStorage.setItem("ai_history", JSON.stringify(history));
      renderHistory();
    }
  });
}
saveBtn.addEventListener("click", () => {
  const newKey = apiKeyInput.value.trim();
  if (!newKey) {
    alert("Por favor, insira uma API Key válida.");
    return;
  }
  GEMINI_API_KEY = newKey;
  localStorage.setItem("ai_api_key", newKey);
  alert("Configurações salvas com sucesso!");
});
fab.addEventListener("click", () => {
  if (!modal.classList.contains("active")) {
    modal.style.left = "50%";
    modal.style.top = "50%";
    modal.style.transform = "translate(-50%, -50%)";
  }
  modal.classList.add("active");
  input.focus();
});
closeIcon.addEventListener("click", () => {
  modal.classList.remove("active");
});
sendBtn.addEventListener("click", async () => {
  const prompt = input.value.trim();
  if (!prompt) {
    alert("Por favor, digite sua pergunta.");
    return;
  }
  sendBtn.disabled = true;
  sendBtn.textContent = "Carregando...";
  skeleton.classList.add("active");
  response.classList.remove("active");
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const body = {
      contents: [
        {
          parts: [
            {
              text: `responda essa pergunta limitando-se a 200 palavras: ${prompt}`,
            },
          ],
        },
      ],
    };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const text = data.candidates[0].content.parts[0].text;
    responseText.textContent = text;
    response.classList.add("active");
    history.push({
      question: prompt,
      answer: text,
      date: new Date().toISOString(),
    });
    localStorage.setItem("ai_history", JSON.stringify(history));
    input.value = "";
    const capturedText = chatBody.querySelector(".ai-captured-text");
    if (capturedText) capturedText.remove();
  } catch (error) {
    alert(`Erro ao processar sua pergunta: ${error.message}`);
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "Enviar Pergunta";
    skeleton.classList.remove("active");
  }
});
input.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Enter") {
    sendBtn.click();
  }
});
