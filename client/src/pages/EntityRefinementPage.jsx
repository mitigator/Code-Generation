import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import EntityDisplay from '../components/EntityDisplay';
import { refineEntities } from '../utils/api';

function EntityRefinementPage() {
  const navigate = useNavigate();
  const [entities, setEntities] = useState([]);
  const [refinedEntities, setRefinedEntities] = useState(null);
  const [refinementNotes, setRefinementNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Retrieve entities from session storage
    const storedEntities = sessionStorage.getItem('generatedEntities');
    if (!storedEntities) {
      alert('No entities found. Please generate entities first.');
      navigate('/entity-generation');
      return;
    }

    setEntities(JSON.parse(storedEntities));
  }, [navigate]);

  const handleRefineEntities = async () => {
    if (!refinementNotes.trim()) {
      alert('Please enter refinement notes');
      return;
    }

    setLoading(true);
    try {
      // Prepare data for refinement
      const refinementData = {
        entities: entities,
        refinement_notes: refinementNotes
      };

      const result = await refineEntities(refinementData);
      setRefinedEntities(result.data);
      
      // Update the entities in session storage
      sessionStorage.setItem('generatedEntities', JSON.stringify(result.data));
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert('Error refining entities. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/entity-generation');
  };

  if (!entities || entities.length === 0) {
    return (
      <div className="card">
        <Header title="Entity Refinement" />
        <p>No entities available for refinement. Please generate entities first.</p>
        <button onClick={() => navigate('/entity-generation')}>Go to Entity Generation</button>
      </div>
    );
  }

  return (
    <div className="card">
      <Header title="Entity Refinement" />
      
      <div>
        <h3>Current Entities:</h3>
        <EntityDisplay entities={entities} />
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="refinementNotes">Refinement Notes:</label>
        <textarea
          id="refinementNotes"
          value={refinementNotes}
          onChange={(e) => setRefinementNotes(e.target.value)}
          rows="6"
          placeholder="Describe how you would like to refine the entities..."
        ></textarea>
      </div>
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={handleRefineEntities}>Refine Entities</button>
          <button onClick={handleBack} className="secondary">Back to Generation</button>
        </div>
      )}
      
      {refinedEntities && (
        <div style={{ marginTop: '30px' }}>
          <h3>Refined Entities:</h3>
          <EntityDisplay entities={refinedEntities} />
        </div>
      )}
    </div>
  );
}

export default EntityRefinementPage;