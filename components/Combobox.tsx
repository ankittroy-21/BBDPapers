"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  label: string;
  stepNumber: number;
}

export default function Combobox({ value, onChange, options, placeholder = "Search...", label, stepNumber }: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search query
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div ref={containerRef} className="relative animate-fade-in">
      <label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">
        <span className="flex items-center justify-center w-6 h-6 bg-indigo-700 text-white rounded-full text-xs">
          {stepNumber}
        </span>
        {label}
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 bg-white border-2 border-slate-300 rounded-2xl text-slate-900 font-medium text-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-700 transition-all outline-none hover:border-slate-400 text-left flex items-center justify-between"
      >
        <span className={value ? "" : "text-slate-500"}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-slate-300 rounded-2xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-8 text-center text-slate-500">
                No results found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full px-4 py-3 text-left hover:bg-indigo-50 transition-colors flex items-center justify-between group ${
                    value === option ? "bg-indigo-50" : ""
                  }`}
                >
                  <span className={`font-medium ${
                    value === option 
                      ? "text-indigo-700" 
                      : "text-slate-900"
                  }`}>
                    {option}
                  </span>
                  {value === option && (
                    <Check className="w-5 h-5 text-indigo-700" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
