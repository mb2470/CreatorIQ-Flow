import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * COMPONENT: App
 * Handles the Provisioning Flow for the Echelon Agent
 */
const App = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    tenant_id?: string;
    api_key?: string;
    gateway_url?: string;
  } | null>(null);

  const startSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/.netlify/functions/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Provisioning failed');
      }

      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Agent Handshake</h1>
        <p style={styles.subtitle}>Provision your identity for <strong>The Gig Agency</strong></p>

        {!data ? (
          <form onSubmit={startSignup} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Verification Email</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            
            {error && <div style={styles.error}>{error}</div>}

            <button 
              type="submit" 
              disabled={loading}
              style={{
                ...styles.button,
                backgroundColor: loading ? '#9ca3af' : '#2563eb'
              }}
            >
              {loading ? 'Processing...' : 'Initialize Agent'}
            </button>
          </form>
        ) : (
          <div style={styles.successContainer}>
            <div style={styles.badge}>Step 1: Provisioned</div>
            <p>Identity created in <strong>Governance Hub</strong>.</p>
            
            <div style={styles.codeBlock}>
              <div style={styles.codeItem}><strong>Tenant ID:</strong> <code>{data.tenant_id}</code></div>
              <div style={styles.codeItem}><strong>Gateway:</strong> <code>{data.gateway_url}</code></div>
              <div style={styles.codeItem}><strong>API Key:</strong> <code>{data.api_key?.substring(0, 8)}...</code></div>
            </div>

            <div style={styles.alert}>
              <strong>Action Required:</strong> Check <strong>{email}</strong> for a verification link. 
              The agent will remain restricted until the link is clicked.
            </div>
            
            <button onClick={() => window.location.reload()} style={styles.secondaryButton}>
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- STYLING (In-line for simplicity) ---

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    padding: '20px'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '450px'
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827'
  },
  subtitle: {
    margin: '0 0 24px 0',
    color: '#6b7280',
    fontSize: '14px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase'
  },
  input: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '16px'
  },
  button: {
    padding: '12px',
    borderRadius: '6px',
    color: 'white',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  error: {
    color: '#dc2626',
    fontSize: '14px',
    fontWeight: '500'
  },
  successContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '4px 12px',
    borderRadius: '99px',
    fontSize: '12px',
    fontWeight: '700',
    alignSelf: 'flex-start'
  },
  codeBlock: {
    backgroundColor:
