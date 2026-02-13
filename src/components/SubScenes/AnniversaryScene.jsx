import React from 'react';

const AnniversaryScene = ({ onBack }) => {
    return (
        <div style={{ color: 'white', textAlign: 'center' }}>
            <h1>1013 Anniversary</h1>
            <button onClick={onBack}>Back</button>
        </div>
    );
};

export default AnniversaryScene;
