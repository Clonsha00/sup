import React, { useState, useEffect } from 'react';
import '../ScratchCard/scratch.scss'; // Reuse some styles or add new ones here
import pinkMahjongImg from '../../assets/pink_mahjong_v2.png'; // Import the new image

const AnniversaryScene = ({ onBack }) => {
    const [step, setStep] = useState(0); // 0: Intro, 1: Riddle, 2: Quiz, 3: Reveal
    const [typedText, setTypedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Dialogues
    const dialogueIntro = "你好哇 恭喜你刮到了此獎品～ 不過這樣就讓你知道是什麼 好像太無趣了一點";
    const dialogueRiddle = "來猜猜看吧\n桌子 椅子 錢 過年 尺\n那還缺什麼捏～";
    const dialogueReveal = "恭喜妳解鎖了這副超可愛的粉紅麻將！\n有了它，我們之後的相處時間一定會變得好多好多捏。畢竟我們最喜歡隨時隨地都貼貼惹，以後只要一有空閒的時間，不管外面天氣怎樣，我們都可以膩在我家。我們兩個人玩著雙人麻將，贏了要抱抱，輸了也要抱抱，把所有無聊的時間都變成我們專屬的浪漫。能這樣一直賴在一起，怎麼想都是一件最幸福的事捏～";

    // Typewriter Effect
    useEffect(() => {
        let currentText = '';
        if (step === 0) currentText = dialogueIntro;
        else if (step === 1) currentText = dialogueRiddle;
        else if (step === 3) currentText = dialogueReveal;
        else return;

        setTypedText('');
        setIsTyping(true);

        let i = 0;
        const timer = setInterval(() => {
            setTypedText(currentText.substring(0, i + 1));
            i++;
            if (i === currentText.length) {
                clearInterval(timer);
                setIsTyping(false);
            }
        }, 50); // Typing speed

        return () => clearInterval(timer);
    }, [step]);

    const handleNext = () => {
        if (isTyping) {
            // Skip typing
            setIsTyping(false);
            if (step === 0) setTypedText(dialogueIntro);
            if (step === 1) setTypedText(dialogueRiddle);
            if (step === 3) setTypedText(dialogueReveal);
        } else {
            if (step === 0) setStep(1);
            else if (step === 1) setStep(2); // Go to Quiz
            else if (step === 3) onBack(); // End
        }
    };

    const handleAnswer = (isCorrect) => {
        if (isCorrect) {
            setStep(3); // Go to Reveal
        } else {
            alert("不對喔～再猜猜看！");
        }
    };

    return (
        <div className="anniversary-scene-container" onClick={step !== 2 ? handleNext : undefined}>
            <div className={`content-box pixel-border ${step === 3 ? 'reveal-mode' : ''}`}>
                {/* Steps 0, 1: Intro/Riddle */}
                {(step === 0 || step === 1) && (
                    <div className="dialogue-text">
                        {typedText.split('\n').map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                        {!isTyping && <div className="blink-cursor">▼</div>}
                    </div>
                )}

                {/* Step 2: Quiz */}
                {step === 2 && (
                    <div className="quiz-container">
                        <h2>缺什麼捏？</h2>
                        <div className="options-grid">
                            <button className="pixel-btn" onClick={() => handleAnswer(false)}>1. 橡皮擦</button>
                            <button className="pixel-btn" onClick={() => handleAnswer(false)}>2. 錢包</button>
                            <button className="pixel-btn" onClick={() => handleAnswer(true)}>3. 麻將</button>
                            <button className="pixel-btn" onClick={() => handleAnswer(false)}>4. 大富翁</button>
                        </div>
                    </div>
                )}

                {/* Step 3: Reveal - Image FIRST then Text */}
                {step === 3 && (
                    <div className="reveal-container">
                        <div className="polaroid-frame">
                            <img src={pinkMahjongImg} alt="Pink Mahjong" className="real-mahjong-img" />
                            <p className="image-disclaimer">✨ 圖片僅供參考 ✨</p>
                        </div>

                        <div className="reveal-text">
                            {dialogueReveal.split('\n').map((line, i) => (
                                <p key={i} className={i === 0 ? "highlight-text" : ""}>
                                    {line}
                                </p>
                            ))}
                        </div>
                        <div className="continue-hint">(點擊任意處領取)</div>
                    </div>
                )}
            </div>

            <style>{`
                .anniversary-scene-container {
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.85);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 1000;
                    color: white;
                    font-family: 'Press Start 2P', monospace;
                }
                .content-box {
                    background: #fff;
                    color: #333;
                    padding: 30px; /* More padding */
                    border-radius: 15px;
                    max-width: 90%;
                    width: 500px;
                    min-height: 250px;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                    transition: transform 0.2s;
                }
                .content-box.reveal-mode {
                    width: 600px; /* Wider for reveal */
                }

                .dialogue-text {
                    width: 100%;
                    text-align: center; /* Center text */
                }
                .dialogue-text p {
                    margin: 12px 0;
                    line-height: 1.8;
                    font-size: 1.15rem;
                    font-weight: bold;
                    color: #444;
                }

                .blink-cursor {
                    animation: blink 1s infinite;
                    margin-top: 10px;
                    color: #ff0055;
                    font-size: 1.2rem;
                }
                @keyframes blink { 50% { opacity: 0; } }
                
                .quiz-container h2 {
                    color: #d10000;
                    margin-bottom: 25px;
                    font-size: 1.5rem;
                }
                .options-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    width: 100%;
                }
                .pixel-btn {
                    font-size: 1rem;
                    padding: 15px 10px;
                    background: #f0f0f0;
                    border: 4px solid #ddd;
                    font-family: inherit;
                    cursor: pointer;
                    transition: all 0.2s;
                    border-radius: 8px;
                }
                .pixel-btn:hover {
                    background-color: #ff0055;
                    color: white;
                    border-color: #ffcc00;
                    transform: scale(1.05);
                    box-shadow: 0 5px 15px rgba(255, 0, 85, 0.3);
                }

                /* Reveal Layout */
                .reveal-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                }

                .polaroid-frame {
                    background: white;
                    padding: 10px 10px 30px 10px; /* Polaroid bottom spacing */
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    transform: rotate(-2deg);
                    margin-bottom: 25px;
                    border: 1px solid #eee;
                }
                .real-mahjong-img {
                    max-width: 100%;
                    max-height: 220px;
                    display: block;
                    border: 2px solid #333; /* Thin border around photo */
                }
                .image-disclaimer {
                    font-size: 0.8rem;
                    color: #aaa;
                    margin-top: 10px;
                    text-align: center;
                    font-weight: normal;
                }

                .reveal-text {
                    text-align: center;
                    background: #fff0f5; /* Light Pink BG */
                    padding: 20px;
                    border-radius: 10px;
                    border: 2px dashed #ffccdd;
                    width: 100%;
                }
                .reveal-text p {
                    margin: 8px 0;
                    line-height: 1.6;
                    font-size: 1rem;
                    color: #555;
                }
                .highlight-text {
                    color: #ff0055 !important;
                    font-size: 1.3rem !important;
                    font-weight: 900 !important;
                    margin-bottom: 15px !important;
                }
                .continue-hint {
                    margin-top: 15px;
                    font-size: 0.8rem;
                    color: #999;
                    animation: blink 1.5s infinite;
                }
            `}</style>
        </div>
    );
};

export default AnniversaryScene;
