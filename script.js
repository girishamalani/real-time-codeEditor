// =======================================================
// PURE LOGIC FUNCTIONS (EASY TO TEST)
// =======================================================

/**
 * Parses the raw result from the Judge0 API.
 * @param {object} result - The object from the API.
 * @returns {string} The text to display to the user.
 */
function parseExecutionResult(result) {
  if (!result) return "No output (empty response)";

  // Fix: Check for stdout first, even if it's an empty string.
  if (result.stdout !== null && result.stdout !== undefined) {
    return result.stdout;
  }
  if (result.stderr) return result.stderr; // Show runtime errors
  if (result.compile_output) return result.compile_output; // Show compile errors

  return "No output (empty response)";
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
// We check if the element exists before trying to use it
if (elements.codeTextArea) {
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
   */
  async function handleRunClick() {
    const sourceCode = editor.getValue();
    const langId = elements.languageSelect.value;
    const inputText = elements.customInput.value;

    elements.outputArea.textContent = "Running code...";

    try {
      const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": "c4c59b3062msh0b5fbe8cb7498cfp1bc306jsn783a7a0d024b",
                               "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
        },
        body: JSON.stringify({
          source_code: sourceCode,
          language_id: parseInt(langId),
          stdin: inputText
        })
      });

      const result = await response.json();
      elements.outputArea.textContent = parseExecutionResult(result);

    } catch (error) {
      elements.outputArea.textContent = formatErrorMessage(error);
    }
  }

  /**
   * Handles the "change" event of the language dropdown.
   */
  function handleLanguageChange() {
    const langId = elements.languageSelect.value;
    if (languageMap[langId]) {
      editor.setOption("mode", languageMap[langId]);
    }
  }

  /**
   * Handles the "click" event of the theme toggle button.
   */
  function handleThemeToggle() {
    const isDark = document.body.classList.toggle("dark-mode");
    const editorTheme = getEditorTheme(isDark);
    const storageTheme = getStorageTheme(isDark);

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
  // =======================================================

  // Add listeners only if the elements exist on the page
  if (elements.runButton) {
    elements.runButton.addEventListener("click", handleRunClick);
  }
  if (elements.themeButton) {
    elements.themeButton.addEventListener("click", handleThemeToggle);
  }
  if (elements.languageSelect) {
    elements.languageSelect.addEventListener("change", handleLanguageChange);
  }
  
  window.addEventListener("DOMContentLoaded", loadInitialTheme);

} else {
  console.error("Code editor text area not found!");
}

//
// The 'module.exports' block that was here has been REMOVED
// because it breaks the script in a browser.
//
