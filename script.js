let sounds = []
let bgmSounds = []

// Fetch sounds configuration from data.json
fetch('data.json')
  .then((response) => response.json())
  .then((data) => {
    sounds = data.sounds
    bgmSounds = data.bgmSounds
    preloadAudio() // Preload audio after fetching data
    createButtons()
    createBGMButtons()
  })
  .catch((error) => {
    console.error('Error loading sound data:', error)
  })

// Preload all audio files
function preloadAudio() {
  sounds.forEach((sound) => {
    const audio = new Audio(sound) // Create a new Audio object for each sound
    audio.load() // Preload the audio
  })

  bgmSounds.forEach((bgm) => {
    const audio = new Audio(bgm.file) // Create a new Audio object for each BGM
    audio.load() // Preload the audio
  })
}

let currentAudio = null
let currentButton = null
let currentSoundIndex = null
let currentBGM = null
let currentBGMButton = null
let lastClickTime = 0
const doubleClickDelay = 300

// Initialize tabs
$(document).ready(function () {
  $('#soundTabs a').on('click', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })
})

function playSound(index, isDoubleClick = false) {
  const now = Date.now()

  if (
    currentAudio &&
    currentSoundIndex === index &&
    now - lastClickTime < doubleClickDelay
  ) {
    stopSound()
    return
  }

  lastClickTime = now

  if (!isDoubleClick) {
    if (currentAudio) {
      stopSound()
    }

    currentAudio = new Audio(sounds[index])
    currentButton = document.querySelectorAll('.btn')[index]
    currentSoundIndex = index
    currentAudio.play()

    // Set the background for the currently playing button
    if (currentButton) {
      currentButton.style.backgroundColor = '#ffcc00' // Change to your desired color
    }

    // Remove background color when the sound finishes playing
    currentAudio.addEventListener('ended', () => {
      if (currentButton) {
        currentButton.style.backgroundColor = '' // Reset background color
      }
    })
  }
}

function stopSound() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    if (currentButton) {
      currentButton.classList.remove('button-fade-out')
      currentButton.style.backgroundColor = '' // Reset background color
    }
    currentAudio = null
    currentButton = null
    currentSoundIndex = null
  }
}

function createButtons() {
  const buttonContainer = document.getElementById('buttonContainer')
  const emojis = {
    haha: '😂',
    'my mom': '👩',
    'hit ear': '👂',
    fart: '💨',
    'don bell': '🔔',
    'air bell': '💺',
    'bo smile': '😊',
    'applause lite': '👏',
    'applause max': '👏👏',
  }

  for (let i = 0; i < sounds.length; i++) {
    const buttonIndex = (i + 1) % 10
    const fileName = sounds[i]
      .split('/')
      .pop()
      .replace('.mp3', '')
      .replace(/-/g, ' ')

    const emoji = emojis[fileName] || '🎵'
    const buttonName = `${buttonIndex}. ${fileName} ${emoji}`

    const button = document.createElement('button')
    button.className = 'btn btn-primary'
    button.innerText = buttonName

    button.addEventListener('click', () => playSound(i))

    buttonContainer.appendChild(button)
  }
}

function createBGMButtons() {
  const bgmContainer = document.getElementById('bgmContainer')
  bgmContainer.innerHTML = '' // Clear existing buttons

  bgmSounds.forEach((sound, index) => {
    const buttonIndex = (index + 1) % 10
    const button = document.createElement('button')
    button.className = 'btn btn-primary'
    button.innerText = `${buttonIndex}. ${sound.name} 🎵`

    button.addEventListener('click', () => toggleBGM(index, button))

    bgmContainer.appendChild(button)
  })
}

function toggleBGM(index, button) {
  if (currentBGM && currentBGMButton === button) {
    // If the same button is clicked, toggle play/pause
    if (currentBGM.paused) {
      currentBGM.play()
      button.style.backgroundColor = '#ffcc00' // Set active background color
    } else {
      currentBGM.pause()
      button.style.backgroundColor = '#cccccc' // Set paused background color
    }
  } else {
    // If a different button is clicked, stop the current BGM
    if (currentBGM) {
      stopBGM()
    }
    playBGM(index, button)
  }
}

