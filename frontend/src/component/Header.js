import React from 'react';

function Header() {
    return (
        <header style={headerStyle}>
            <h1>TaskMaster</h1>
        </header>
    );
}

const headerStyle = {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px',
    textAlign: 'center'
};

export default Header;
