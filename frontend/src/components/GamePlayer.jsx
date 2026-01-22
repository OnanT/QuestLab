import React, { useEffect } from 'react';
import Phaser from 'phaser';

function GamePlayer() {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: {
        preload: preload,
        create: create
      }
    };

    const game = new Phaser.Game(config);

    function preload() {
      this.load.image('sky', 'https://examples.phaser.io/assets/skies/space3.png');
    }

    function create() {
      this.add.image(400, 300, 'sky');
      this.add.text(300, 550, 'Example Game!', { fontSize: '32px', fill: '#fff' });
    }

    return () => game.destroy(true);
  }, []);

  return <div id="game-container"></div>;
}

export default GamePlayer;
