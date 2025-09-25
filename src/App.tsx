import { useState } from 'react';
import GameScreen from './screens/GameScreen';
import StartScreen from './screens/StartScreen';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  return isPlaying ? (
    <GameScreen onBack={() => setIsPlaying(false)} onExit={() => setIsPlaying(false)} />
  ) : (
    <StartScreen onPlay={() => setIsPlaying(true)} />
  );
}

export default App;
