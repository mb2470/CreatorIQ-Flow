import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [pinging, setPinging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gatewayStatus, setGatewayStatus] = useState<'unknown' | 'active' | 'restricted'>('unknown');
  
  const [data, setData] = useState<{
    tenant_id?: string;
    api_key?: string;
    gateway_url?: string;
  } | null>(null);

  const startSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/.netlify/functions/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Provisioning failed');
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkGateway = async () => {
    if (!data?.api_key) return;
    setPinging(true);
    
    try {
      // Pinging the Echelon Gateway health check or root
      const res = await fetch(`${data.gateway_url}/v1/health`, {
        headers: { 'Authorization': `Bearer ${data.api_key}` }
      });
      
      if (res.status === 200) setGatewayStatus('active');
      else setGatewayStatus('restricted');
    } catch (err) {
      setGatewayStatus('restricted');
    } finally {
      setPinging(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>The Gig Agency</h1>
          <div style={styles.dot}></div>
        </div>

        {!data ? (
          <>
            <p style={styles.subtitle}>Provision your agent identity to begin.</p>
            <form onSubmit={startSignup} style={styles.form}>
              <input 
                type="email" 
                placeholder="Agent Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
              {error && <div style={styles.error}>{error}</div>}
              <button disabled={loading} style={styles.button}>
                {loading ? 'Provisioning...' : 'Initialize Agent'}
              </button>
            </form>
          </>
        ) : (
          <div style={styles.dashboard}>
            <div style={styles.statusBanner}>
              <span>Status: <strong>{gatewayStatus.toUpperCase()}</strong></span>
              <button onClick={checkGateway} disabled={pinging} style={styles.pingBtn}>
                {pinging ? 'Pinging...' : 'Verify Link'}
              </button>
            </div>

            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <label style={styles.label}>Tenant ID</label>
                <code style={styles.code}>{data.tenant_id}</code>
              </div>
            </div>

            <div style={styles.actionSection}>
              <h3 style={styles.sectionTitle}>Campaign Control</h3>
              <p style={styles.infoText}>Once verified, you can deploy tasks to the Governance Hub.</p>
              <button style={styles.disabledBtn} disabled>Deploy First Campaign</button>
            </div>

            <button onClick={() => setData(null)} style={styles.resetLink}>Disconnect Agent</button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- STYLES ---
const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0f172a', padding: '20px', fontFamily: 'Inter, sans-serif' },
  card: { backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', width: '100%', maxWidth: '480px' },
  header: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' },
  title: { margin: 0, fontSize: '22px', color: '#1e293b' },
  subtitle: { color: '#64748b', marginBottom: '24px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '16px' },
  button: { padding: '12px', borderRadius: '8px', backgroundColor: '#2563eb', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  error: { color: '#ef4444', fontSize: '14px' },
  dashboard: { display: 'flex', flexDirection: 'column', gap: '20px' },
  statusBanner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' },
  pingBtn: { padding: '6px 12px', borderRadius: '6px', border: '1px solid #2563eb', color: '#2563eb', background: 'white', cursor: 'pointer', fontSize: '12px' },
  statsGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  statBox: { padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '8px' },
  label: { display: 'block', fontSize: '10px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold' },
  code: { fontSize: '12px', color: '#334155', wordBreak: 'break-all' },
  actionSection: { marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' },
  sectionTitle: { margin: '0 0 8px 0', fontSize: '16px' },
  infoText: { fontSize: '13px', color: '#64748b', marginBottom: '12px' },
  disabledBtn: { width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#e2e8f0', color: '#94a3b8', border: 'none', cursor: 'not-allowed' },
  resetLink: { background: 'none', border: 'none', color: '#94a3b8', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline', marginTop: '10px' }
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
