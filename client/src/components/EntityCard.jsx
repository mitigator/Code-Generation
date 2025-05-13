import React, { useState } from 'react';

function EntityCard({ entity }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="entity-card">
      <div 
        className="entity-header"
        onClick={() => setExpanded(!expanded)}
      >
        <h3>{entity.name}</h3>
        <button className="btn-toggle">
          {expanded ? '▼' : '►'}
        </button>
      </div>
      
      {expanded && (
        <div className="entity-content">
          <p><strong>Description:</strong> {entity.description}</p>
          
          <h4>Fields:</h4>
          <ul className="fields-list">
            {entity.fields.map((field, index) => (
              <li key={index} className="field-item">
                <span className="field-name">{field.name}</span>
                <span className="field-type">{field.type}</span>
                {field.description && <p className="field-desc">{field.description}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default EntityCard;