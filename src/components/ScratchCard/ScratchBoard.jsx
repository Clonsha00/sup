import React, { useState, useEffect, useRef } from 'react';
import ScratchZone from './ScratchZone';
import CustomCursor from '../CustomCursor';
import './scratch.scss';

const ScratchBoard = ({ onZone1Reveal, onZone2Reveal, onZone3Reveal, onZone4Reveal }) => {
    const [scale, setScale] = useState(1);
    const ticketRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            // Base dimensions for Single Ticket
            const baseWidth = 600; // Narrower for single card
            const baseHeight = 500; // Shorter

            const targetWidth = window.innerWidth * 0.9;
            const targetHeight = window.innerHeight * 0.7; // Reduced to prevent clipping

            const scaleX = targetWidth / baseWidth;
            const scaleY = targetHeight / baseHeight;

            let newScale = Math.min(scaleX, scaleY);
            setScale(newScale);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [scratchedZones, setScratchedZones] = useState({
        1: false,
        2: false,
        3: false,
        4: false
    });

    const handleScratchComplete = (zoneId) => {
        setScratchedZones(prev => ({ ...prev, [zoneId]: true }));
    };

    // --- Game Logic Helpers ---
    const [zone3FoundCount, setZone3FoundCount] = useState(0);
    const foundItemsRef = useRef(new Set());
    const handleZone3Scratch = (x, y) => { /* ... simplified for visual logic */ };
    const getDogScore = () => scratchedZones[3] ? 3 : 0;
    const getCatScore = () => scratchedZones[3] ? 2 : 0;

    const RedeemButton = ({ onClick, label = "兌獎" }) => (
        <button className="pixel-btn redeem-btn" onClick={onClick}>
            {label} 🎁
        </button>
    );

    // --- Card Configuration ---
    const cards = [
        {
            id: 1,
            title: "紀念日密碼",
            subTitle: "Date Code",
            color: "#ff0055", // Pink/Red
            width: 400,
            height: 250,
            renderContent: () => (
                <div className="zone-split-layout">
                    <div className="section lucky">
                        <div className="label">您的號碼</div>
                        <div className="num-item">
                            <span className="the-num">10</span>
                            <span className="the-text">TEN</span>
                        </div>
                        <div className="num-item">
                            <span className="the-num">13</span>
                            <span className="the-text">THRTN</span>
                        </div>
                    </div>
                    <div className="section yours">
                        <div className="label" style={{ gridColumn: '1 / -1' }}>幸運號碼</div>
                        {[{ n: 7, t: 'SEVEN' }, { n: 10, t: 'TEN', w: true }, { n: 3, t: 'THREE' },
                        { n: 13, t: 'THRTN', w: true }, { n: 15, t: 'FIFTN' }, { n: 19, t: 'NINTN' }].map((item, i) => (
                            <div className="num-item" key={i}>
                                <span className={`the-num ${item.w && scratchedZones[1] ? 'win' : ''}`}>{item.n}</span>
                                <span className="the-text">{item.t}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ),
            onRedeem: onZone1Reveal,
            redeemLabel: "兌獎",
            hint: "您的號碼 對中 幸運號碼 得獎"
        },
        {
            id: 2,
            title: "甜蜜天數",
            subTitle: "Sweet Days",
            color: "#ffaa00", // Orange/Gold
            width: 400,
            height: 250,
            renderContent: () => (
                <div className="zone-split-layout">
                    <div className="section lucky" style={{ width: '30%' }}>
                        <div className="label">您的號碼</div>
                        {[1, 2, 5].map((n, i) => (
                            <div className="num-item" key={i}><span className="the-num">{n}</span></div>
                        ))}
                    </div>
                    <div className="section bingo-grid" style={{ width: '70%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div className="label">賓果連線</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                            {[{ n: 1, w: true }, { n: 8 }, { n: 4 }, { n: 7 }, { n: 2, w: true }, { n: 9 }, { n: 3 }, { n: 6 }, { n: 5, w: true }].map((item, i) => (
                                <div className={`b-cell ${item.w && scratchedZones[2] ? 'circled' : ''}`} key={i}>{item.n}</div>
                            ))}
                        </div>
                    </div>
                </div>
            ),
            onRedeem: onZone2Reveal,
            redeemLabel: "兌獎",
            hint: "連線 您的號碼 得獎"
        },
        {
            id: 3,
            title: "貓狗大戰",
            subTitle: "Pet Battle",
            color: "#00aaff", // Blue
            width: 450,
            height: 150,
            renderHeader: () => (
                <div className="prize-content battle" style={{ marginBottom: '10px' }}>
                    <div className={`team dog ${getDogScore() > getCatScore() ? 'win' : ''}`}>
                        <span className="icon">🐶</span>
                        <div className="bar-container"><div className="bar" style={{ width: `${(getDogScore() / 5) * 100}%` }}></div></div>
                        <span className="score">{getDogScore()}</span>
                    </div>
                    <div className="vs-badge">VS</div>
                    <div className={`team cat ${getCatScore() > getDogScore() ? 'win' : ''}`}>
                        <span className="icon">🐱</span>
                        <div className="bar-container"><div className="bar" style={{ width: `${(getCatScore() / 5) * 100}%` }}></div></div>
                        <span className="score">{getCatScore()}</span>
                    </div>
                </div>
            ),
            renderContent: () => (
                <div className="treasure-container">
                    {['🍖', '🐟', '🦴', '🎣', '🥩'].map((item, i) => (
                        <div className="treasure-item" key={i}>{item}</div>
                    ))}
                </div>
            ),
            onRedeem: onZone3Reveal,
            redeemLabel: "兌獎",
            hint: "刮出寵物相關物品得分 🐶獲勝即中獎"
        },
        {
            id: 4,
            title: "終極大獎",
            subTitle: "Final Gift",
            color: "#a300cc", // Purple
            width: 400,
            height: 200,
            renderContent: () => (
                <div className="prize-content envelope-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <div className="pixel-envelope-icon">
                        <div className="envelope-body"><span className="heart-seal">❤️</span></div>
                    </div>
                    <div style={{ fontSize: '14px', color: '#999', fontFamily: 'inherit' }}>💌 一封神秘的信件</div>
                </div>
            ),
            onRedeem: onZone4Reveal,
            redeemLabel: "兌獎",
            hint: "刮開信封 開啟驚喜"
        }
    ];

    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const currentCard = cards[currentCardIndex];

    const nextCard = () => {
        if (currentCardIndex < cards.length - 1) setCurrentCardIndex(prev => prev + 1);
    };
    const prevCard = () => {
        if (currentCardIndex > 0) setCurrentCardIndex(prev => prev - 1);
    };

    return (
        <div className="scratch-board-container">
            <CustomCursor />

            {/* Navigation Dots */}
            <div className="nav-dots">
                {cards.map((_, i) => (
                    <div
                        key={i}
                        className={`dot ${i === currentCardIndex ? 'active' : ''} ${scratchedZones[i + 1] ? 'completed' : ''}`}
                        onClick={() => setCurrentCardIndex(i)}
                    />
                ))}
            </div>

            {/* Navigation Arrows */}
            <button className="nav-btn prev" onClick={prevCard} disabled={currentCardIndex === 0}>◀</button>
            <button className="nav-btn next" onClick={nextCard} disabled={currentCardIndex === cards.length - 1}>▶</button>

            <div
                className="lottery-ticket single-card"
                ref={ticketRef}
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    borderColor: currentCard.color
                }}
            >
                {/* Header */}
                <div className="ticket-header" style={{ borderBottomColor: currentCard.color }}>
                    <div className="mascot">✨</div>
                    <div className="title-block">
                        <h1 className="main-title" style={{ color: currentCard.color }}>{currentCard.title}</h1>
                        <div className="sub-title" style={{ background: currentCard.color }}>{currentCard.subTitle}</div>
                    </div>
                    <div className="mascot">✨</div>
                </div>

                {/* Custom Header (for Scoreboard etc) */}
                {currentCard.renderHeader && currentCard.renderHeader()}

                <div className="ticket-body">
                    <div className="zone-wrapper wide">
                        {/* Hint */}
                        {!scratchedZones[currentCard.id] && (
                            <div className="zone-hint" style={{ marginBottom: '5px' }}>{currentCard.hint}</div>
                        )}

                        <div className="zone-container">
                            <ScratchZone
                                key={currentCard.id}
                                width={currentCard.width}
                                height={currentCard.height}
                                brushSize={30}
                                revealThreshold={0.98}
                                forceRevealed={scratchedZones[currentCard.id]}
                                onReveal={() => handleScratchComplete(currentCard.id)}
                            >
                                <div className="wavy-bg" style={{ filter: `hue-rotate(${currentCardIndex * 60}deg)` }}></div>
                                {currentCard.renderContent()}
                            </ScratchZone>
                        </div>

                        {scratchedZones[currentCard.id] && (
                            <RedeemButton onClick={currentCard.onRedeem} label={currentCard.redeemLabel} />
                        )}
                    </div>
                </div>

                <div className="ticket-footer">
                    Ticket {currentCardIndex + 1} of {cards.length}
                </div>
            </div>
        </div>
    );
};

export default ScratchBoard;
