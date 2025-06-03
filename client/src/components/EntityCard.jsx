import React, { useState } from 'react';
 
function EntityCard({ entity, selected, onToggleSelection, index, colors, isRejected = false }) {
  const [expanded, setExpanded] = useState(false);
 
  if (!entity) return null;
 
  // Use consistent naming regardless of the entity structure
  const entityName = entity.name || entity.Entity_Name || 'Unnamed Entity';
  const entityDescription = entity.description || entity.Entity_Description || 'No description available';
  const entityFields = entity.fields || entity.Fields || [];
 
  return (
    <div
      className={`overflow-hidden shadow rounded-lg divide-y transition-all duration-300 transform ${
        selected ? 'scale-102' : 'scale-100'
      } ${isRejected ? 'opacity-60' : ''}`}
      style={{
        backgroundColor: isRejected ? `${colors.surface}90` : colors.surface,
        borderColor: isRejected ? `${colors.error}50` : (selected ? colors.primary : colors.borderDefault),
        boxShadow: selected
          ? `0 10px 15px -3px ${colors.primary}30, 0 4px 6px -2px ${colors.primary}20`
          : isRejected
            ? `0 4px 6px -1px ${colors.error}20, 0 2px 4px -1px ${colors.error}10`
            : `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`,
        border: selected
          ? `1px solid ${colors.primary}`
          : isRejected
            ? `1px solid ${colors.error}50`
            : `1px solid ${colors.borderDefault}`,
        filter: isRejected ? 'grayscale(30%)' : 'none'
      }}
    >
      <div
        className="px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer transition-colors duration-150"
        onClick={() => setExpanded(!expanded)}
        style={{
          backgroundColor: expanded ? `${colors.primary}05` : (isRejected ? `${colors.surface}90` : colors.surface)
        }}
        onMouseOver={(e) => {
          if (!expanded && !isRejected) {
            e.currentTarget.style.backgroundColor = `${colors.primary}05`;
          }
        }}
        onMouseOut={(e) => {
          if (!expanded && !isRejected) {
            e.currentTarget.style.backgroundColor = isRejected ? `${colors.surface}90` : colors.surface;
          }
        }}
      >
        <div className="flex items-center">
          {!isRejected && (
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggleSelection(index)}
              className="h-4 w-4 mr-3 rounded"
              style={{
                color: colors.primary,
                borderColor: colors.borderDefault
              }}
              onClick={(e) => e.stopPropagation()}
            />
          )}
          {isRejected && (
            <div className="h-4 w-4 mr-3 flex items-center justify-center">
              <svg className="h-4 w-4" style={{ color: colors.error }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          <h3
            className="text-lg leading-6 font-medium"
            style={{
              color: isRejected ? `${colors.textPrimary}80` : colors.textPrimary
            }}
          >
            {entityName}
          </h3>
          {isRejected && (
            <span
              className="ml-2 px-2 py-1 text-xs font-medium rounded-full"
              style={{
                backgroundColor: `${colors.error}15`,
                color: colors.error
              }}
            >
              Rejected
            </span>
          )}
        </div>
        <div
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: expanded
              ? `${colors.primary}15`
              : isRejected
                ? `${colors.textLight}10`
                : `${colors.textLight}15`,
            color: expanded
              ? colors.primary
              : isRejected
                ? `${colors.textLight}80`
                : colors.textLight
          }}
        >
          {expanded ? 'Hide Details' : 'Show Details'}
        </div>
      </div>
     
      <div
        className={`transition-all duration-300 overflow-hidden ${
          expanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-5 sm:p-6">
          <p
            className="text-sm mb-4"
            style={{
              color: isRejected ? `${colors.textSecondary}80` : colors.textSecondary
            }}
          >
            <span
              className="font-medium"
              style={{
                color: isRejected ? `${colors.textPrimary}80` : colors.textPrimary
              }}
            >
              Description:
            </span> {entityDescription}
          </p>
         
          <div className="flex items-center mb-2">
            <h4
              className="text-sm font-medium"
              style={{
                color: isRejected ? `${colors.textPrimary}80` : colors.textPrimary
              }}
            >
              Fields
            </h4>
            <span
              className="ml-2 text-xs py-0.5 px-2 rounded-full"
              style={{
                backgroundColor: isRejected ? `${colors.primary}05` : `${colors.primary}10`,
                color: isRejected ? `${colors.primary}80` : colors.primary
              }}
            >
              {entityFields.length}
            </span>
          </div>
 
          <ul className="divide-y" style={{ borderColor: colors.borderDefault }}>
            {entityFields.map((field, idx) => {
              const fieldName = field.name || field || 'unnamed_field';
              const fieldType = '';
             
              return (
                <li key={idx} className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg
                        className="flex-shrink-0 h-5 w-5"
                        style={{
                          color: isRejected ? `${colors.secondary}60` : colors.secondary
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                      </svg>
                      <span
                        className="ml-2 font-medium"
                        style={{
                          color: isRejected ? `${colors.textPrimary}80` : colors.textPrimary
                        }}
                      >
                        {fieldName}
                      </span>
                    </div>
                    <span
                      className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      style={{
                        backgroundColor: isRejected ? `${colors.secondary}10` : `${colors.secondary}15`,
                        color: isRejected ? `${colors.secondary}80` : colors.secondary
                      }}
                    >
                      {fieldType}
                    </span>
                  </div>
                  {field.description && (
                    <p
                      className="mt-1 text-xs"
                      style={{
                        color: isRejected ? `${colors.textLight}60` : colors.textLight
                      }}
                    >
                      {field.description}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
 
export default EntityCard;