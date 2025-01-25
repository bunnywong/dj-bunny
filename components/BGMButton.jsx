import React from 'react';

const BGMButton = ({ index, bgm, onClick }) => {
  const buttonName = `${(index + 1) % 10}. ${bgm.name} 🎵`;

  return (
    <button className="btn btn-primary" onClick={onClick}>
      {buttonName}
    </button>
  );
};

export default BGMButton;