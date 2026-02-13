import React, { useState } from 'react';

const FinalLetter = ({ onBack }) => {
    // States: 0 = Envelope, 1 = Opening animation, 2 = Reading letter
    const [step, setStep] = useState(0);
    const [showContent, setShowContent] = useState(false);

    const letterContent = {
        to: '給郭丁綺：',
        greeting: '情人節快樂呀！',
        paragraphs: [
            '這些就是這次情人節的小驚喜了呀，希望寶寶妳會喜歡～',
            '這段期間不小心惹妳生氣，而且又沒辦法在妳身邊，抱歉捏寶寶，等回到台中一定大大的彌補妳！其實我也知道寶寶這段期間是生理期比較不舒服，但妳生氣的時候我還是笨笨的。',
            '每次想到妳不開心，我就會超級自責，心裡一直想著「如果我在妳身邊就好了」，至少可以抱抱妳。等我回去，這些通通補上，一個都不會少！',
            '我現在還是個「初階男朋友」，但我會好好觀察、好好學習，努力進化變成妳的「正港男朋友」，帶給寶寶滿滿的幸福！',
            '雖然有時候笨笨的、反應慢半拍，但我對妳的心意是真的很認真的。每一次妳跟我說的話，我都有偷偷記在心裡，慢慢改、慢慢變成更好的人，都是因為妳捏。',
            '經歷了這次整整一個月沒有見面，沒有寶寶在身邊真的好難受哇。每次看到漂亮寶寶的照片或可愛的樣子，內心都會「高速公鹿」惹，超級想要趕快與妳相遇！',
            '想到我們一起吃飯、一起打麻將、一起抓寶可夢的那些日子，就覺得好幸福。連一起在我家睡覺，都變成了最珍貴的回憶捏～',
            '以後我要帶妳去更多好玩的地方，吃更多好吃的東西，創造更多只屬於我們兩個人的回憶。不管是晴天雨天，只要跟寶寶在一起，每一天都是最棒的一天！都是情人節喔！',
            '謝謝寶寶陪伴我這 125 天，謝謝妳包容我這個笨笨的直男寶寶。真的好愛好愛妳喔，妳這個可愛到極致的小寶貝！',
            '不管怎麼樣，身後都還是有我緊緊抱著妳窩～'
        ],
        signature: '張文諺 上'
    };

    const handleEnvelopeClick = () => {
        if (step === 0) {
            setStep(1);
            setTimeout(() => {
                setStep(2);
                setTimeout(() => setShowContent(true), 300);
            }, 1200);
        }
    };

    return (
        <div className="final-letter-scene">
            {/* Floating hearts background */}
            <div className="hearts-bg">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="floating-heart"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                            fontSize: `${12 + Math.random() * 20}px`,
                            opacity: 0.3 + Math.random() * 0.4
                        }}
                    >
                        ❤
                    </div>
                ))}
            </div>

            {/* Envelope State */}
            {step < 2 && (
                <div className={`envelope-wrapper ${step === 1 ? 'opening' : ''}`} onClick={handleEnvelopeClick}>
                    <div className="envelope">
                        <div className="envelope-flap"></div>
                        <div className="envelope-body-inner">
                            <div className="heart-seal">
                                <span>❤️</span>
                            </div>
                        </div>
                        <div className="envelope-front"></div>
                    </div>
                    {step === 0 && (
                        <div className="tap-hint">
                            <span className="sparkle">✨</span>
                            {' '}點擊開啟{' '}
                            <span className="sparkle">✨</span>
                        </div>
                    )}
                </div>
            )}

            {/* Letter State */}
            {step === 2 && (
                <div className={`letter-wrapper ${showContent ? 'visible' : ''}`}>
                    <div className="letter-paper">
                        <div className="letter-deco-top">~ ❤ ~</div>

                        <div className="letter-to">{letterContent.to}</div>
                        <div className="letter-greeting">{letterContent.greeting}</div>

                        <div className="letter-body">
                            {letterContent.paragraphs.map((p, i) => (
                                <p key={i} className="letter-p" style={{ animationDelay: `${0.5 + i * 0.3}s` }}>
                                    {p}
                                </p>
                            ))}
                        </div>

                        <div className="letter-sig">{letterContent.signature}</div>
                        <div className="letter-deco-bottom">~ ❤ ~</div>
                    </div>

                    {onBack && (
                        <button className="letter-back-btn" onClick={onBack}>返回 ↩</button>
                    )}
                </div>
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;700&display=swap');

                .final-letter-scene {
                    position: fixed;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 30%, #4a2040 60%, #2d1b4e 100%);
                    overflow-y: auto;
                    padding: 20px;
                    z-index: 100;
                    cursor: default !important;
                }

                .hearts-bg {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    overflow: hidden;
                    z-index: 0;
                }
                .floating-heart {
                    position: absolute;
                    bottom: -30px;
                    color: #ff6b9d;
                    animation: floatUpHeart linear infinite;
                }
                @keyframes floatUpHeart {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                    10% { opacity: 0.6; }
                    90% { opacity: 0.3; }
                    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
                }

                .envelope-wrapper {
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 24px;
                    z-index: 10;
                    animation: envelopeFloat 3s ease-in-out infinite;
                }
                @keyframes envelopeFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .envelope {
                    position: relative;
                    width: 300px;
                    height: 200px;
                }

                .envelope-body-inner {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(180deg, #f5e6d3, #eddcc8);
                    border-radius: 8px;
                    border: 3px solid #d4a574;
                    z-index: 1;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                }

                .envelope-front {
                    display: none;
                }

                .envelope-flap {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100px;
                    background: linear-gradient(180deg, #e8d0b8, #dfc4a8);
                    border: 3px solid #d4a574;
                    border-bottom: none;
                    clip-path: polygon(0 0, 50% 100%, 100% 0);
                    transform-origin: top center;
                    z-index: 3;
                    transition: transform 0.8s ease-in-out;
                }

                .envelope-wrapper.opening .envelope-flap {
                    transform: rotateX(180deg);
                }
                .envelope-wrapper.opening .envelope {
                    animation: envShake 0.3s ease-in-out 0.5s;
                }
                @keyframes envShake {
                    0%, 100% { transform: rotate(0); }
                    25% { transform: rotate(-3deg); }
                    75% { transform: rotate(3deg); }
                }

                .heart-seal {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 48px;
                    z-index: 5;
                    animation: sealPulse 1.5s ease-in-out infinite;
                    filter: drop-shadow(0 2px 10px rgba(255, 80, 100, 0.5));
                }
                @keyframes sealPulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.12); }
                }

                .tap-hint {
                    font-family: 'Noto Serif TC', serif;
                    font-size: 18px;
                    color: #ffcce0;
                    letter-spacing: 4px;
                    animation: hintFade 2s ease-in-out infinite;
                }
                .sparkle {
                    display: inline-block;
                    animation: sparkleGlow 1.5s ease-in-out infinite;
                }
                @keyframes sparkleGlow {
                    0%, 100% { opacity: 0.4; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                @keyframes hintFade {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }

                .letter-wrapper {
                    z-index: 10;
                    width: 100%;
                    max-width: 520px;
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .letter-wrapper.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .letter-paper {
                    background: linear-gradient(180deg, #fef9f0, #fdf3e3 50%, #fcebd5);
                    border-radius: 4px;
                    padding: 36px 32px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3), inset 0 0 60px rgba(200, 170, 130, 0.15);
                    position: relative;
                    border: 1px solid #e0cdb5;
                    max-height: 75vh;
                    overflow-y: auto;
                }
                .letter-paper::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: repeating-linear-gradient(
                        transparent, transparent 31px,
                        rgba(180, 160, 140, 0.15) 31px,
                        rgba(180, 160, 140, 0.15) 32px
                    );
                    pointer-events: none;
                    border-radius: 4px;
                }

                .letter-deco-top, .letter-deco-bottom {
                    text-align: center;
                    color: #d4a574;
                    font-size: 16px;
                    letter-spacing: 8px;
                    margin: 8px 0;
                }
                .letter-deco-bottom { margin-top: 20px; }

                .letter-to {
                    font-family: 'Noto Serif TC', serif;
                    font-size: 18px;
                    color: #5a3e28;
                    margin-bottom: 16px;
                    font-weight: 700;
                }

                .letter-greeting {
                    font-family: 'Noto Serif TC', serif;
                    font-size: 22px;
                    color: #c0392b;
                    font-weight: 700;
                    margin-bottom: 20px;
                    text-align: center;
                    animation: greetGlow 2s ease-in-out infinite;
                }
                @keyframes greetGlow {
                    0%, 100% { text-shadow: 0 0 4px rgba(192, 57, 43, 0.2); }
                    50% { text-shadow: 0 0 12px rgba(192, 57, 43, 0.5); }
                }

                .letter-body { line-height: 1.9; }

                .letter-p {
                    font-family: 'Noto Serif TC', serif;
                    font-size: 15px;
                    color: #4a3728;
                    margin: 0 0 14px 0;
                    text-indent: 2em;
                    opacity: 0;
                    animation: fadeP 0.6s ease forwards;
                }
                @keyframes fadeP {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .letter-sig {
                    font-family: 'Noto Serif TC', serif;
                    font-size: 16px;
                    color: #5a3e28;
                    text-align: right;
                    margin-top: 24px;
                    font-weight: 700;
                    font-style: italic;
                }

                .letter-back-btn {
                    display: block;
                    margin: 20px auto 0;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.3);
                    color: #ffcce0;
                    padding: 8px 24px;
                    border-radius: 20px;
                    font-family: 'Noto Serif TC', serif;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .letter-back-btn:hover {
                    background: rgba(255,255,255,0.2);
                }
            `}</style>
        </div>
    );
};

export default FinalLetter;
