import React, { useState } from 'react';

function EntityCard({ entity }) {
  const [expanded, setExpanded] = useState(false);

  if (!entity) return null;

  return (
    <div className="card h-100">
      <div 
        className="card-header d-flex justify-content-between align-items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        style={{ cursor: 'pointer' }}
      >
        <h5 className="mb-0">{entity.name || entity.Entity_Name || 'Unnamed Entity'}</h5>
        <span className="badge bg-primary">
          {expanded ? 'Hide' : 'Show'}
        </span>
      </div>
      
      {expanded && (
        <div className="card-body">
          <p className="card-text">
            <strong>Description:</strong> {entity.description || entity.Entity_Description || 'No description available'}
          </p>
          
          <h6>Fields:</h6>
          <ul className="list-group list-group-flush">
            {(entity.fields || entity.Fields || []).map((field, index) => (
              <li key={index} className="list-group-item">
                <div className="d-flex justify-content-between">
                  <strong>{field.name || field || 'unnamed_field'}</strong>
                  <span className="text-muted">{field.type || 'string'}</span>
                </div>
                {field.description && (
                  <small className="text-muted d-block mt-1">
                    {field.description}
                  </small>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default EntityCard;