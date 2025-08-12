import './Header.css';
import { Link } from 'react-router-dom';

export function Header({ isAuthenticated, user, onSignOut }) {
    return (
        <header
            className='header'
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: 48,
                background: '#07689f',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 2rem',
                zIndex: 1000,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
        >
            <h1 style={{ fontSize: '1.2rem', margin: 0 }}>My project</h1>
            <nav className="menu" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {isAuthenticated && <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>}
                <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About</Link>
                {isAuthenticated ? (
                    <button
                        onClick={onSignOut}
                        style={{
                            marginLeft: 16,
                            background: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: 6,
                            padding: '0.3rem 0.8rem',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        Odhlásit se
                    </button>
                ) : (
                    <Link to="/sign-in" style={{ color: 'white', textDecoration: 'none' }}>Sign-in</Link>
                )}
            </nav>
        </header>
    );
}