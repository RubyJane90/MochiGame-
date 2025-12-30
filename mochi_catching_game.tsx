import React, { useState, useEffect, useRef } from 'react';

const MochiGame = () => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [basketPos, setBasketPos] = useState(50);
  const [mochis, setMochis] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const gameLoopRef = useRef(null);
  const mochiIdRef = useRef(0);

  const mochiTypes = [
    { color: '#FFB6C1', name: 'Strawberry', emoji: '🍓' },
    { color: '#E0BBE4', name: 'Taro', emoji: '🍠' },
    { color: '#BAFFC9', name: 'Matcha', emoji: '🍵' },
    { color: '#FFF4B3', name: 'Mango', emoji: '🥭' },
    { color: '#FFE4E1', name: 'Peach', emoji: '🍑' },
  ];

  useEffect(() => {
    if (!gameStarted) return;

    const spawnMochi = () => {
      const type = mochiTypes[Math.floor(Math.random() * mochiTypes.length)];
      const newMochi = {
        id: mochiIdRef.current++,
        x: Math.random() * 85 + 5,
        y: -10,
        type,
        speed: 1.5 + Math.random() * 1,
      };
      setMochis(prev => [...prev, newMochi]);
    };

    const spawnInterval = setInterval(spawnMochi, 1200);

    gameLoopRef.current = setInterval(() => {
      setMochis(prev => {
        const updated = prev.map(m => ({ ...m, y: m.y + m.speed }));
        
        const remaining = updated.filter(m => {
          if (m.y > 100) {
            return false;
          }
          if (m.y > 75 && m.y < 85 && Math.abs(m.x - basketPos) < 12) {
            setScore(s => s + 10);
            return false;
          }
          return true;
        });

        if (updated.length > remaining.length && remaining.length > 0) {
          const missed = updated.length - remaining.length;
          if (updated.some(m => m.y > 100)) {
            setGameOver(true);
          }
        }

        return remaining;
      });
    }, 50);

    return () => {
      clearInterval(spawnInterval);
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameStarted, basketPos]);

  const handleMouseMove = (e) => {
    if (!gameStarted || gameOver) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketPos(Math.max(10, Math.min(90, x)));
  };

  const handleTouchMove = (e) => {
    if (!gameStarted || gameOver) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    setBasketPos(Math.max(10, Math.min(90, x)));
  };

  const startGame = () => {
    setScore(0);
    setMochis([]);
    setGameOver(false);
    setGameStarted(true);
    mochiIdRef.current = 0;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 p-4">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-purple-600 mb-2">🍡 Mochi Catcher 🍡</h1>
        <div className="text-2xl font-bold text-pink-600">Score: {score}</div>
      </div>

      <div 
        className="relative w-full max-w-md h-96 bg-gradient-to-b from-sky-200 to-sky-100 rounded-lg shadow-xl overflow-hidden border-4 border-purple-300"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        style={{ touchAction: 'none' }}
      >
        {!gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-20">
            <div className="text-center">
              <div className="text-6xl mb-4">🍡</div>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">Catch the Mochis!</h2>
              <p className="text-gray-600 mb-6">Move your basket to catch falling mochis.<br/>Don't let any fall!</p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-purple-500 text-white rounded-full font-bold hover:bg-purple-600 transition-colors"
              >
                Start Game
              </button>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-95 z-20">
            <div className="text-center">
              <div className="text-6xl mb-4">😢</div>
              <h2 className="text-3xl font-bold text-purple-600 mb-2">Game Over!</h2>
              <p className="text-xl text-gray-700 mb-6">Final Score: {score}</p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-purple-500 text-white rounded-full font-bold hover:bg-purple-600 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {mochis.map(mochi => (
          <div
            key={mochi.id}
            className="absolute transition-all duration-100"
            style={{
              left: `${mochi.x}%`,
              top: `${mochi.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div 
              className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
              style={{ backgroundColor: mochi.type.color }}
            >
              <span className="text-2xl">{mochi.type.emoji}</span>
            </div>
          </div>
        ))}

        <div
          className="absolute bottom-4 w-20 h-16 transition-all duration-100"
          style={{ left: `${basketPos}%`, transform: 'translateX(-50%)' }}
        >
          <div className="relative">
            <div className="w-20 h-12 bg-gradient-to-b from-amber-600 to-amber-700 rounded-b-3xl border-4 border-amber-800 shadow-lg"></div>
            <div className="absolute top-0 w-full h-2 bg-amber-500 rounded-t-lg"></div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-gray-600 max-w-md">
        <p className="text-sm">🖱️ Move your mouse or 👆 touch and drag to move the basket</p>
      </div>
    </div>
  );
};

export default MochiGame;