import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)',
                    color: '#ffffff',
                    fontFamily: "'Poppins', sans-serif",
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>💔</div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Oops! Something went wrong.</h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
                        Don't worry, love is patient! Try refreshing the page.
                    </p>
                    {this.state.error && (
                        <div style={{
                            background: 'rgba(0,0,0,0.3)',
                            padding: '1rem',
                            borderRadius: '10px',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            marginBottom: '2rem',
                            maxWidth: '600px',
                            overflow: 'auto',
                            textAlign: 'left'
                        }}>
                            {this.state.error.toString()}
                        </div>
                    )}
                    <button
                        onClick={this.handleReload}
                        style={{
                            background: '#ffffff',
                            color: '#C44569',
                            border: 'none',
                            padding: '1rem 3rem',
                            fontSize: '1.2rem',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
