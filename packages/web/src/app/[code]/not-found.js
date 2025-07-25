'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '3rem',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '4rem',
          margin: '0 0 1rem 0',
          fontWeight: 'bold'
        }}>
          404
        </h1>
        
        <h2 style={{
          fontSize: '1.5rem',
          margin: '0 0 1rem 0',
          fontWeight: '600'
        }}>
          Short URL Not Found
        </h2>
        
        <p style={{
          fontSize: '1rem',
          margin: '0 0 2rem 0',
          opacity: 0.9,
          lineHeight: '1.5'
        }}>
          The short URL you're looking for doesn't exist or may have expired.
        </p>
        
        <Link 
          href="/"
          style={{
            display: 'inline-block',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(5px)'
          }}
        >
          🧰 Back to Toolbox
        </Link>
      </div>
    </div>
  );
}
