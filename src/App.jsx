import React, { useState } from 'react';
import './styles/global.scss';

import ScratchBoard from './components/ScratchCard/ScratchBoard';
import AnniversaryScene from './components/SubScenes/AnniversaryScene';
import DaysCounterScene from './components/SubScenes/DaysCounterScene';
import PetBattleScene from './components/SubScenes/PetBattleScene';
import FinalLetter from './components/FinalLetter';

// Game States
const GAME_STATE = {
  SCRATCH_HUB: 'SCRATCH_HUB',
  SCENE_ANNIVERSARY: 'SCENE_ANNIVERSARY', // Zone 1
  SCENE_DAYS: 'SCENE_DAYS',               // Zone 2
  SCENE_PETS: 'SCENE_PETS',               // Zone 3
  SCENE_LETTER: 'SCENE_LETTER',           // Zone 4 (Final)
};

function App() {
  const [gameState, setGameState] = useState(GAME_STATE.SCRATCH_HUB);

  // Navigation Handlers
  const backToHub = () => setGameState(GAME_STATE.SCRATCH_HUB);

  const goToAnniversary = () => setGameState(GAME_STATE.SCENE_ANNIVERSARY);
  const goToDays = () => setGameState(GAME_STATE.SCENE_DAYS);
  const goToPets = () => setGameState(GAME_STATE.SCENE_PETS);
  const goToLetter = () => setGameState(GAME_STATE.SCENE_LETTER);

  return (
    <div className="app-container">


      {gameState === GAME_STATE.SCRATCH_HUB && (
        <ScratchBoard
          onZone1Reveal={goToAnniversary}
          onZone2Reveal={goToDays}
          onZone3Reveal={goToPets}
          onZone4Reveal={goToLetter}
        />
      )}

      {gameState === GAME_STATE.SCENE_ANNIVERSARY && (
        <AnniversaryScene onBack={backToHub} />
      )}

      {gameState === GAME_STATE.SCENE_DAYS && (
        <DaysCounterScene onBack={backToHub} />
      )}

      {gameState === GAME_STATE.SCENE_PETS && (
        <PetBattleScene onBack={backToHub} />
      )}

      {gameState === GAME_STATE.SCENE_LETTER && (
        <FinalLetter />
      )}
    </div>
  );
}

export default App;
