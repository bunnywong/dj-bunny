import React, { useState, useEffect } from 'react';
import SoundButton from './components/SoundButton';
import BGMButton from './components/BGMButton';
import TabNavigation from './components/TabNavigation';
import './styles.css';

const App = () => {
  const [sounds, setSounds] = useState([]);
  const [bgmSounds, setBGMSounds] = useState([]);
  const [activeTab, setActiveTab] = useState('effect');
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentBGM, setCurrentBGM] = useState(null);

  // Fetch sounds data
  useEffect(() => {
    fetch('data.json')
      .then((response) => response.json())
      .then((data) => {
        setSounds(data.sounds);
        setBGMSounds(data.bgmSounds);
      })
      .catch((error) => console.error('Error loading sound data:', error));
  }, []);

  // Play sound effect
  const playSound = (index) => {
    if (currentAudio) {
      currentAudio.pause();
    }
    const audio = new Audio(sounds[index]);
    audio.play();
    setCurrentAudio(audio);
  };

  // Toggle BGM
  const toggleBGM = (index) => {
    if (currentBGM) {
      currentBGM.pause();
      setCurrentBGM(null);
    } else {
      const audio = new Audio(bgmSounds[index].file);
      audio.loop = true;
      audio.play();
      setCurrentBGM(audio);
    }
  };

  // Handle BGM upload
  const handleBGMUpload = (event) => {
    const files = event.target.files;
    const newBGMSounds = [...bgmSounds];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newBGMSounds.push({ name: file.name, file: url });
    }
    setBGMSounds(newBGMSounds);
  };

  return (
    <div className="container text-center">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="tab-content">
        {activeTab === 'effect' && (
          <div className="row">
            {sounds.map((sound, index) => (
              <SoundButton
                key={index}
                index={index}
                sound={sound}
                onClick={() => playSound(index)}
              />
            ))}
          </div>
        )}

        {activeTab === 'bgm' && (
          <div className="row">
            {bgmSounds.map((bgm, index) => (
              <BGMButton
                key={index}
                index={index}
                bgm={bgm}
                onClick={() => toggleBGM(index)}
              />
            ))}
            <div id="bgmUploadContainer">
              <label className="upload-label" htmlFor="bgmUpload">
                Upload BGM
              </label>
              <input
                type="file"
                id="bgmUpload"
                accept=".mp3"
                onChange={handleBGMUpload}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;