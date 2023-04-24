// Define the questions to be asked by the chatbot
const questions = [
    'What is your name?',
    'What is your favorite color?',
    'What is your favorite food?'
  ];
  let currentQuestionIndex = 0;
  
  // Get DOM elements
  const chatLog = document.getElementById('chat-log');
  const userInput = document.getElementById('user-input');
  const submitBtn = document.getElementById('submit-btn');
  const downloadLogBtn = document.getElementById('download-log');
  
  // Load previous chat log from localStorage if it exists
  if (localStorage.getItem('chatLog')) {
    chatLog.innerHTML = localStorage.getItem('chatLog');
  }
  
  // Ask the first question
  askQuestion();
  
  // Add event listeners
  submitBtn.addEventListener('click', handleUserAnswer);
  downloadLogBtn.addEventListener('click', downloadChatLog);
  
  function askQuestion() {
    if (currentQuestionIndex < questions.length) {
      const question = questions[currentQuestionIndex];
      appendChatMessage('bot', question);
    } else {
      appendChatMessage('bot', 'Thank you for answering all the questions!');
    }
  }
  
  function handleUserAnswer() {
    const answer = userInput.value.trim();
    if (answer === '') return;
  
    appendChatMessage('user', answer);
    userInput.value = '';
  
    currentQuestionIndex++;
    askQuestion();
  }
  
  function appendChatMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(sender);
    messageElement.innerText = sender === 'bot' ? `Bot: ${message}` : `You: ${message}`;
    chatLog.appendChild(messageElement);
  
    // Save the chat log to localStorage
    localStorage.setItem('chatLog', chatLog.innerHTML);
  }
  
  function downloadChatLog() {
    const chatLogText = chatLog.innerText;
    const blob = new Blob([chatLogText], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'chat_log.txt';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  