function playBGM(index, button) {
  currentBGM = new Audio(bgmSounds[index].file)
  currentBGM.loop = true
  currentBGM
    .play()
    .then(() => {
      if (button) {
        button.classList.add('playing') // Ensure button exists before accessing classList
        button.style.backgroundColor = '#ffcc00' // Set active background color
      }
      currentBGMButton = button // Set the current button

      // Remove background color when the BGM finishes playing
      currentBGM.addEventListener('ended', () => {
        if (button) {
          button.style.backgroundColor = '' // Reset background color
        }
      })
    })
    .catch((error) => {
      console.error('Error playing BGM:', error)
    })
}

function stopBGM() {
  if (currentBGM) {
    currentBGM.pause()
    currentBGM.currentTime = 0
    if (currentBGMButton) {
      currentBGMButton.classList.remove('playing')
      currentBGMButton.style.backgroundColor = '' // Reset background color
    }
    currentBGM = null
    currentBGMButton = null
  }
}

// Event Listeners
document.addEventListener('click', (event) => {
  if (
    !event.target.classList.contains('btn') &&
    !event.target.closest('#buttonContainer')
  ) {
    stopSound()
  }
})

document.querySelector('.container').addEventListener('click', (event) => {
  if (event.target.classList.contains('btn')) {
    event.stopPropagation()
  }
})

// Keyboard event listener for tab switching and sound playing
document.addEventListener('keydown', (event) => {
  const key = event.key
  if (key === '.') {
    switchTab('next') // Switch to the next tab on pressing '.'
  } else if (key === ',') {
    switchTab('prev') // Switch to the previous tab on pressing ','
  } else if (key >= '1' && key <= '9') {
    const index = parseInt(key) - 1 // Convert key to index (0-8)
    const currentTab = $('.tab-pane.show').attr('id') // Get current active tab ID
    if (currentTab === 'effect') {
      if (index < sounds.length) {
        playSound(index) // Play sound effect
      }
    } else if (currentTab === 'bgm') {
      if (index < bgmSounds.length) {
        toggleBGM(index, document.querySelectorAll('#bgmContainer .btn')[index]) // Toggle BGM
      }
    }
  } else if (key === ' ') {
    // Check for space key
    event.preventDefault() // Prevent default space key behavior (scrolling)
    stopSound() // Stop sound effects
    stopBGM() // Stop BGM
  }
})

// Function to switch tabs
function switchTab(direction) {
  const tabs = ['#effect', '#bgm'] // Array of tab IDs
  const currentTab = $('.tab-pane.show').attr('id') // Get current active tab ID
  const currentIndex = tabs.indexOf(`#${currentTab}`) // Find the index of the current tab

  let newIndex
  if (direction === 'next') {
    newIndex = (currentIndex + 1) % tabs.length // Move to the next tab, loop back to start
  } else {
    newIndex = (currentIndex - 1 + tabs.length) % tabs.length // Move to the previous tab, loop back to end
  }

  // Activate the new tab
  $(`#soundTabs a[href="${tabs[newIndex]}"]`).tab('show')
  $(`#myTab > li:nth-child(${currentIndex === 1 ? 1 : 2}) a`).tab('show')
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  preloadAudio() // Preload all audio files
  createButtons()
  createBGMButtons()
})

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope)
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error)
      })
  })
}

// Add an event listener for file uploads
document.getElementById('bgmUpload').addEventListener('change', handleBGMUpload)

function handleBGMUpload(event) {
  const files = event.target.files
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const url = URL.createObjectURL(file) // Create a URL for the uploaded file
    bgmSounds.push({ name: file.name, file: url }) // Add the uploaded BGM to the bgmSounds array
  }
  createBGMButtons() // Recreate BGM buttons to include the new uploads
}

// Add an event listener for file uploads for effects
document
  .getElementById('effectUpload')
  .addEventListener('change', handleEffectUpload)

function handleEffectUpload(event) {
  const files = event.target.files
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const url = URL.createObjectURL(file) // Create a URL for the uploaded file
    sounds.push(url) // Add the uploaded effect to the sounds array
  }
  createButtons() // Recreate effect buttons to include the new uploads
}
