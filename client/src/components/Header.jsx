import React from 'react';

function Header({ title }) {
  return (
    <header style={{ marginBottom: '20px' }}>
      <h1>{title}</h1>
    </header>
  );
}

export default Header;