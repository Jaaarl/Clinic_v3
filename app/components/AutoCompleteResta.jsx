"use client";

import { useEffect, useRef, useState } from "react";

const suggestions = [
  "Aspirin",
  "Paracetamol",
  "Ibuprofen",
  "Amoxicillin",
  "Cough Syrup",
  "Antihistamine",
  "Metformin",
  "Lisinopril",
  "Atorvastatin",
  "Omeprazole",
  "Azithromycin",
  "Diphenhydramine",
  "Prednisone",
  "Losartan",
  "Simvastatin",
  "Furosemide",
  "Hydrochlorothiazide",
  "Gabapentin",
  "Levothyroxine",
  "Propranolol",
  "Clopidogrel",
  "Albuterol",
  "Cetirizine",
  "Naproxen",
  "Doxycycline",
  "Domperidone Syrup",
  "Domperidone Tablet",
  "Co-amoxiclav",
  "Cefixime",
  "Cloxacillin",
  "Prednisolone",
  "Tempra drops",
  "Tempra 250",
  "Salbutamol Nebulization",
  "Budesonide",
  "Vitamin B complex",
  "Multivitamins",
];

const AutoCompleteTextarea = ({ reseta = "", onInputChange }) => {
  const textareaRef = useRef(null);
  const suggestionsRef = useRef(null);
  const mirrorRef = useRef(null);
  const [matches, setMatches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const findCurrentWord = () => {
    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const value = textarea.value;

    let start = cursorPos - 1;
    while (start >= 0 && !/\s/.test(value[start])) {
      start--;
    }
    start++;

    return {
      word: value.substring(start, cursorPos),
      startPos: start,
    };
  };

  const replaceCurrentWord = (newWord) => {
    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const value = textarea.value;
    const { startPos } = findCurrentWord();

    const newValue =
      value.substring(0, startPos) + newWord + " " + value.substring(cursorPos);

    textarea.value = newValue;
    onInputChange(newValue);

    const newCursorPos = startPos + newWord.length + 1;
    textarea.focus();
    textarea.setSelectionRange(newCursorPos, newCursorPos);

    setShowSuggestions(false);
    setMatches([]);
  };

  const updateSuggestionPosition = () => {
    const textarea = textareaRef.current;
    const mirror = mirrorRef.current;
    const suggestionsBox = suggestionsRef.current;

    if (!textarea || !mirror || !suggestionsBox) return;

    const { word, startPos } = findCurrentWord();
    const textBeforeCursor = textarea.value.substring(0, startPos);

    // Copy textarea styles to mirror
    const styles = window.getComputedStyle(textarea);
    mirror.style.font = styles.font;
    mirror.style.padding = styles.padding;
    mirror.style.border = styles.border;
    mirror.style.lineHeight = styles.lineHeight;
    mirror.style.letterSpacing = styles.letterSpacing;
    mirror.style.wordSpacing = styles.wordSpacing;
    mirror.textContent = textBeforeCursor;

    // Create a span to measure cursor position
    const span = document.createElement("span");
    span.textContent = "|";
    mirror.appendChild(span);

    const textareaRect = textarea.getBoundingClientRect();
    const spanRect = span.getBoundingClientRect();

    // Calculate position relative to viewport
    const top = spanRect.bottom + window.scrollY;
    const left = spanRect.left + window.scrollX;

    suggestionsBox.style.position = "fixed";
    suggestionsBox.style.top = `${spanRect.bottom + 2}px`;
    suggestionsBox.style.left = `${spanRect.left}px`;
  };

  const handleInput = (e) => {
    // Always update parent with the current value
    onInputChange(e.target.value);

    const { word } = findCurrentWord();

    if (word.length === 0) {
      setShowSuggestions(false);
      setMatches([]);
      return;
    }

    const filteredMatches = suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(word.toLowerCase()),
    );

    if (filteredMatches.length === 0) {
      setShowSuggestions(false);
      setMatches([]);
      return;
    }

    setMatches(filteredMatches);
    setSelectedIndex(0);
    setShowSuggestions(true);
    updateSuggestionPosition();
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || matches.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + matches.length) % matches.length);
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      replaceCurrentWord(matches[selectedIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setShowSuggestions(false);
      setMatches([]);
    }
  };

  useEffect(() => {
    if (textareaRef.current && reseta) {
      textareaRef.current.value = reseta;
      onInputChange(reseta);
    }
  }, []);

  return (
    <div className="relative w-full">
      <textarea
        ref={textareaRef}
        className="w-full border border-gray-300 rounded-md p-3 min-h-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        placeholder=""
      />

      {/* Hidden mirror div for cursor position calculation */}
      <div
        ref={mirrorRef}
        className="absolute top-0 left-0 pointer-events-none opacity-0 whitespace-pre-wrap"
        style={{ width: textareaRef.current?.offsetWidth }}
      />

      {/* Suggestions popup */}
      {showSuggestions && matches.length > 0 && (
        <div
          ref={suggestionsRef}
          className="bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto z-50"
          style={{ minWidth: "200px" }}
        >
          {matches.map((match, index) => (
            <div
              key={index}
              className={`px-3 py-2 cursor-pointer text-sm ${
                index === selectedIndex
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => replaceCurrentWord(match)}
            >
              {match}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoCompleteTextarea;
