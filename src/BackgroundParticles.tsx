
import gradcap from './assets/gradcap.webp';
import tickmark from './assets/tickmark.webp';
const NUM_COLS = 5;
const NUM_ROWS = 6;
const TOTAL_PARTICLES = NUM_COLS * NUM_ROWS;

export function BackgroundParticles() {
  const particles = Array.from({ length: TOTAL_PARTICLES }).map((_, i) => {
    const col = i % NUM_COLS;
    const row = Math.floor(i / NUM_COLS);

    // Calculate position as percentages
    const left = (col * (100 / NUM_COLS)) + ((100 / NUM_COLS) / 2);
    const top = (row * (100 / NUM_ROWS)) + ((100 / NUM_ROWS) / 2);
    
    // Alternating types
    const type = (col + row) % 2 === 0 ? 'cap' : 'tick';
    
    return {
      id: i,
      type,
      left: `${left}%`,
      top: `${top}%`,
    };
  });

  return (
    <div className="background-particles">
      {particles.map(p => (
        <div 
          key={p.id} 
          className="particle"
          style={{ left: p.left, top: p.top }}
        >
          <img 
            src={p.type === 'cap' ? gradcap : tickmark} 
            alt="background pattern" 
          />
        </div>
      ))}
    </div>
  );
}
