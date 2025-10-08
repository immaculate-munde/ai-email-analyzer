import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- DOM Elements ---
const analyzeBtn = document.getElementById('analyze-btn');
const messageContent = document.getElementById('message-content');
const resultsSection = document.getElementById('results-section');
const loader = document.getElementById('loader');
const analysisResult = document.getElementById('analysis-result');
const verdictBadge = document.getElementById('verdict-badge');
const reportContent = document.getElementById('report-content');
const replySection = document.getElementById('reply-section');
const generateReplyBtn = document.getElementById('generate-reply-btn');
const replyLoader = document.getElementById('reply-loader');
const replyOutput = document.getElementById('reply-output');
const replyContent = document.getElementById('reply-content');
const copyReplyBtn = document.getElementById('copy-reply-btn');
const copyFeedback = document.getElementById('copy-feedback');
const saveAnalysisBtn = document.getElementById('save-analysis-btn');
const navAnalyzer = document.getElementById('nav-analyzer');
const navSaved = document.getElementById('nav-saved');
const analyzerView = document.getElementById('analyzer-view');
const savedAnalysesView = document.getElementById('saved-analyses-view');
const savedAnalysesList = document.getElementById('saved-analyses-list');
const noSavedAnalysesMsg = document.getElementById('no-saved-analyses');
const themeToggle = document.getElementById('theme-toggle');

// --- State ---
let currentAnalysis = {};
let db, auth, userId;

// --- Theme Setup ---
function applyInitialTheme() {
  if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
applyInitialTheme();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  });
}

// --- Firebase Initialization ---
const appId = typeof window.__app_id !== 'undefined' ? window.__app_id : 'default-app-id';
const firebaseConfig = JSON.parse(typeof window.__firebase_config !== 'undefined' ? window.__firebase_config : '{}');
const app = initializeApp(firebaseConfig);
db = getFirestore(app);
auth = getAuth(app);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userId = user.uid;
    setupRealtimeListener();
  } else {
    try {
      if (typeof window.__initial_auth_token !== 'undefined' && window.__initial_auth_token) {
        await signInWithCustomToken(auth, window.__initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    } catch (e) {
      console.error("Anonymous sign-in failed", e);
    }
  }
});

const API_KEY = "";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

// --- API Call ---
async function callGemini(prompt, systemInstruction, retries = 3, delay = 1000) {
  const payload = { contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: systemInstruction }] } };
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) return result.candidates[0].content.parts[0].text;
      else throw new Error("Invalid response structure from API.");
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delay));
        delay *= 2;
      } else return "Error: Unable to get a response from the AI.";
    }
  }
}

// --- Event Listeners ---
if (analyzeBtn) analyzeBtn.addEventListener('click', handleAnalysis);
if (generateReplyBtn) generateReplyBtn.addEventListener('click', handleReplyGeneration);
if (copyReplyBtn) copyReplyBtn.addEventListener('click', handleCopy);
if (saveAnalysisBtn) saveAnalysisBtn.addEventListener('click', saveAnalysis);
if (navAnalyzer) navAnalyzer.addEventListener('click', () => switchView('analyzer'));
if (navSaved) navSaved.addEventListener('click', () => switchView('saved'));

// --- Core Functions ---
async function handleAnalysis() {
  const messageText = messageContent.value;
  if (messageText.trim() === '') {
    alert('Please paste some message content to analyze.');
    return;
  }
  resultsSection.classList.remove('hidden');
  analysisResult.classList.add('hidden');
  replySection.classList.add('hidden');
  replyOutput.classList.add('hidden');
  loader.style.display = 'flex';

  const systemInstruction = `You are a cybersecurity expert. Analyze the following message.
            Your response MUST be in this exact format:
            Verdict: [LEGIT/SUSPICIOUS/SCAM]
            Report:
            - [A brief, one-sentence summary of the key reason for your verdict]
            - [Another key point]
            - [And another, if necessary]`;

  const aiResponse = await callGemini(messageText, systemInstruction);
  loader.style.display = 'none';
  analysisResult.classList.remove('hidden');
  parseAndDisplayAnalysis(aiResponse);
}

