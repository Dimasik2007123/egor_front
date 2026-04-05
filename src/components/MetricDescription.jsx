// components/MetricDescription.jsx
import { useState } from "react";

const MetricDescription = ({ title, description, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="metric-description">
      <button 
        className="metric-description__trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="metric-description__icon">{icon}</span>
        <span className="metric-description__title">{title}</span>
        <span className="metric-description__arrow">{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <div className="metric-description__content">
          <p>{description}</p>
        </div>
      )}
    </div>
  );
};

export default MetricDescription;