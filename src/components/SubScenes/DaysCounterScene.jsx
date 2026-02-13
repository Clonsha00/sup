import React from 'react';

const DaysCounterScene = ({ onBack }) => {
    return (
        <div style={{ color: 'white', textAlign: 'center' }}>
            <h1>125 Days</h1>
            <button onClick={onBack}>Back</button>
        </div>
    );
};

export default DaysCounterScene;
