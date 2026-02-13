// This file contains the updates - copy content to App.jsx

// 1. Remove min date requirement - line 2826
// Change from:
  min="2026-02-14"
// To:
  // No min attribute

// 2. Add Next button after card section - after line 2050 (after card preview closing div)
// Add:
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button
                onClick={() => setActiveTab('photos')}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#6c5ce7',
                  border: 'none',
                  padding: '1.5rem 4rem',
                  fontSize: '1.3rem',
                  borderRadius: '60px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontFamily: "'Poppins', sans-serif",
                  boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px) scale(1.05)';
                  e.target.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.3)';
                }}
              >
                Next: Add Photos →
              </button>
            </div>

// 3. Add Next button after photos section - after line 2250 (after "No photos yet" message)
// Add:
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button
                onClick={() => setActiveTab('share')}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#6c5ce7',
                  border: 'none',
                  padding: '1.5rem 4rem',
                  fontSize: '1.3rem',
                  borderRadius: '60px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontFamily: "'Poppins', sans-serif",
                  boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px) scale(1.05)';
                  e.target.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.3)';
                }}
              >
                Next: Share Your Card →
              </button>
            </div>
