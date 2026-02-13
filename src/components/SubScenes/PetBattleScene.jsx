import React from 'react';

const PetBattleScene = ({ onBack }) => {
    return (
        <div style={{ color: 'white', textAlign: 'center' }}>
            <h1>Pet Battle</h1>
            <button onClick={onBack}>Back</button>
        </div>
    );
};

export default PetBattleScene;
