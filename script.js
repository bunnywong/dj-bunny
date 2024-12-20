// Sound effects array
const sounds = [
  'sounds/effect/haha.mp3',
  'sounds/effect/my-mom.mp3',
  'sounds/effect/hit-ear.mp3',
  'sounds/effect/fart.mp3',
  'sounds/effect/don-bell.mp3',
  'sounds/effect/air-bell.mp3',
  'sounds/effect/bo-smile.mp3',
  'sounds/effect/applause-lite.mp3',
  'sounds/effect/applause-max.mp3',
]

// BGM array
const bgmSounds = [
  { name: 'Chill - ice🧊', file: 'sounds/bgm/chill_ice.mp3' },
  { name: 'PK - Hall🏛️', file: 'sounds/bgm/pk_hall-om-mig.mp3' },
  { name: 'Hi - Bro🏛️', file: 'sounds/bgm/hi_welcome-bro.mp3' },
]

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
      currentAudio.pause()
      currentAudio.currentTime = 0
      if (currentButton) {
        currentButton.classList.remove('button-fade-out')
      }
    }

    currentAudio = new Audio(sounds[index])
    currentButton = document.querySelectorAll('.btn')[index]
    currentSoundIndex = index
    currentAudio.play()
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
    stopBGM()
  } else {
    if (currentBGM) {
      stopBGM()
    }
    playBGM(index, button)
  }
}

function playBGM(index, button) {
  currentBGM = new Audio(bgmSounds[index].file)
  currentBGM.loop = true
  currentBGM.play()
  button.classList.add('playing')
  currentBGMButton = button
}

function stopBGM() {
  if (currentBGM) {
    currentBGM.pause()
    currentBGM.currentTime = 0
    if (currentBGMButton) {
      currentBGMButton.classList.remove('playing')
    }
    currentBGM = null
    currentBGMButton = null
  }
}

function stopSound() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    if (currentButton) {
      currentButton.classList.remove('button-fade-out')
    }
    currentAudio = null
    currentButton = null
    currentSoundIndex = null
  }
  stopBGM()
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
        toggleBGM(index, currentBGMButton) // Toggle BGM
      }
    }
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
  }
  newIndex = 0

  // Activate the new tab
  $(`#soundTabs a[href="${tabs[newIndex]}"]`).tab('show')
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  createButtons()
  createBGMButtons()
})
