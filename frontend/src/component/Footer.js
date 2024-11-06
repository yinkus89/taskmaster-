import React from 'react';

function Footer() {
    return (
        <footer style={footerStyle}>
            <p>© {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
        </footer>
    );
}

const footerStyle = {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px',
    textAlign: 'center',
    position: 'fixed',
    left: '0',
    bottom: '0',
    width: '100%'
};

export default Footer;
