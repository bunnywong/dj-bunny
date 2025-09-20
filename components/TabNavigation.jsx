import React, { useEffect } from 'react';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tabs = ['effect', 'bgm'];
      const currentIndex = tabs.indexOf(activeTab);
      
      if (e.key === ',') {
        const newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        setActiveTab(tabs[newIndex]);
      } else if (e.key === '.') {
        const newIndex = (currentIndex + 1) % tabs.length;
        setActiveTab(tabs[newIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, setActiveTab]);

  return (
    <footer className="fixed-bottom">
      <div className="d-flex">
        <button
         style={{height: 80}}
          className={`btn-lg  flex-fill ${
            activeTab === 'effect' ? 'btn-success' : 'btn-secondary'
          }`}
          onClick={() => setActiveTab('effect')}
        >
          Effect 🎵
        </button>
        <button
          style={{height: 80}}
          className={`btn-lg flex-fill ${
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
