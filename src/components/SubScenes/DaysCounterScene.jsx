import React, { useState, useEffect } from 'react';
import '../ScratchCard/scratch.scss'; // Reuse styles

const DaysCounterScene = ({ onBack }) => {
    const [step, setStep] = useState(0); // 0: Intro, 1: Quiz, 2: Reveal
    const [typedText, setTypedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Dialogues
    const dialogueIntro = "這次也是選擇題喔 其實跟這張刮刮樂長的蠻像的";
    const dialogueReveal = "其實送這個東東捏 會讓我有個感觸是\n因為每一個洞都會有不一樣的東西捏 都會帶著驚喜感\n\n我就會想到我跟寶寶呀\n交往惹四個月一定就只是個開始\n我們要面對的事情 肯定還有幾千幾百樣\n\n我們要攜手去選擇每一個洞洞\n可能我們在競爭 我們在合作\n但都是在與你一起經歷 想想就好刺激好開心\n\n其實未來遇到什麼笨笨的事我都不會沮喪\n因為我已經戳到我的大獎了呀 嘿嘿";

    // Typewriter Effect
    useEffect(() => {
        let currentText = '';
        if (step === 0) currentText = dialogueIntro;
        else if (step === 2) currentText = dialogueReveal;
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
        }, 50);

        return () => clearInterval(timer);
    }, [step]);

    const handleNext = () => {
        if (isTyping) {
            setIsTyping(false);
            if (step === 0) setTypedText(dialogueIntro);
            if (step === 2) setTypedText(dialogueReveal);
        } else {
            if (step === 0) setStep(1); // Go to Quiz
            else if (step === 2) onBack(); // End
        }
    };

    const handleAnswer = (isCorrect, wrongMsg) => {
        if (isCorrect) {
            setStep(2); // Go to Reveal
        } else {
            alert(wrongMsg || "不對喔～再猜猜看！");
        }
    };

    return (
        <div className="days-scene-container" onClick={step !== 1 ? handleNext : undefined}>
            <div className={`content-box pixel-border ${step === 2 ? 'reveal-mode' : ''}`}>

                {/* Intro */}
                {step === 0 && (
                    <div className="dialogue-text">
                        {typedText.split('\n').map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                        {!isTyping && <div className="blink-cursor">▼</div>}
                    </div>
                )}

                {/* Quiz */}
                {step === 1 && (
                    <div className="quiz-container">
                        <h2>其實是什麼捏？<br /><span className="hint-text">(你可以先選選看錯誤答案)</span></h2>
                        <div className="options-grid">
                            <button className="pixel-btn" onClick={() => handleAnswer(false, "這個選項我邊笑邊打")}>1. 綠豆糕</button>
                            <button className="pixel-btn" onClick={() => handleAnswer(false, "我知道你很急但你先別急 張寶寶目前還選不出對的盤 再請我的漂亮寶寶多多暗示")}>2. 眼影盤</button>
                            <button className="pixel-btn" onClick={() => handleAnswer(false, "一副麻將就夠惹 那麼多是要去夜市擺攤喔")}>3. 麻將</button>
                            <button className="pixel-btn" onClick={() => handleAnswer(true)}>4. 洞洞樂</button>
                        </div>
                    </div>
                )}

                {/* Reveal */}
                {step === 2 && (
                    <div className="reveal-container">

                        <div className="reveal-title">✨ 洞洞樂 ✨</div>

                        <div className="reveal-text">
                            {dialogueReveal.split('\n').map((line, i) => (
                                <p key={i} className={line === "" ? "spacer" : ""}>{line}</p>
                            ))}
                        </div>
                        <div className="continue-hint">(點擊任意處領取)</div>
                    </div>
                )}
            </div>

            <style>{`
                .days-scene-container {
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
                    padding: 30px;
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
                    transition: all 0.3s;
                }
                .content-box.reveal-mode {
                    width: 700px; /* Wider for punch board */
                }

                .dialogue-text {
                    width: 100%;
                    text-align: center;
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
                    color: #2196F3; /* Blue for Days scene */
                    font-size: 1.2rem;
                }

                .quiz-container h2 {
                    color: #2196F3;
                    margin-bottom: 25px;
                    font-size: 1.5rem;
                    text-align: center;
                    line-height: 1.5;
                }
                .hint-text {
                    font-size: 0.8rem;
                    color: #bbb;
                    font-weight: normal;
                    display: block;
                    margin-top: 5px;
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
                    background: #e0e0e0; /* Darker gray background */
                    border: 4px solid #bbb; /* Darker border */
                    color: #333; /* Explicit dark text */
                    font-family: inherit;
                    cursor: pointer;
                    transition: all 0.2s;
                    border-radius: 8px;
                    line-height: 1.4;
                    font-weight: bold;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                .pixel-btn:hover {
                    background-color: #2196F3;
                    color: white;
                    border-color: #FFC107;
                    transform: scale(1.05);
                    box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3);
                }

                /* Punch Board Visual */
                .punch-board-visual {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 10px;
                    background: #8D6E63; /* Wood/Cardboard color */
                    padding: 15px;
                    border-radius: 8px;
                    border: 4px solid #5D4037;
                    margin-bottom: 20px;
                }
                .punch-hole {
                    width: 40px;
                    height: 40px;
                    background: #FFC107; /* Paper cover */
                    border-radius: 50%;
                    border: 2px solid #FFA000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.2rem;
                    box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);
                }
                .punch-hole.punched {
                    background: #333; /* Empty hole */
                    box-shadow: inset 0 5px 10px rgba(0,0,0,0.8);
                    color: #FF4081; /* Heart color */
                }

                .reveal-title {
                    font-size: 1.5rem;
                    color: #2196F3;
                    margin-bottom: 15px;
                    font-weight: bold;
                }

                .reveal-text {
                    text-align: center;
                    background: #E3F2FD; /* Light Blue BG */
                    padding: 25px;
                    border-radius: 10px;
                    border: 2px dashed #90CAF9;
                    width: 100%;
                }
                .reveal-text p {
                    margin: 5px 0;
                    line-height: 1.8;
                    font-size: 1rem;
                    color: #444;
                }
                .reveal-text .spacer {
                    height: 15px;
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

export default DaysCounterScene;
