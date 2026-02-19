import { useState, useRef, useEffect } from "react";
import SelectDownArrow from "../../public/static/img/icons/ic-select.svg";

interface FontSelectProps {
  fonts: string[];
  value: string;
  onChange: (font: string) => void;
  id?: string;
}

const FontSelect = ({ fonts, value, onChange, id }: FontSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id={id}
        className="form-control appearance-none text-left cursor-pointer"
        style={{ fontFamily: value }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value}
      </button>
      <img
        src={SelectDownArrow}
        alt="Select Down Arrow Icon"
        className="ic-form-select pointer-events-none"
      />

      {isOpen && (
        <ul className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-white border border-[var(--light-border-color)] rounded-[10px] shadow-lg list-none p-0 m-0">
          {fonts.map((font) => (
            <li
              key={font}
              className={`px-3 py-2 cursor-pointer hover:bg-[var(--light-primary-color)] ${
                font === value ? "bg-[var(--light-primary-color)] font-semibold" : ""
              }`}
              style={{ fontFamily: font }}
              onClick={() => {
                onChange(font);
                setIsOpen(false);
              }}
            >
              {font}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FontSelect;
