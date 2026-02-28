import type React from 'react';
import { useEffect, useRef } from 'react';

export const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let op = 0;
    let dir = 0.05;
    
    const interval = setInterval(() => {
        ctx.fillStyle = "#1e1e1e";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        op += dir;
        if (op > 1 || op < 0) dir = -dir;

        ctx.fillStyle = `rgba(76, 175, 80, ${op})`;
        ctx.font = "30px 'Segoe UI', sans-serif";
        ctx.textAlign = "center";
        
        // This simulates the engine starting text we had before
        ctx.fillText("Game Engine Starting...", canvas.width / 2, canvas.height / 2);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div id="game-container" style={{
          width: '800px', height: '600px', backgroundColor: '#1e1e1e', 
          border: '2px solid #333', borderRadius: '8px', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)', marginBottom: '20px'
      }}>
        <canvas ref={canvasRef} id="game-canvas" width="800" height="600">
          브라우저가 Canvas를 지원하지 않습니다.
        </canvas>
      </div>
      
      <div className="controls" style={{
          padding: '15px', background: '#252526', borderRadius: '8px', 
          width: '800px', boxSizing: 'border-box', textAlign: 'center'
      }}>
        <h1 style={{ marginTop: 0, marginBottom: '10px', fontSize: '24px', color: '#4CAF50' }}>My Awesome React Web Game</h1>
        <p style={{ margin: 0, color: '#aaaaaa', fontSize: '14px' }}>Powered by React, WebAssembly & FSD Architecture.</p>
      </div>
    </div>
  );
};
