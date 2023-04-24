import { saveChatLog, loadChatLog } from './storage.js';
import { getQuestions } from './questions.js';


export default class Chatbot {
  constructor(question_set) {
    this.question_set = question_set
    this.chatLog = document.getElementById('chat-log');
    this.userInput = document.getElementById('user-input');
    this.submitBtn = document.getElementById('submit-btn');
    this.downloadLogBtn = document.getElementById('download-log');
    this.questionSetDisplay = document.getElementById('question-set');
    this.currentQuestionIndex = 0;
  }

  async init() {
    this.questionSetDisplay.innerText = `Question set: ${this.question_set}`

    this.questions = await getQuestions(this.question_set);
    console.log('%c >>> chatbot:20 - this.questions\n', 'color: magenta; font-weight: bold;', this.questions);
    
    this.submitBtn.addEventListener('click', this.handleUserAnswer.bind(this));
    this.downloadLogBtn.addEventListener('click', this.downloadChatLog.bind(this));
    this.userInput.addEventListener('keydown', this.handleKeyDown.bind(this));
    
    this.clearLogBtn = document.getElementById('clear-log');
    this.clearLogBtn.addEventListener('click', this.clearLocalStorageLog.bind(this));

    const chatLogData = loadChatLog();
    console.log('%c >>> chatbot:30 - chatLogData\n', 'color: magenta; font-weight: bold;', chatLogData);
  
    chatLogData.forEach(chatMessage => {
      this.appendChatMessage(chatMessage.sender, chatMessage.message, false);
    });
  
    if (!chatLogData?.length) {
        this.askQuestion();
    }
  }

  clearLocalStorageLog() {
    saveChatLog('[]');
    this.chatLog.innerHTML = '';
  }

  handleKeyDown(event) {
    if (event.ctrlKey && event.key === 'Enter') {
      this.handleUserAnswer();
    }
  }

  askQuestion() {
    if (this.currentQuestionIndex < this.questions.length) {
      const question = this.questions[this.currentQuestionIndex];
      this.appendChatMessage('bot', question);
    } else {
      this.appendChatMessage('bot', 'Thank you for answering all the questions!');
    }
  }
  
  handleUserAnswer() {
    const answer = this.userInput.value.trim();
    if (answer === '') return;
  
    this.appendChatMessage('user', answer);
    this.userInput.value = '';
  
    this.currentQuestionIndex++;
    this.askQuestion();
  }
  
  appendChatMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(sender);
    messageElement.innerText = sender === 'bot' ? `Bot: ${message}` : `You: ${message}`;
    this.chatLog.appendChild(messageElement);
  
    setTimeout(() => {
        // Save the chat log to localStorage
        const messageObj = { sender, message };
        const currentLog = loadChatLog();
        currentLog.push(messageObj);
        saveChatLog(currentLog);
    }, 500)

    // Scroll to the latest message
    this.chatLog.scrollTop = this.chatLog.scrollHeight;
  }
  
  
  downloadChatLog() {
    const chatLogText = this.chatLog.innerText;
    const blob = new Blob([chatLogText], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = this.question_set + '-answers-' + new Date() + '.txt';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
}