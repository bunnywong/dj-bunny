import React from 'react';

const SoundButton = ({ index, sound, onClick, isPlaying }) => {
  const fileName = sound.split('/').pop().replace('.mp3', '').replace(/-/g, ' ');
  const emojis = {
    haha: '😂',
    'smile small': '🙂',
    'hit ear': '👂',
    'my mom': '👩',
    fart: '💨',
    oh: '😱',
    'don bell': '🔔',
    'air bell': '💺',
    'applause lite': '👏',
    'applause max': '👏👏',
  };
  const emoji = emojis[fileName] || '🎵';
  const buttonName = `${(index + 1) % 10}. ${fileName} ${emoji}`;

  return (
    <button 
      className={`btn ${isPlaying ? 'btn-success' : 'btn-primary'}`} 
      onClick={onClick}
    >
      {buttonName}
    </button>
  );
};

export default SoundButton;