function parseAndDisplayAnalysis(response) {
  const verdictMatch = response.match(/Verdict: (LEGIT|SUSPICIOUS|SCAM)/);
  const reportMatch = response.split(/Report:/);
  const verdict = verdictMatch ? verdictMatch[1] : null;
  const reportText = reportMatch[1] ? reportMatch[1].trim() : "No detailed report generated.";

  currentAnalysis = { content: messageContent.value, verdict, report: reportText, timestamp: serverTimestamp() };

  if (!verdict) {
    verdictBadge.textContent = "Error";
    verdictBadge.className = "px-4 py-1.5 text-sm font-semibold rounded-full bg-gray-200 text-gray-800";
    reportContent.innerHTML = `<p>The AI could not determine a verdict. The response was:</p><p class="mt-2 italic">${response}</p>`;
    return;
  }

  const reportHTML = reportText.split('- ').filter(line => line.trim() !== '').map(line => `<li>${line.trim()}</li>`).join('');
  verdictBadge.textContent = verdict;
  reportContent.innerHTML = `<ul class="list-disc list-inside space-y-1">${reportHTML}</ul>`;

  switch (verdict.toUpperCase()) {
    case 'LEGIT':
      verdictBadge.className = "px-4 py-1.5 text-sm font-semibold rounded-full bg-green-100 text-green-800";
      replySection.classList.remove('hidden');
      break;
    case 'SUSPICIOUS':
      verdictBadge.className = "px-4 py-1.5 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800";
      replySection.classList.add('hidden');
      break;
    case 'SCAM':
      verdictBadge.className = "px-4 py-1.5 text-sm font-semibold rounded-full bg-red-100 text-red-800";
      replySection.classList.add('hidden');
      break;
  }
}

async function handleReplyGeneration() {
  replyLoader.style.display = 'flex';
  replyOutput.classList.add('hidden');
  const systemInstruction = "You are a helpful assistant. Draft a professional and polite reply to the following message. The reply should be ready to send.";
  const aiReply = await callGemini(currentAnalysis.content, systemInstruction);
  replyLoader.style.display = 'none';
  replyContent.value = aiReply;
  replyOutput.classList.remove('hidden');
}

function handleCopy() {
  replyContent.select();
  try {
    document.execCommand('copy');
    copyFeedback.classList.remove('opacity-0');
    setTimeout(() => copyFeedback.classList.add('opacity-0'), 2000);
  } catch (err) { console.error('Failed to copy text: ', err); }
}

// --- Firestore Functions ---
async function saveAnalysis() {
  if (!userId || !currentAnalysis.verdict) return;
  try {
    const collectionPath = `/artifacts/${appId}/users/${userId}/scanned_analyses`;
    await addDoc(collection(db, collectionPath), currentAnalysis);
    switchView('saved');
  } catch (e) { console.error("Error adding document: ", e); }
}

function setupRealtimeListener() {
  if (!userId) return;
  const collectionPath = `/artifacts/${appId}/users/${userId}/scanned_analyses`;
  const q = collection(db, collectionPath);
  onSnapshot(q, (querySnapshot) => {
    savedAnalysesList.innerHTML = '';
    if (querySnapshot.empty) {
      savedAnalysesList.appendChild(noSavedAnalysesMsg);
    } else {
      querySnapshot.forEach((docSnap) => renderSavedAnalysis(docSnap.id, docSnap.data()));
    }
  });
}

function renderSavedAnalysis(id, data) {
  const card = document.createElement('div');
  card.className = "p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700";

  let badgeClass = 'bg-gray-200 text-gray-800';
  if (data.verdict === 'LEGIT') badgeClass = 'bg-green-100 text-green-800';
  if (data.verdict === 'SUSPICIOUS') badgeClass = 'bg-yellow-100 text-yellow-800';
  if (data.verdict === 'SCAM') badgeClass = 'bg-red-100 text-red-800';

  card.innerHTML = `
                <div class="flex justify-between items-start">
                    <span class="px-3 py-1 text-xs font-semibold rounded-full ${badgeClass}">${data.verdict}</span>
                    <button data-id="${id}" class="delete-btn text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-500 transition-colors">&times;</button>
                </div>
                <p class="mt-3 font-semibold text-slate-700 dark:text-slate-300 truncate">Content: ${data.content.substring(0, 80)}...</p>
                <details class="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    <summary class="cursor-pointer font-medium">View Report</summary>
                    <div class="mt-2 pl-4 border-l-2 border-slate-200 dark:border-slate-600">
                        <ul class="list-disc list-inside">${data.report.split('- ').filter(line => line.trim() !== '').map(line => `<li>${line.trim()}</li>`).join('')}</ul>
                    </div>
                </details>`;
  savedAnalysesList.appendChild(card);

  card.querySelector('.delete-btn').addEventListener('click', async (e) => {
    const docId = e.target.getAttribute('data-id');
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      try {
        const docPath = `/artifacts/${appId}/users/${userId}/scanned_analyses/${docId}`;
        await deleteDoc(doc(db, docPath));
      } catch (e) { console.error("Error deleting document: ", e); }
    }
  });
}

// --- View Switching ---
function switchView(view) {
  if (view === 'analyzer') {
    analyzerView.classList.remove('hidden');
    savedAnalysesView.classList.add('hidden');
    navAnalyzer.classList.add('nav-btn-active');
    navSaved.classList.remove('nav-btn-active');
  } else {
    analyzerView.classList.add('hidden');
    savedAnalysesView.classList.remove('hidden');
    navAnalyzer.classList.remove('nav-btn-active');
    navSaved.classList.add('nav-btn-active');
  }
}
