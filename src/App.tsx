import { useState } from 'react';
import BaseScreen from './screens/BaseScreen';
import FaqScreen from './screens/FaqScreen';
import GameScreen from './screens/GameScreen';
import StartScreen from './screens/StartScreen';

type Screen = 'start' | 'game' | 'faq' | 'base';

function App() {
  const [screen, setScreen] = useState<Screen>('start');

  if (screen === 'game') {
    return <GameScreen onShowBase={() => setScreen('base')} onShowFaq={() => setScreen('faq')} />;
  }

  if (screen === 'faq') {
    return <FaqScreen onBack={() => setScreen('game')} />;
  }

  if (screen === 'base') {
    return <BaseScreen onBack={() => setScreen('game')} />;
  }

  return <StartScreen onPlay={() => setScreen('game')} />;
}

export default App;
