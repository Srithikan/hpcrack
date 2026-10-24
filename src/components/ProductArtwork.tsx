import React from 'react';
import type { Product } from '../types';

interface ProductArtworkProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
}

export const ProductArtwork: React.FC<ProductArtworkProps> = ({ product, size = 'md' }) => {
  const { category, image, name } = product;

  // Size styling
  const heightClass = size === 'sm' ? 'h-24' : size === 'lg' ? 'h-52' : 'h-40';

  // If the product has a direct external or custom URL (e.g. uploaded by owner), display it
  if (product.image && product.image.startsWith('http')) {
    return (
      <div className={`product-artwork-container ${heightClass}`}>
        <img
          src={product.image}
          alt={name}
          className="product-artwork-img"
          loading="lazy"
          onError={(e) => {
            // fallback
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Category & type specific tailored high-definition festive SVGs
  const renderArtwork = () => {
    // 1. Bijili
    if (image === 'bijili' || name.toLowerCase().includes('bijili')) {
      return (
        <svg viewBox="0 0 200 150" className="artwork-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg-bijili" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#450a0a" />
              <stop offset="100%" stopColor="#1c0404" />
            </linearGradient>
            <linearGradient id="bijili-paper" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="50%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
            <linearGradient id="gold-band" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          <rect width="200" height="150" fill="url(#bg-bijili)" rx="8" />
          
          {/* Sparkles in background */}
          <circle cx="35" cy="30" r="1.5" fill="#fef08a" opacity="0.6" />
          <circle cx="165" cy="25" r="2" fill="#fef08a" opacity="0.8" />
          <circle cx="175" cy="120" r="1.5" fill="#fef08a" opacity="0.5" />
          <circle cx="25" cy="115" r="1.5" fill="#fef08a" opacity="0.6" />

          {/* Central thread */}
          <path d="M 40,30 Q 100,50 160,35" stroke="#16a34a" strokeWidth="3" fill="none" />
          <path d="M 45,75 Q 100,85 155,75" stroke="#16a34a" strokeWidth="3" fill="none" />
          <path d="M 50,115 Q 100,120 150,115" stroke="#16a34a" strokeWidth="2.5" fill="none" />

          {/* Crackers dangling */}
          {[
            { x: 50, y: 35, angle: 12 },
            { x: 70, y: 40, angle: -8 },
            { x: 90, y: 45, angle: 15 },
            { x: 110, y: 45, angle: -10 },
            { x: 130, y: 40, angle: 8 },
            { x: 150, y: 35, angle: -14 },
            { x: 55, y: 80, angle: -10 },
            { x: 75, y: 85, angle: 12 },
            { x: 95, y: 88, angle: -5 },
            { x: 115, y: 87, angle: 15 },
            { x: 135, y: 82, angle: -12 },
            { x: 65, y: 120, angle: 8 },
            { x: 85, y: 122, angle: -10 },
            { x: 105, y: 122, angle: 12 },
            { x: 125, y: 118, angle: -8 },
          ].map((c, i) => (
            <g key={i} transform={`translate(${c.x}, ${c.y}) rotate(${c.angle})`}>
              <line x1="0" y1="0" x2="0" y2="6" stroke="#15803d" strokeWidth="1.5" />
              <rect x="-4" y="6" width="8" height="24" rx="2" fill="url(#bijili-paper)" />
              <rect x="-4" y="14" width="8" height="5" fill="url(#gold-band)" />
            </g>
          ))}

          {/* Burst spark on top right */}
          <path d="M 160,30 L 175,20 M 165,35 L 180,35 M 160,40 L 175,50 M 155,25 L 155,15" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="160" cy="32" r="3" fill="#fef08a" />
          <text x="100" y="142" textAnchor="middle" fill="#fcd34d" fontSize="9" fontWeight="bold" letterSpacing="1">100 PCS SIVAKASI BIJILI</text>
        </svg>
      );
    }

    // 2. Sound Crackers - Lakshmi / Kuruvi
    if (image === 'lakshmi' || category === 'Single Sound' || category === 'Multi Sound Crackers (Mothers)') {
      return (
        <svg viewBox="0 0 200 150" className="artwork-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg-sound" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#450a0a" />
              <stop offset="100%" stopColor="#2e0505" />
            </linearGradient>
            <linearGradient id="cracker-cyl" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b91c1c" />
              <stop offset="30%" stopColor="#ef4444" />
              <stop offset="70%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>
            <linearGradient id="gold-foil" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>
          </defs>
          <rect width="200" height="150" fill="url(#bg-sound)" rx="8" />

          {/* Sound blast rings */}
          <circle cx="100" cy="72" r="62" stroke="#ea580c" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" fill="none" />
          <circle cx="100" cy="72" r="50" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 2" opacity="0.4" fill="none" />

          {/* Main Sound Cracker Cylinder */}
          <g transform="translate(65, 30)">
            {/* Fuse */}
            <path d="M 35,0 Q 40,-12 55,-16" stroke="#eab308" strokeWidth="2.5" fill="none" strokeDasharray="2 1" />
            {/* Spark at fuse tip */}
            <circle cx="55" cy="-16" r="3.5" fill="#fef08a" />
            <path d="M 55,-22 L 55,-10 M 49,-16 L 61,-16" stroke="#f97316" strokeWidth="1.5" />

            {/* Cylinder body */}
            <rect x="0" y="0" width="70" height="85" rx="5" fill="url(#cracker-cyl)" stroke="#fbbf24" strokeWidth="1.5" />
            {/* Gold foil trim */}
            <rect x="0" y="8" width="70" height="10" fill="url(#gold-foil)" />
            <rect x="0" y="67" width="70" height="10" fill="url(#gold-foil)" />

            {/* Central Lakshmi emblem / traditional icon */}
            <rect x="12" y="24" width="46" height="38" rx="4" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
            <circle cx="35" cy="40" r="12" fill="#d97706" opacity="0.2" />
            {/* Diya / auspicious emblem symbol */}
            <path d="M 28,45 Q 35,49 42,45 Q 40,40 35,40 Q 30,40 28,45 Z" fill="#b91c1c" />
            <path d="M 35,39 Q 37,34 35,30 Q 33,34 35,39 Z" fill="#eab308" />
            <text x="35" y="58" textAnchor="middle" fill="#78350f" fontSize="6.5" fontWeight="900" letterSpacing="0.5">LAKSHMI</text>
          </g>

          <text x="100" y="138" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="bold" letterSpacing="1">SUPER SOUND CRACKER</text>
        </svg>
      );
    }

    // 3. Atom / Bullet / Deluxe Bomb
    if (image === 'bomb' || category === 'Atom Bombs' || category === 'Mega Bomb') {
      return (
        <svg viewBox="0 0 200 150" className="artwork-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg-bomb" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1c1917" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>
            <linearGradient id="bomb-body" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#15803d" />
              <stop offset="50%" stopColor="#166534" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>
            <pattern id="jute-threads" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 0,0 L 8,8 M 8,0 L 0,8" stroke="#fef08a" strokeWidth="0.8" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="200" height="150" fill="url(#bg-bomb)" rx="8" />

          {/* Impact explosion waves */}
          <path d="M 30,30 L 40,40 M 170,30 L 160,40 M 165,110 L 155,100 M 35,110 L 45,100" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <circle cx="100" cy="80" r="52" fill="#ef4444" opacity="0.15" />

          {/* Bomb body */}
          <g transform="translate(68, 42)">
            {/* Long thick fuse */}
            <path d="M 32,0 C 35,-15 50,-18 58,-24" stroke="#a16207" strokeWidth="3" fill="none" strokeDasharray="3 2" />
            {/* Glowing ember */}
            <circle cx="58" cy="-24" r="4" fill="#fbbf24" />
            <circle cx="58" cy="-24" r="2" fill="#fff" />
            <path d="M 58,-30 L 58,-18 M 52,-24 L 64,-24" stroke="#ef4444" strokeWidth="1.5" />

            {/* Bomb block (triangular or chunky cylinder tied with jute) */}
            <path d="M 5,65 L 12,10 L 52,10 L 59,65 Z" fill="url(#bomb-body)" stroke="#16a34a" strokeWidth="1.5" />
            <path d="M 5,65 L 12,10 L 52,10 L 59,65 Z" fill="url(#jute-threads)" />

            {/* Red belly band */}
            <rect x="8" y="30" width="48" height="16" fill="#b91c1c" rx="2" />
            <text x="32" y="42" textAnchor="middle" fill="#fef08a" fontSize="8" fontWeight="bold">DANGER ⚡</text>

            {/* Heavy tying cords */}
            <line x1="12" y1="20" x2="52" y2="20" stroke="#fde047" strokeWidth="2" />
            <line x1="6" y1="55" x2="58" y2="55" stroke="#fde047" strokeWidth="2" />
            <line x1="32" y1="10" x2="32" y2="65" stroke="#fde047" strokeWidth="2" />
          </g>

          <text x="100" y="138" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="900" letterSpacing="1">HIGH DECIBEL BOMB</text>
        </svg>
      );
    }

    // 4. Flower Pots
    if (image === 'flowerpot' || image === 'flower-pot' || category === 'Flower Pots' || category === 'Wounderfull Fountains') {
      return (
        <svg viewBox="0 0 200 150" className="artwork-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg-pot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="50%" stopColor="#311042" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>
            <linearGradient id="pot-clay" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9a3412" />
              <stop offset="40%" stopColor="#ea580c" />
              <stop offset="80%" stopColor="#c2410c" />
              <stop offset="100%" stopColor="#7c2d12" />
            </linearGradient>
            <linearGradient id="spark-spray" x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <rect width="200" height="150" fill="url(#bg-pot)" rx="8" />

          {/* Majestic Spray of Sparks */}
          <g transform="translate(100, 78)">
            {/* Fountain sprays radiating out */}
            {[
              { x: -50, y: -65, color: '#fef08a' },
              { x: -35, y: -72, color: '#fed7aa' },
              { x: -20, y: -76, color: '#fff' },
              { x: 0, y: -78, color: '#fef08a' },
              { x: 20, y: -76, color: '#fff' },
              { x: 35, y: -72, color: '#fed7aa' },
              { x: 50, y: -65, color: '#fef08a' },
              { x: -60, y: -45, color: '#f87171' },
              { x: 60, y: -45, color: '#4ade80' },
            ].map((sp, idx) => (
              <g key={idx}>
                <line x1="0" y1="0" x2={sp.x} y2={sp.y} stroke="url(#spark-spray)" strokeWidth={idx % 2 === 0 ? "2" : "1.5"} opacity="0.85" />
                <circle cx={sp.x} cy={sp.y} r={idx % 2 === 0 ? "2" : "1.5"} fill={sp.color} />
              </g>
            ))}

            {/* Dense central core */}
            <path d="M -12,0 Q 0,-30 12,0 Z" fill="#ffffff" opacity="0.9" />
            <circle cx="0" cy="-2" r="6" fill="#fef08a" />
          </g>

          {/* Clay Pot Base */}
          <g transform="translate(75, 78)">
            <polygon points="12,0 38,0 46,45 4,45" fill="url(#pot-clay)" stroke="#7c2d12" strokeWidth="1.5" />
            {/* Decorative ethnic stripes */}
            <polygon points="10,8 40,8 41,14 9,14" fill="#fbbf24" />
            <polygon points="7,25 43,25 44,30 6,30" fill="#fef08a" />
            <text x="25" y="40" textAnchor="middle" fill="#fff" fontSize="6.5" fontWeight="bold">SIVAKASI</text>
          </g>

          <text x="100" y="140" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="bold" letterSpacing="1">DAZZLING FLOWER POT</text>
        </svg>
      );
    }

    // 5. Ground Chakkars
    if (image === 'chakkar' || category === 'Ground Chakkar') {
      return (
        <svg viewBox="0 0 200 150" className="artwork-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg-chakkar" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#18181b" />
              <stop offset="100%" stopColor="#3f1406" />
            </linearGradient>
            <radialGradient id="chakkar-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#f97316" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="200" height="150" fill="url(#bg-chakkar)" rx="8" />

          {/* Radial motion glow */}
          <circle cx="100" cy="70" r="55" fill="url(#chakkar-halo)" />

          {/* Spiral spinning arms */}
          <g transform="translate(100, 70)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <g key={i} transform={`rotate(${deg})`}>
                <path d="M 0,0 Q 25,-12 48,-5" stroke={i % 2 === 0 ? "#fef08a" : "#f97316"} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <circle cx="48" cy="-5" r="2" fill="#fff" />
              </g>
            ))}

            {/* Central Chakkar disc */}
            <circle cx="0" cy="0" r="18" fill="#b91c1c" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="0" cy="0" r="12" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
            <circle cx="0" cy="0" r="5" fill="#dc2626" />
            <circle cx="0" cy="0" r="2" fill="#fff" />
          </g>

          <text x="100" y="138" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="bold" letterSpacing="1">SPINNING GROUND CHAKKAR</text>
        </svg>
      );
    }

    // 6. Sparklers
    if (image === 'sparkler' || category === 'Sparklers') {
      return (
        <svg viewBox="0 0 200 150" className="artwork-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg-sparkler" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>
            <radialGradient id="sparkler-burst" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="35%" stopColor="#fef08a" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="200" height="150" fill="url(#bg-sparkler)" rx="8" />

          {/* Sparkler Rod */}
          <line x1="30" y1="125" x2="120" y2="45" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          {/* Chemical coating */}
          <line x1="65" y1="94" x2="120" y2="45" stroke="#71717a" strokeWidth="5.5" strokeLinecap="round" />

          {/* Active Burning Point */}
          <circle cx="120" cy="45" r="30" fill="url(#sparkler-burst)" />

          {/* Multi-angle needle sparkles */}
          {[
            { dx: 30, dy: -15 },
            { dx: 25, dy: 20 },
            { dx: -20, dy: -25 },
            { dx: -28, dy: 15 },
            { dx: 10, dy: -32 },
            { dx: -12, dy: 30 },
            { dx: 34, dy: 5 },
            { dx: -30, dy: -8 },
            { dx: 18, dy: -22 },
            { dx: -18, dy: 22 },
          ].map((s, idx) => (
            <line
              key={idx}
              x1="120"
              y1="45"
              x2={120 + s.dx}
              y2={45 + s.dy}
              stroke="#ffffff"
              strokeWidth={idx % 2 === 0 ? "1.8" : "1.2"}
              strokeLinecap="round"
            />
          ))}

          {/* Floating glowing sparks */}
          <circle cx="155" cy="35" r="1.5" fill="#fef08a" />
          <circle cx="140" cy="80" r="1.5" fill="#fef08a" />
          <circle cx="100" cy="20" r="1.5" fill="#fef08a" />
          <circle cx="85" cy="40" r="1" fill="#fff" />

          <text x="100" y="138" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="bold" letterSpacing="1">ELECTRIC SPARKLERS</text>
        </svg>
      );
    }

    // 7. Rockets
    if (image === 'rocket' || category === 'Rockets') {
      return (
        <svg viewBox="0 0 200 150" className="artwork-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg-rocket" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0b0f19" />
              <stop offset="50%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>
            <linearGradient id="rocket-fuselage" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <linearGradient id="rocket-cone" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          <rect width="200" height="150" fill="url(#bg-rocket)" rx="8" />

          {/* Sky stars */}
          <circle cx="30" cy="25" r="1.5" fill="#fef08a" />
          <circle cx="170" cy="40" r="2" fill="#fff" />
          <circle cx="150" cy="110" r="1.5" fill="#fef08a" />
          <circle cx="40" cy="115" r="1.5" fill="#fff" />

          {/* Rocket tilted 45 degrees */}
          <g transform="translate(100, 70) rotate(-45)">
            {/* Wooden guide stick extending downwards */}
            <line x1="0" y1="20" x2="0" y2="90" stroke="#d4d4d8" strokeWidth="2" />

            {/* Exhaust fire blast */}
            <polygon points="-5,20 5,20 0,42" fill="#f97316" />
            <polygon points="-3,20 3,20 0,32" fill="#fef08a" />

            {/* Main rocket body cylinder */}
            <rect x="-8" y="-20" width="16" height="40" rx="2" fill="url(#rocket-fuselage)" stroke="#fbbf24" strokeWidth="1" />
            <rect x="-8" y="-5" width="16" height="8" fill="#fbbf24" />

            {/* Nose cone */}
            <polygon points="-11,-20 11,-20 0,-40" fill="url(#rocket-cone)" />
          </g>

          <text x="100" y="138" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="bold" letterSpacing="1">HIGH FLYING SKY ROCKET</text>
        </svg>
      );
    }

    // 8. Aerial Multi-Shots / Sky Shots / Repeaters
    if (
      image === 'aerial' ||
      image === 'shots' ||
      category === 'Single Sky Shot' ||
      category === 'Fantacy Shots' ||
      category === 'Colour Shot Rider' ||
      category === 'Multi Colour Sky Shot' ||
      name.includes('SHOT')
    ) {
      return (
        <svg viewBox="0 0 200 150" className="artwork-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg-shots" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="50%" stopColor="#2e1065" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>
            <linearGradient id="cake-box" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b91c1c" />
              <stop offset="50%" stopColor="#991b1b" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>
          </defs>
          <rect width="200" height="150" fill="url(#bg-shots)" rx="8" />

          {/* Aerial Starbursts in sky */}
          <g transform="translate(60, 35)">
            <circle cx="0" cy="0" r="14" stroke="#ec4899" strokeWidth="1" strokeDasharray="2 2" fill="none" />
            {[0, 60, 120, 180, 240, 300].map((a, i) => (
              <line key={i} x1="0" y1="0" x2={Math.cos(a*Math.PI/180)*16} y2={Math.sin(a*Math.PI/180)*16} stroke="#f472b6" strokeWidth="1.5" />
            ))}
            <circle cx="0" cy="0" r="3" fill="#fff" />
          </g>

          <g transform="translate(140, 30)">
            <circle cx="0" cy="0" r="16" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" fill="none" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
              <line key={i} x1="0" y1="0" x2={Math.cos(a*Math.PI/180)*18} y2={Math.sin(a*Math.PI/180)*18} stroke="#fef08a" strokeWidth="1.5" />
            ))}
            <circle cx="0" cy="0" r="3" fill="#fff" />
          </g>

          {/* Multi-shot Cake Battery */}
          <g transform="translate(55, 68)">
            <rect x="0" y="10" width="90" height="42" rx="4" fill="url(#cake-box)" stroke="#f59e0b" strokeWidth="1.5" />
            {/* Top Launch Tubes */}
            {[-35, -21, -7, 7, 21, 35].map((xOffset, i) => (
              <ellipse key={i} cx={45 + xOffset} cy="10" rx="5" ry="3" fill="#18181b" stroke="#fef08a" strokeWidth="1" />
            ))}
            {/* Cake label */}
            <rect x="10" y="22" width="70" height="20" rx="3" fill="#fbbf24" />
            <text x="45" y="35" textAnchor="middle" fill="#78350f" fontSize="8" fontWeight="bold">AERIAL REPEATER</text>
          </g>

          <text x="100" y="138" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="bold" letterSpacing="1">AERIAL MULTI-SHOT DISPLAY</text>
        </svg>
      );
    }

    // 9. Gift Boxes
    if (image === 'giftbox' || name.toLowerCase().includes('gift')) {
      return (
        <svg viewBox="0 0 200 150" className="artwork-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg-gift" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#450a0a" />
              <stop offset="50%" stopColor="#1c0404" />
              <stop offset="100%" stopColor="#0f0202" />
            </linearGradient>
            <linearGradient id="box-red" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="50%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>
            <linearGradient id="gold-ribbon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          <rect width="200" height="150" fill="url(#bg-gift)" rx="8" />

          {/* Ambient festival light */}
          <circle cx="100" cy="70" r="50" fill="#f59e0b" opacity="0.15" />

          {/* Festive Gift Hamper Box */}
          <g transform="translate(50, 42)">
            {/* Box Lid */}
            <rect x="0" y="15" width="100" height="60" rx="6" fill="url(#box-red)" stroke="#fbbf24" strokeWidth="2" />
            {/* Golden Ribbon Vertical & Horizontal */}
            <rect x="42" y="15" width="16" height="60" fill="url(#gold-ribbon)" />
            <rect x="0" y="38" width="100" height="14" fill="url(#gold-ribbon)" />

            {/* Box Top Lip */}
            <rect x="-4" y="12" width="108" height="10" rx="3" fill="#991b1b" stroke="#fef08a" strokeWidth="1" />
            <rect x="42" y="12" width="16" height="10" fill="url(#gold-ribbon)" />

            {/* Large festive Ribbon Bow on top */}
            <ellipse cx="38" cy="7" rx="14" ry="7" fill="url(#gold-ribbon)" transform="rotate(-20 38 7)" />
            <ellipse cx="62" cy="7" rx="14" ry="7" fill="url(#gold-ribbon)" transform="rotate(20 62 7)" />
            <circle cx="50" cy="7" r="5" fill="#fef08a" />

            {/* Harini Priya Seal */}
            <circle cx="50" cy="45" r="10" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
            <text x="50" y="48" textAnchor="middle" fill="#78350f" fontSize="6" fontWeight="bold">VIP</text>
          </g>

          <text x="100" y="138" textAnchor="middle" fill="#fde047" fontSize="10" fontWeight="900" letterSpacing="1">MEGA FAMILY CELEBRATION BOX</text>
        </svg>
      );
    }

    // Default Fancy/Fountain/General
    return (
      <svg viewBox="0 0 200 150" className="artwork-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg-default" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#311042" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>
        </defs>
        <rect width="200" height="150" fill="url(#bg-default)" rx="8" />
        <circle cx="100" cy="65" r="35" fill="#f59e0b" opacity="0.2" />
        <text x="100" y="60" textAnchor="middle" fill="#fef08a" fontSize="30">✨</text>
        <text x="100" y="90" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">{name}</text>
        <text x="100" y="135" textAnchor="middle" fill="#fde047" fontSize="9" letterSpacing="0.5">SIVAKASI FIREWORKS</text>
      </svg>
    );
  };

  return (
    <div className={`product-artwork-container ${heightClass}`}>
      {renderArtwork()}
    </div>
  );
};
