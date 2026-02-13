import React, { useState, useEffect } from 'react';
import '../ScratchCard/scratch.scss';
// Placeholder import - User needs to add this image!
import trubbishImg from '../../assets/trubbish.png';
import prizeImg from '../../assets/trubbish_prize.jpg';
import questionImg from '../../assets/question_silhouette.jpg';

const PetBattleScene = ({ onBack }) => {
    const [step, setStep] = useState(0); // 0: Intro 1, 1: Intro 2 (Guess Who), 2: Quiz, 3: Reveal
    const [typedText, setTypedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [wrongGuesses, setWrongGuesses] = useState(new Set());

    const wrongOptions = [
        { id: 'pikachu', name: '皮卡丘', msg: '你覺得有那麼簡單嗎~' },
        { id: 'mimikyu', name: <span>謎擬<span style={{ fontFamily: 'Arial, sans-serif' }}>Q</span></span>, msg: '雖然也是畫皮的，但不是這隻啦～', rawName: '謎擬Q' },
        { id: 'rayquaza', name: '列空座', msg: '神獸怎麼可能長這樣啦！' }
    ];

    // Dialogues
    const dialogueIntro1 = "這張來玩點不一樣的";
    const dialogueIntro2 = "猜猜我是誰";
    const dialogueReveal = "為什麼會是這個捏～\n其實我真的蠻謝謝寶寶陪我一起去玩寶可夢的東西捏\n這算是我為數不多的小小興趣\n能有妳陪著我一起參與\n真的不是一般的感動捏\n尤其寶寶去日本還買給我嗚嗚嗚嗚\n\n我也想要跟寶寶一直一直相處\n慢慢培養我們的關係\n努力進化成妳專屬的正港好老公～\n總有一天我一定會準備好大師球\n想辦法徹底收服妳的w！";

    // Typewriter Effect
    useEffect(() => {
        let currentText = '';
        if (step === 0) currentText = dialogueIntro1;
        else if (step === 1) currentText = dialogueIntro2;
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
        }, 50);

        return () => clearInterval(timer);
    }, [step]);

    const handleNext = () => {
        if (isTyping) {
            setIsTyping(false);
            if (step === 0) setTypedText(dialogueIntro1);
            if (step === 1) setTypedText(dialogueIntro2);
            if (step === 3) setTypedText(dialogueReveal);
        } else {
            if (step === 0) setStep(1);
            else if (step === 1) setStep(2); // Go to Quiz
            else if (step === 3) onBack();
        }
    };

    const handleAnswer = (optionId, isCorrect, msg) => {
        if (isCorrect) {
            setStep(3); // Go to Reveal
        } else {
            alert(msg || "不對喔～再猜猜看！");
            setWrongGuesses(prev => new Set(prev).add(optionId));
        }
    };

    return (
        <div className="pet-battle-container" onClick={step !== 2 ? handleNext : undefined}>
            <div className={`content-box pixel-border ${step === 3 ? 'reveal-mode' : ''}`}>

                {/* Intros */}
                {(step === 0 || step === 1) && (
                    <div className="dialogue-text large-text">
                        <p>{typedText}</p>
                        {!isTyping && <div className="blink-cursor">▼</div>}
                    </div>
                )}

                {/* Quiz: Who's that Pokemon? */}
                {step === 2 && (
                    <div className="quiz-container">
                        <div className="pokemon-silhouette-box">
                            {/* Show silhouette until all wrong guesses done, then reveal answer */}
                            <img src={wrongGuesses.size === 3 ? trubbishImg : questionImg} alt="Mystery Pokemon" className={`pokemon-img ${wrongGuesses.size === 3 ? 'reveal-anim' : ''}`} />
                        </div>
                        <div className="options-grid" style={{ gridTemplateColumns: wrongGuesses.size === 3 ? '1fr' : '1fr 1fr' }}>
                            {wrongOptions.map(opt => (
                                !wrongGuesses.has(opt.id) && (
                                    <button
                                        key={opt.id}
                                        className="pixel-btn"
                                        onClick={() => handleAnswer(opt.id, false, opt.msg)}
                                    >
                                        {opt.name}
                                    </button>
                                )
                            ))}

                            {wrongGuesses.size === 3 && (
                                <button
                                    className="pixel-btn"
                                    onClick={() => handleAnswer('trubbish', true)}
                                    style={{ gridColumn: '1 / -1', background: '#FFEB3B', borderColor: '#FFC107', animation: 'popIn 0.5s', fontWeight: 'bold', fontSize: '1.2rem' }}
                                >
                                    ✨ 破破袋 ✨
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Reveal */}
                {step === 3 && (
                    <div className="reveal-container">
                        <div className="pokemon-reveal-box">
                            <img src={prizeImg} alt="Trubbish Prize" className="pokemon-img reveal-anim" />
                            <div className="reveal-title-badge">🎉 破破袋徽章包 🎉</div>
                        </div>

                        <div className="reveal-text">
                            {dialogueReveal.split('\n').map((line, i) => (
                                <p key={i} style={{ margin: '5px 0', minHeight: line === "" ? '10px' : 'auto' }}>{line}</p>
                            ))}
                        </div>
                        <div className="continue-hint">(點擊任意處領取)</div>
                    </div>
                )}
            </div>

            <style>{`
                .pet-battle-container {
                    width: 100%;
                    height: 100%;
                    background-color: rgba(20, 20, 30, 0.9); /* Darker BG */
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
                    min-height: 300px;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 0 20px rgba(0,0,0,0.8);
                    border: 4px solid #333;
                }
                .content-box.reveal-mode {
                    width: 600px;
                }

                .large-text {
                    font-size: 1.5rem;
                    font-weight: bold;
                    text-align: center;
                }
                .blink-cursor {
                    animation: blink 1s infinite;
                    margin-top: 15px;
                    color: #FF5722;
                }

                /* Pokemon Visuals */
                .pokemon-silhouette-box {
                    background: transparent; /* No need for background if image has its own */
                    padding: 0;
                    border-radius: 10px; /* Slight round, no circle */
                    margin-bottom: 20px;
                    border: none;
                }
                .pokemon-img {
                    width: 280px; /* Much larger */
                    height: auto; /* Maintain aspect ratio */
                    max-height: 250px;
                    object-fit: contain;
                    border-radius: 10px;
                }
                .silhouette {
                    filter: brightness(0);
                }
                .reveal-anim {
                    animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                @keyframes popIn {
                    0% { transform: scale(0); }
                    100% { transform: scale(1); }
                }

                .options-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    width: 100%;
                }
                .pixel-btn {
                    font-size: 1rem;
                    padding: 15px;
                    background: #f0f0f0;
                    border: 4px solid #bbb;
                    font-family: inherit;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: all 0.2s;
                    font-weight: bold;
                    color: #333;
                }
                .pixel-btn:hover {
                    background-color: #FF5722;
                    color: white;
                    border-color: #FFC107;
                    transform: scale(1.05);
                }

                /* Reveal Styling */
                .pokemon-reveal-box {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .reveal-title-badge {
                    background: #FF5722;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 20px;
                    margin-top: 10px;
                    font-size: 1.2rem;
                    border: 2px solid #fff;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                }
                .reveal-text {
                    background: #FFF3E0; /* Light Orange */
                    padding: 20px;
                    border-radius: 10px;
                    border: 2px dashed #FFB74D;
                    width: 100%;
                    text-align: center; /* Center */
                    line-height: 1.8;
                    color: #5D4037;
                }
                .continue-hint {
                    margin-top: 15px;
                    font-size: 0.8rem;
                    color: #888;
                }
            `}</style>
        </div>
    );
};

export default PetBattleScene;
