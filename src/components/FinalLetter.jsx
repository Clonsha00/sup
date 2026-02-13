import React from 'react';
import { motion } from 'framer-motion';

const FinalLetter = ({ onBack }) => {
    return (
        <div className="final-letter-container" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="letter-paper"
                style={{
                    background: '#fff9c4', // Light yellow paper
                    padding: '40px',
                    borderRadius: '5px',
                    maxWidth: '600px',
                    width: '90%',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    fontFamily: '"Courier New", monospace', // Typewriter feel
                    position: 'relative',
                    color: '#333'
                }}
            >
                {/* Decoration */}
                <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '3rem'
                }}>
                    💌
                </div>

                <h2 style={{ textAlign: 'center', color: '#d10000', marginBottom: '20px' }}>To My Dearest</h2>

                <div className="letter-content" style={{ lineHeight: '1.6', fontSize: '1.1rem', marginBottom: '30px' }}>
                    <p>Happy Valentine's Day!</p>
                    <p>
                        This is a digital surprise just for you.
                        Scraping through these memories reminded me of how lucky I am.
                    </p>
                    <p>
                        May our days be filled with more joy, laughter, and pixel-perfect moments.
                    </p>
                    <p style={{ textAlign: 'right', marginTop: '20px' }}>
                        Love,<br />
                        [Your Name]
                    </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            background: '#d10000',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            marginTop: '10px'
                        }}
                    >
                        Play Again 🔄
                    </button>
                    {/* Optional Back button if we want to return to hub instead of reload */}
                </div>
            </motion.div>
        </div>
    );
};

export default FinalLetter;
