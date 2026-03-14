import React from "react";

function renderHighlightedCode(code, activeLineNumber) {
  return code.split("\n").map((line, index) => {
    const lineNumber = index + 1;
    const isActive = lineNumber === activeLineNumber;

    return (
      <div
        key={`${lineNumber}-${line}`}
        className={`code-line ${isActive ? "code-line-active" : ""}`}
      >
        <span className="code-line-number">{lineNumber}</span>
        <span className="code-line-text">{line || " "}</span>
      </div>
    );
  });
}

export default function CodeExamples({
  algorithm,
  language,
  setLanguage,
  activeCodeLine,
}) {
  const currentActiveLine = activeCodeLine?.[language] ?? null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(algorithm.code[language]);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  return (
    <section className="panel code-panel">
      <div className="code-panel-header">
        <div className="section-title">Code Implementation</div>
        <button className="copy-button" onClick={handleCopy}>
          Copy
        </button>
      </div>

      <div className="tabs-row">
        {Object.keys(algorithm.code).map((key) => (
          <button
            key={key}
            className={`tab-button ${
              language === key ? "tab-button-active" : ""
            }`}
            onClick={() => setLanguage(key)}
          >
            {key === "cpp" ? "C++" : key[0].toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <div className="code-block code-block-lines">
        {renderHighlightedCode(algorithm.code[language], currentActiveLine)}
      </div>
    </section>
  );
}