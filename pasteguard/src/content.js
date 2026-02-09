console.log("PasteGuard: Active and listening for pastes.");

document.addEventListener("paste", (event) => {
  // 1. Get the text from the clipboard
  const clipboardData = (event.clipboardData || window.clipboardData);
  const pastedText = clipboardData.getData("text");

  if (!pastedText) return;

  // 2. Check for sensitive data
  let cleanText = pastedText;
  let wasSanitized = false;
  const detectedPatterns = [];

  SENSITIVE_PATTERNS.forEach((rule) => {
    if (rule.regex.test(cleanText)) {
      cleanText = cleanText.replace(rule.regex, rule.replacement);
      wasSanitized = true;
      detectedPatterns.push(rule.name);
    }
  });

  // 3. If nothing sensitive was found, let the default paste happen
  if (!wasSanitized) return;

  // 4. If sensitive data found, STOP the real paste
  event.preventDefault();
  event.stopPropagation();

  // 5. Insert the sanitized text
  // Try multiple methods for better compatibility
  let success = false;
  
  // Method 1: Try execCommand (deprecated but still widely supported)
  if (document.execCommand) {
    success = document.execCommand("insertText", false, cleanText);
  }
  
  // Method 2: Fallback - direct insertion into active element
  if (!success) {
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      const value = activeElement.value;
      activeElement.value = value.substring(0, start) + cleanText + value.substring(end);
      activeElement.selectionStart = activeElement.selectionEnd = start + cleanText.length;
      success = true;
    } else if (activeElement && activeElement.isContentEditable) {
      // For contenteditable divs (like ChatGPT's input)
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(cleanText));
        range.collapse(false);
        success = true;
      }
    }
  }
  
  if (success) {
    showNotification(`🛡️ Redacted: ${detectedPatterns.join(', ')}`, detectedPatterns.length);
  } else {
    console.error("PasteGuard: Failed to insert text programmatically.");
    showNotification("⚠️ Redaction detected but insertion failed", 1, true);
  }
}, true); // Use capturing phase to catch it early

// Enhanced notification helper
function showNotification(message, count = 1, isError = false) {
  const div = document.createElement("div");
  div.style.cssText = `
    position: fixed; bottom: 20px; right: 20px; 
    background: ${isError ? '#ef4444' : '#10b981'}; 
    color: white; padding: 12px 20px; 
    border-radius: 8px; z-index: 9999; 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  div.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 4px;">PasteGuard</div>
    <div style="font-size: 13px; opacity: 0.95;">${message}</div>
  `;
  
  document.body.appendChild(div);
  setTimeout(() => {
    div.style.transition = 'opacity 0.3s ease-out';
    div.style.opacity = '0';
    setTimeout(() => div.remove(), 300);
  }, 3000);
}
