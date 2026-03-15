import React, { useState } from 'react';

export default function App() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const startSignup = async () => {
    setLoading(true);
    try {
      const res = await fetch('/.netlify/functions/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      setData(result);
    } catch (err) {
      alert("Signup failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto', fontFamily: 'system-ui' }}>
      <h1>Echelon Agent Setup</h1>
      {!data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p>Enter your email to provision your agent and receive your MCP key.</p>
          <input 
            type="email" 
            placeholder="email@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '10px', fontSize: '1rem' }}
          />
          <button 
            onClick={startSignup} 
            disabled={loading}
            style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            {loading ? 'Provisioning...' : 'Initialize Agent'}
          </button>
        </div>
      ) : (
        <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
          <h3>✅ Step 1 Complete!</h3>
          <p><strong>Tenant ID:</strong> {data.tenant_id}</p>
          <p><strong>Gateway:</strong> {data.gateway_url}</p>
          <div style={{ background: '#fff', padding: '10px', borderLeft: '4px solid #007bff' }}>
            <p><strong>Next Step:</strong> Check your email (<em>{email}</em>) to verify. Your API key will be active once verified.</p>
          </div>
        </div>
      )}
    </div>
  );
}
