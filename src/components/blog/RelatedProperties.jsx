import React from 'react';
import { Link } from 'react-router-dom';

const RelatedProperties = ({ properties }) => {
  if (!properties?.length) return null;
  return (
    <div style={{ marginTop: '40px', padding: '24px', background: '#fff8f8', borderRadius: '12px', border: '1px solid #fde8e8' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>ðŸ  Related Properties</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        {properties.map(prop => (
          <Link key={prop.id} to={`/property/${prop.id}`} style={{ textDecoration: 'none', background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'block' }}>
            <img src={prop.thumbnail || 'https://via.placeholder.com/300x180'} alt={prop.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
            <div style={{ padding: '12px' }}>
              <p style={{ fontWeight: 600, margin: '0 0 4px', fontSize: '14px', color: '#1a1a1a' }}>{prop.title}</p>
              <p style={{ color: '#E8272A', fontWeight: 700, margin: 0 }}>{prop.price ? `NPR ${Number(prop.price).toLocaleString()}` : 'Price on request'}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProperties;
