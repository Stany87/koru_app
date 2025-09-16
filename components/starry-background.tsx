'use client'

import React, { useEffect } from 'react'

export default function StarryBackground() {
  useEffect(() => {
    // Add CSS animations to the document head
    const style = document.createElement('style')
    style.textContent = `
      @keyframes animateBg {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
      }
      
      @keyframes shootingStar {
        0% {
          transform: rotate(315deg) translateX(0);
          opacity: 1;
        }
        70% {
          opacity: 1;
        }
        100% {
          transform: rotate(315deg) translateX(-1000px);
          opacity: 0;
        }
      }
      
      .starry-bg {
        animation: animateBg 50s linear infinite;
      }
      
      .shooting-star {
        animation: shootingStar linear infinite;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Starry Night Background Image */}
      <div 
        className="absolute inset-0 starry-bg"
        style={{
          backgroundImage: "url('/starry_nights_background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#0f172a', // Fallback dark background
        }}
      />
      
      {/* Static Stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 200 }, (_, i) => (
          <div
            key={`star-${i}`}
            className="absolute bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              opacity: Math.random() * 0.8 + 0.2,
              animationDelay: `${Math.random() * 3}s`,
              animation: 'twinkle 3s ease-in-out infinite',
            }}
          />
        ))}
      </div>
      
      {/* Shooting Stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full shooting-star"
            style={{
              top: i === 0 ? '0%' : i === 1 ? '0%' : i === 2 ? '80px' : i === 3 ? '0%' : i === 4 ? '0%' : i === 5 ? '0%' : i === 6 ? '300px' : i === 7 ? '0px' : i === 8 ? '0px' : '0px',
              right: i === 0 ? '0' : i === 1 ? '80px' : i === 2 ? '0px' : i === 3 ? '180px' : i === 4 ? '400px' : i === 5 ? '600px' : i === 6 ? '0px' : i === 7 ? '700px' : i === 8 ? '1000px' : '450px',
              left: 'initial',
              boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.1), 0 0 0 8px rgba(255, 255, 255, 0.1), 0 0 20px rgba(255, 255, 255, 0.1)',
              animationDelay: `${i * 0.2}s`,
              animationDuration: i === 0 ? '1.1s' : i === 1 ? '3.3s' : i === 2 ? '2.2s' : i === 3 ? '1.65s' : i === 4 ? '2.75s' : i === 5 ? '3.3s' : i === 6 ? '1.925s' : i === 7 ? '1.375s' : i === 8 ? '2.475s' : '3.025s',
            }}
          >
            {/* Shooting star tail */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-[300px] h-px bg-gradient-to-r from-white to-transparent"
              style={{
                transform: 'translateY(-50%)'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
