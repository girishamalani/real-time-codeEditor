const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  mode: "text/x-c++src",
  lineNumbers: true,
  theme: "default"
});

const languageMap = {
  54: "text/x-c++src",
  62: "text/x-java",
  71: "text/x-python"
};

document.getElementById("language").addEventListener("change", function () {
  const langId = this.value;
  editor.setOption("theme", isDark ? "dracula" : "default");

});

document.getElementById("run").addEventListener("click", async function () {
  const sourceCode = editor.getValue();
  const langId = document.getElementById("language").value;
  const inputText = document.getElementById("custom-input").value;

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
    document.getElementById("output").textContent =
      result.stdout || result.stderr || result.compile_output || "No output";

  } catch (error) {
    document.getElementById("output").textContent = "⚠️ Error: " + error.message;
  }
});
const themeButton = document.getElementById("toggle-theme");

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");
  editor.setOption("theme", isDark ? "dracula" : "default");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    editor.setOption("theme", "dracula");
  }
});
