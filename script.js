// =======================================================
// PURE LOGIC FUNCTIONS (EASY TO TEST)
// These functions are "pure": they don't read from the DOM
// or change global state. They just take input and
// return output. This is what Jest is for.
// =======================================================

/**
 * Parses the raw result from the Judge0 API.
 * @param {object} result - The object from the API.
 * @returns {string} The text to display to the user.
 */
function parseExecutionResult(result) {
  if (!result) return "No output";
  return result.stdout || result.stderr || result.compile_output || "No output";
}

/**
 * Formats an error message for display.
 * @param {Error} error - The error object.
 * @returns {string} A user-friendly error string.
 */
function formatErrorMessage(error) {
  return `⚠️ Error: ${error ? error.message : 'Unknown error'}`;
}

/**
 * Gets the CodeMirror theme name based on dark mode state.
 * @param {boolean} isDark - True if dark mode is active.
 * @returns {string} The name of the CodeMirror theme.
 */
function getEditorTheme(isDark) {
  return isDark ? "dracula" : "default";
}

/**
 * Gets the string value for localStorage based on dark mode state.
 * @param {boolean} isDark - True if dark mode is active.
 * @returns {string} The string to save in localStorage.
 */
function getStorageTheme(isDark) {
  return isDark ? "dark" : "light";
}

// =======================================================
// APPLICATION CODE (DOM & SIDE EFFECTS)
// This is the main code that runs your app.
// It reads from the DOM and calls the "pure" functions.
// =======================================================

// --- Element Selectors ---
const elements = {
  languageSelect: document.getElementById("language"),
  runButton: document.getElementById("run"),
  customInput: document.getElementById("custom-input"),
  outputArea: document.getElementById("output"),
  themeButton: document.getElementById("toggle-theme"),
  codeTextArea: document.getElementById("code")
};

// --- CodeMirror Setup ---
const editor = CodeMirror.fromTextArea(elements.codeTextArea, {
  mode: "text/x-c++src",
  lineNumbers: true,
  theme: "default"
});

const languageMap = {
  54: "text/x-c++src",
  62: "text/x-java",
  71: "text/x-python"
};

// --- Event Handlers ---

/**
 * Handles the click of the "Run Code" button.
 * Fetches data from the API and updates the output.
 */
async function handleRunClick() {
  const sourceCode = editor.getValue();
  const langId = elements.languageSelect.value;
  const inputText = elements.customInput.value;

  elements.outputArea.textContent = "Running code..."; // Give user feedback

  try {
    const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "c4c59b3062msh0b5fbe8cb7498cfp1bc306jsn783a7a0d024b", // Note: Exposing API keys like this is insecure for a public website
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
      },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: parseInt(langId),
        stdin: inputText
      })
    });

    const result = await response.json();
    // Use our PURE function to get the text
    elements.outputArea.textContent = parseExecutionResult(result);

  } catch (error) {
    // Use our PURE function to format the error
    elements.outputArea.textContent = formatErrorMessage(error);
  }
}

/**
 * Handles the "change" event of the language dropdown.
 */
function handleLanguageChange() {
  const langId = elements.languageSelect.value;
  editor.setOption("mode", languageMap[langId]);
}

/**
 * Handles the "click" event of the theme toggle button.
 */
function handleThemeToggle() {
  const isDark = document.body.classList.toggle("dark-mode");
  
  // Use our PURE functions to get theme names
  const editorTheme = getEditorTheme(isDark);
  const storageTheme = getStorageTheme(isDark);

  // Apply side effects
  editor.setOption("theme", editorTheme);
  localStorage.setItem("theme", storageTheme);
}

/**
 * Loads the saved theme from localStorage on page load.
 */
function loadInitialTheme() {
  const savedTheme = localStorage.getItem("theme");
  const isDark = (savedTheme === "dark");

  if (isDark) {
    document.body.classList.add("dark-mode");
    const editorTheme = getEditorTheme(isDark);
    editor.setOption("theme", editorTheme);
  }
}

// =======================================================
// INITIALIZATION
// This runs when the script loads.
// =======================================================

elements.runButton.addEventListener("click", handleRunClick);
elements.themeButton.addEventListener("click", handleThemeToggle);
elements.languageSelect.addEventListener("change", handleLanguageChange);
window.addEventListener("DOMContentLoaded", loadInitialTheme);


// =======================================================
// FOR JEST TESTING
// Export the pure functions so your test file can import them.
// (You must be in a module environment for this to work)
// =======================================================
/*
// Uncomment this if you are using Node.js/Jest environment
module.exports = {
  parseExecutionResult,
  formatErrorMessage,
  getEditorTheme,
  getStorageTheme
};
*/
