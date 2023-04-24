export function saveChatLog(chatLog) {
    const jsonChatLog = JSON.stringify(chatLog);
    localStorage.setItem('chatLog', jsonChatLog);
  }
  
  export function loadChatLog() {
    const jsonChatLog = localStorage.getItem('chatLog') || '"[]"';

    if(jsonChatLog.trim() === `"[]"`)
      return []

    return JSON.parse(jsonChatLog)
  }
  