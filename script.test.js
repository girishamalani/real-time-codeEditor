// Import the functions you want to test
// (This line assumes you have module.exports setup as shown above)
const {
  parseExecutionResult,
  formatErrorMessage,
  getEditorTheme,
  getStorageTheme
} = require('./script.js');


// Test Suite for Algorithm 2: Code Execution Logic
describe('parseExecutionResult', () => {

  it('should return stdout when present', () => {
    const apiResult = { stdout: "Hello", stderr: null };
    expect(parseExecutionResult(apiResult)).toBe("Hello");
  });

  it('should return stderr when stdout is null', () => {
    const apiResult = { stdout: null, stderr: "Error!" };
    expect(parseExecutionResult(apiResult)).toBe("Error!");
  });

  it('should return compile_output when stdout and stderr are null', () => {
    const apiResult = { stdout: null, stderr: null, compile_output: "Compile Error" };
    expect(parseExecutionResult(apiResult)).toBe("Compile Error");
  });

  it('should return "No output" when all fields are null', () => {
    const apiResult = { stdout: null, stderr: null, compile_output: null };
    expect(parseExecutionResult(apiResult)).toBe("No output");
  });

  it('should return "No output" for an empty object', () => {
    expect(parseExecutionResult({})).toBe("No output");
  });
});


// Test Suite for Algorithm 3: Theme Logic
describe('Theme Management Logic', () => {

  it('getEditorTheme should return "dracula" when dark', () => {
    expect(getEditorTheme(true)).toBe("dracula");
  });

  it('getEditorTheme should return "default" when not dark', () => {
    expect(getEditorTheme(false)).toBe("default");
  });

  it('getStorageTheme should return "dark" when dark', () => {
    expect(getStorageTheme(true)).toBe("dark");
  });

  it('getStorageTheme should return "light" when not dark', () => {
    expect(getStorageTheme(false)).toBe("light");
  });
});


// Test Suite for Error Formatting Logic
describe('formatErrorMessage', () => {

  it('should format a standard error message', () => {
    const error = new Error("Failed to fetch");
    expect(formatErrorMessage(error)).toBe("⚠️ Error: Failed to fetch");
  });

  it('should handle null or undefined errors', () => {
    expect(formatErrorMessage(null)).toBe("⚠️ Error: Unknown error");
  });
});
