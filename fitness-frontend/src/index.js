import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Global styles
import App from './App';
import reportWebVitals from './reportWebVitals';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Here you can send error reports to your monitoring service
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f8f9fa'
        }}>
          <div style={{ 
            maxWidth: '500px',
            padding: '40px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{ 
              color: '#dc3545',
              marginBottom: '20px',
              fontSize: '2rem'
            }}>
              🚧 Something went wrong
            </h1>
            <p style={{ 
              marginBottom: '20px',
              color: '#666',
              lineHeight: '1.6'
            }}>
              We're sorry, but something went wrong. Our team has been notified and we're working to fix it.
            </p>
            <details style={{ 
              textAlign: 'left',
              marginBottom: '20px',
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: '500' }}>
                Technical Details
              </summary>
              <div style={{ marginTop: '10px' }}>
                <strong>Error:</strong> {this.state.error && this.state.error.toString()}
                <br /><br />
                <strong>Stack Trace:</strong>
                <pre style={{ 
                  whiteSpace: 'pre-wrap',
                  marginTop: '10px',
                  fontSize: '0.8rem'
                }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            </details>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
            >
              Reload Application
            </button>
            <button
              onClick={() => this.setState({ hasError: false })}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                marginLeft: '10px',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#545b62'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Get the root element
const container = document.getElementById('root');

if (!container) {
  throw new Error('Failed to find the root element');
}

// Create a root
const root = ReactDOM.createRoot(container);

// Render the app
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Remove initial loading screen once app is mounted
setTimeout(() => {
  document.body.classList.add('app-loaded');
}, 100);

// Performance monitoring
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Hot Module Replacement (HMR) for development
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <NextApp />
        </ErrorBoundary>
      </React.StrictMode>
    );
  });
}

// Service Worker registration for PWA
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Export for testing purposes
export { ErrorBoundary };