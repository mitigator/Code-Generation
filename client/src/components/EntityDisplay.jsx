import React from 'react';

function EntityDisplay({ entities }) {
  if (!entities || entities.length === 0) {
    return <p>No entities available</p>;
  }

  return (
    <div>
      <h3>Generated Entities:</h3>
      {Array.isArray(entities) ? (
        entities.map((entity, index) => (
          <div key={index} className="entity-item">
            <h4>{entity.name}</h4>
            <p>{entity.description}</p>
            <div>
              <strong>Attributes:</strong>
              <ul>
                {entity.attributes && entity.attributes.map((attr, idx) => (
                  <li key={idx}>
                    {attr.name}: {attr.type} {attr.required ? '(Required)' : ''}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      ) : (
        <div className="entity-item">
          <pre>{JSON.stringify(entities, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default EntityDisplay;