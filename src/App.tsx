import { useState } from 'react';
import FaqScreen from './screens/FaqScreen';
import GameScreen from './screens/GameScreen';
import StartScreen from './screens/StartScreen';

type Screen = 'start' | 'game' | 'faq';

function App() {
  const [screen, setScreen] = useState<Screen>('start');

  if (screen === 'game') {
    return <GameScreen onExit={() => setScreen('start')} onShowFaq={() => setScreen('faq')} />;
  }

  if (screen === 'faq') {
    return <FaqScreen onBack={() => setScreen('game')} />;
  }

  return <StartScreen onPlay={() => setScreen('game')} />;
}

export default App;
