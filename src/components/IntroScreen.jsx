import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import FireworksScene from './scenes/FireworksScene';

const IntroScreen = ({ onStart }) => {
    const [showButton, setShowButton] = useState(false);
    const [dimensions, setDimensions] = useState({
        w: window.innerWidth,
        h: window.innerHeight
    });

    useEffect(() => {
        const timer = setTimeout(() => setShowButton(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                w: window.innerWidth,
                h: window.innerHeight
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="intro-screen" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: '#111',
            overflow: 'hidden'
        }}>
            {/* Title overlay (floating on top) */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                style={{
                    position: 'absolute',
                    top: '12%', // Moved down slightly to not block the moon/sun
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 20,
                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                    color: '#fff',
                    fontFamily: '"Press Start 2P", monospace',
                    textShadow: `
                        2px 2px 0px #ff00de,
                        -2px -2px 0px #00eaff,
                        0 0 20px #ff00de
                    `, // Neon Glitch Effect
                    textAlign: 'center',
                    letterSpacing: '6px',
                    margin: 0
                }}
            >
                LOVE LOTTERY
            </motion.h1>

            {/* Panel B: Fireworks - Full Screen */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <FireworksScene width={dimensions.w} height={dimensions.h} />
                <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '15px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '12px',
                    fontFamily: '"Press Start 2P", monospace',
                    textShadow: '1px 1px 0 #000',
                    zIndex: 5
                }}>
                    🏙️ City of Love
                </div>
            </div>

            {/* Start Button (floating center) */}
            {showButton && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1, Filter: 'brightness(1.2)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onStart}
                    style={{
                        position: 'absolute',
                        bottom: '20%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '16px 48px',
                        fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                        fontFamily: '"Press Start 2P", monospace',
                        background: 'linear-gradient(180deg, #ff00de 0%, #9900ff 100%)',
                        border: '4px solid #fff',
                        boxShadow: '0 0 20px #ff00de, 0 0 40px #9900ff', // Glow
                        color: '#fff',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        zIndex: 20,
                        textShadow: '2px 2px 0 #000'
                    }}
                >
                    PRESS START
                </motion.button>
            )}
        </div>
    );
};

export default IntroScreen;
