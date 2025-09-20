import React, { useState, useEffect } from 'react'
import SoundButton from '../../components/SoundButton'
import BGMButton from '../../components/BGMButton'
import TabNavigation from '../../components/TabNavigation'

const IndexPage = () => {
  const [sounds, setSounds] = useState([])
  const [bgmSounds, setBGMSounds] = useState([])
  const [activeTab, setActiveTab] = useState('effect')
  const [currentAudio, setCurrentAudio] = useState(null)
  const [playingSoundIndex, setPlayingSoundIndex] = useState(null)
  const [currentBGM, setCurrentBGM] = useState(null)
  const [playingBGMIndex, setPlayingBGMIndex] = useState(null);
  const [isBGMPaused, setIsBGMPaused] = useState(true);
  
  // Fetch sounds data
  useEffect(() => {
    fetch('/data.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        return response.json()
      })
      .then((data) => {
        setSounds(data.sounds || [])
        setBGMSounds(data.bgmSounds || [])
      })
      .catch((error) => {
        console.error('Error loading sound data:', error)
        setSounds([]) // Fallback to empty array
        setBGMSounds([]) // Fallback to empty array
      })
  }, [])

  // Play sound effect
  const playSound = (index) => {
    if (currentAudio && playingSoundIndex === index) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setPlayingSoundIndex(null);
    } else {
      if (currentAudio) {
        currentAudio.pause();
      }
      const audio = new Audio(sounds[index]);
      audio.play();
      setCurrentAudio(audio);
      setPlayingSoundIndex(index);
      audio.onended = () => {
        setCurrentAudio(null);
        setPlayingSoundIndex(null);
      };
    }
  };

  // Toggle BGM
  const toggleBGM = (index) => {
    if (playingBGMIndex !== index) {
      if (currentBGM) {
        currentBGM.pause();
      }
      const audio = new Audio(bgmSounds[index].file);
      audio.loop = true;
      audio.play();
      setCurrentBGM(audio);
      setPlayingBGMIndex(index);
      setIsBGMPaused(false);
    } else {
      if (currentBGM) {
        if (isBGMPaused) {
          currentBGM.play();
          setIsBGMPaused(false);
        } else {
          currentBGM.pause();
          setIsBGMPaused(true);
        }
      }
    }
  };

  // Handle BGM upload
  const handleBGMUpload = (event) => {
    const files = event.target.files
    const newBGMSounds = [...bgmSounds]
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const url = URL.createObjectURL(file)
      newBGMSounds.push({ name: file.name, file: url })
    }
    setBGMSounds(newBGMSounds)
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      const numberKey = parseInt(event.key);
      if (!isNaN(numberKey) && numberKey >= 1 && numberKey <= 9) {
        if (activeTab === 'effect' && sounds[numberKey - 1]) {
          playSound(numberKey - 1);
        } else if (activeTab === 'bgm' && bgmSounds[numberKey - 1]) {
          toggleBGM(numberKey - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTab, sounds, bgmSounds, playSound, toggleBGM]);

  return (
    <div className="container text-center">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="tab-content">
        {activeTab === 'effect' && Array.isArray(sounds) && (
          <div className="row">
            {sounds.map((sound, index) => (
              <SoundButton
                key={index}
                index={index}
                sound={sound}
                onClick={() => playSound(index)}
                isPlaying={playingSoundIndex === index}
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
                isPlaying={playingBGMIndex === index}
                isPaused={isBGMPaused}
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
  )
}

export default IndexPage
