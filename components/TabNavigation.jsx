import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <footer className="fixed-bottom">
      <div className="d-flex">
        <button
          className={`btn btn-lg flex-fill ${
            activeTab === 'effect' ? 'btn-primary' : 'btn-secondary'
          }`}
          onClick={() => setActiveTab('effect')}
        >
          Effect 🎵
        </button>
        <button
          className={`btn btn-lg flex-fill ${
            activeTab === 'bgm' ? 'btn-primary' : 'btn-secondary'
          }`}
          onClick={() => setActiveTab('bgm')}
        >
          BGM 🎼
        </button>
      </div>
    </footer>
  );
};

export default TabNavigation;