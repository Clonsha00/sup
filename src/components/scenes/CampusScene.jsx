import React, { useRef, useEffect } from 'react';

const CampusScene = ({ width, height }) => {
    const canvasRef = useRef(null);
    const bgCacheRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        let frame = 0;
        let animId;

        const lerpColor = (r1, g1, b1, r2, g2, b2, t) =>
            [Math.floor(r1 + (r2 - r1) * t), Math.floor(g1 + (g2 - g1) * t), Math.floor(b1 + (b2 - b1) * t)];

        const skyH = height * 0.36;
        const grassTop = skyH + height * 0.12;
        const pathTop = grassTop + height * 0.12;
        const pathBot = pathTop + height * 0.14;
        const sunCX = width * 0.14;
        const sunCY = skyH * 0.45;
        const px = Math.max(2, Math.floor(height / 200));
        const cols = Math.ceil(width / px);
        const buildBase = Math.floor(skyH / px) + Math.floor((grassTop - skyH) / px);
        const grassRow = Math.floor(grassTop / px);

        // ── Render static background ONCE ──
        const renderBg = () => {
            const w = width, h = height;
            const offscreen = document.createElement('canvas');
            offscreen.width = w;
            offscreen.height = h;
            const offCtx = offscreen.getContext('2d');
            const imgData = offCtx.createImageData(w, h);
            const data = imgData.data;

            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    const idx = (y * w + x) * 4;
                    let r, g, b;

                    if (y < skyH) {
                        const t = y / skyH;
                        const c1 = [255, 90, 50], c2 = [255, 160, 80], c3 = [255, 200, 130], c4 = [255, 230, 190];
                        if (t < 0.3) [r, g, b] = lerpColor(...c1, ...c2, t / 0.3);
                        else if (t < 0.6) [r, g, b] = lerpColor(...c2, ...c3, (t - 0.3) / 0.3);
                        else[r, g, b] = lerpColor(...c3, ...c4, (t - 0.6) / 0.4);

                        // Sun glow
                        const sd = Math.sqrt((x - sunCX) ** 2 + (y - sunCY) ** 2);
                        const sR = h * 0.15;
                        if (sd < sR * 4) { const gl = 1 - sd / (sR * 4); r = Math.min(255, r + gl * 80); g = Math.min(255, g + gl * 50); b = Math.min(255, b + gl * 20); }
                        if (sd < sR * 0.5) { const co = 1 - sd / (sR * 0.5); r = Math.min(255, r + co * 60); g = Math.min(255, g + co * 40); b = Math.min(255, b + co * 20); }
                    } else if (y < grassTop) {
                        const t = (y - skyH) / (grassTop - skyH);
                        [r, g, b] = lerpColor(80, 145, 50, 70, 130, 42, t);
                    } else if (y < pathTop) {
                        const t = (y - grassTop) / (pathTop - grassTop);
                        [r, g, b] = lerpColor(85, 150, 48, 75, 135, 40, t);
                        const gn = Math.sin(x * 67.3 + y * 211.1) * 43758.5453;
                        const gnv = (gn - Math.floor(gn)) * 12 - 6;
                        r += gnv * 0.5; g += gnv; b += gnv * 0.3;
                        if (t < 0.05) { const bl = Math.sin(x * 0.5) * 0.5 + 0.5; if (bl > 0.6) { r -= 8; g += 12; b -= 5; } }
                    } else if (y < pathBot) {
                        const t = (y - pathTop) / (pathBot - pathTop);
                        [r, g, b] = lerpColor(215, 175, 115, 195, 155, 100, t);
                        const bEX = (x + ((Math.floor((y - pathTop) / 6) % 2 === 0) ? 0 : 6)) % 12;
                        const bEY = (y - pathTop) % 6;
                        if (bEX === 0 || bEY === 0) { r -= 8; g -= 8; b -= 5; }
                        const spd = Math.abs(x - sunCX) / w;
                        if (spd < 0.3) { const wm = (1 - spd / 0.3) * 0.12; r += wm * 30; g += wm * 15; }
                    } else {
                        const t = (y - pathBot) / (h - pathBot);
                        [r, g, b] = lerpColor(75, 135, 42, 65, 120, 35, t);
                        const gn2 = Math.sin(x * 47.3 + y * 131.1) * 43758.5453;
                        g += (gn2 - Math.floor(gn2)) * 8 - 4;
                    }

                    // Global sunset wash
                    const sw = Math.max(0, 1 - Math.sqrt((x - sunCX) ** 2 + (y - sunCY) ** 2) / (w * 0.7));
                    r += sw * 8; g += sw * 3;

                    data[idx] = Math.max(0, Math.min(255, r));
                    data[idx + 1] = Math.max(0, Math.min(255, g));
                    data[idx + 2] = Math.max(0, Math.min(255, b));
                    data[idx + 3] = 255;
                }
            }

            offCtx.putImageData(imgData, 0, 0);

            // ── Static pixel overlays (buildings, trees, bench, lamp) ──
            const dp = (x, y, w, h, c) => { offCtx.fillStyle = c; offCtx.fillRect(x * px, y * px, w * px, h * px); };

            // Main building
            const mbx = Math.floor(cols * 0.25), mbw = Math.floor(cols * 0.5), mbh = 30, bBase = grassRow;
            dp(mbx, bBase - mbh, mbw, mbh, '#c4956a');
            dp(mbx + 1, bBase - mbh + 1, mbw - 2, 1, '#d4a57a');
            dp(mbx, bBase - mbh, 1, mbh, '#d4a57a');
            dp(mbx + mbw - 1, bBase - mbh, 1, mbh, '#b48560');
            dp(mbx - 2, bBase - mbh - 2, mbw + 4, 2, '#7a3a12');
            dp(mbx - 1, bBase - mbh - 3, mbw + 2, 1, '#6a2a08');
            for (let row = 0; row < 3; row++) for (let col = 0; col < 8; col++) {
                const wx = mbx + 4 + col * Math.floor((mbw - 10) / 8), wy = bBase - mbh + 5 + row * 8;
                dp(wx, wy, 3, 4, '#9ec4d8'); dp(wx + 1, wy, 1, 4, '#b8dce8');
                dp(wx, wy + 4, 3, 1, '#8b7355'); dp(wx, wy - 1, 3, 1, '#8b7355');
            }
            const entX = mbx + Math.floor(mbw / 2) - 4;
            dp(entX, bBase - 10, 9, 10, '#5a3a20'); dp(entX + 1, bBase - 11, 7, 1, '#6b4b30');
            dp(entX + 3, bBase - 8, 3, 8, '#4a2a15');
            dp(entX - 2, bBase - 2, 13, 1, '#b8956a'); dp(entX - 3, bBase - 1, 15, 1, '#a88560');

            // Clock tower
            const tX = mbx + Math.floor(mbw / 2) - 4;
            dp(tX, bBase - mbh - 22, 9, 20, '#b88a5c'); dp(tX + 1, bBase - mbh - 21, 1, 18, '#c89a6c');
            dp(tX - 1, bBase - mbh - 24, 11, 2, '#7a3a12');
            dp(tX + 3, bBase - mbh - 30, 3, 6, '#7a3a12'); dp(tX + 3, bBase - mbh - 33, 3, 3, '#6a2a08');
            dp(tX + 4, bBase - mbh - 36, 1, 3, '#5a2008');
            dp(tX + 2, bBase - mbh - 18, 5, 5, '#fff'); dp(tX + 3, bBase - mbh - 17, 3, 3, '#f8f8f0');
            dp(tX + 4, bBase - mbh - 17, 1, 2, '#333'); dp(tX + 4, bBase - mbh - 16, 2, 1, '#333');

            // Side buildings
            dp(2, bBase - 18, 16, 18, '#c09060'); dp(1, bBase - 19, 18, 1, '#7a3a12');
            for (let c = 0; c < 3; c++) dp(4 + c * 5, bBase - 14, 3, 3, '#9ec4d8');
            const rbx = Math.floor(cols * 0.8);
            dp(rbx, bBase - 20, 18, 20, '#b88555'); dp(rbx - 1, bBase - 21, 20, 1, '#7a3a12');
            for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) dp(rbx + 3 + c * 5, bBase - 16 + r * 8, 3, 3, '#9ec4d8');

            // Trees
            const drawTree = (tx, ty, type) => {
                dp(tx + 4, ty + 12, 3, 12, '#6b3a15'); dp(tx + 5, ty + 12, 1, 12, '#7b4a25');
                dp(tx + 3, ty + 23, 2, 1, '#6b3a15'); dp(tx + 7, ty + 23, 2, 1, '#6b3a15');
                if (type === 0) {
                    dp(tx, ty + 3, 12, 10, '#1a7a1a'); dp(tx + 2, ty, 8, 5, '#228b22');
                    dp(tx + 4, ty - 1, 4, 2, '#2a9a2a'); dp(tx + 2, ty + 5, 4, 3, '#32cd32');
                    dp(tx + 7, ty + 2, 3, 3, '#1e8a1e'); dp(tx + 1, ty + 3, 3, 2, '#3aaa3a');
                } else {
                    dp(tx, ty + 2, 12, 10, '#b85500'); dp(tx + 1, ty, 10, 4, '#cc6600');
                    dp(tx + 3, ty - 2, 6, 3, '#dd7700'); dp(tx + 1, ty + 5, 4, 3, '#ee8800');
                    dp(tx + 7, ty + 3, 4, 3, '#cc4400'); dp(tx + 9, ty + 8, 3, 2, '#aa4400');
                    dp(tx + 2, ty + 1, 3, 2, '#ee9922');
                }
            };
            drawTree(2, bBase - 36, 1); drawTree(Math.floor(cols * 0.16), bBase - 40, 0);
            drawTree(Math.floor(cols * 0.73), bBase - 35, 1); drawTree(Math.floor(cols * 0.88), bBase - 38, 0);
            drawTree(cols - 14, bBase - 32, 1);

            // Bench
            const benchRow = Math.floor(pathTop / px) - 2, benchX = Math.floor(cols * 0.78);
            dp(benchX, benchRow, 12, 1, '#8b4513'); dp(benchX, benchRow - 2, 12, 1, '#a0522d');
            dp(benchX - 1, benchRow - 3, 1, 2, '#7a3a0a'); dp(benchX + 12, benchRow - 3, 1, 2, '#7a3a0a');
            dp(benchX, benchRow + 1, 1, 3, '#7a3a0a'); dp(benchX + 11, benchRow + 1, 1, 3, '#7a3a0a');

            // Lamp post
            const lampX = Math.floor(cols * 0.24), lampRow = Math.floor(grassTop / px);
            dp(lampX, lampRow + 2, 1, Math.floor((pathTop - grassTop) / px) - 2, '#555');
            dp(lampX - 1, lampRow + 1, 3, 1, '#666'); dp(lampX, lampRow, 1, 1, '#ffee88');

            bgCacheRef.current = offscreen;
        };

        renderBg();

        // Leaves particle system
        const leaves = [];
        for (let i = 0; i < 15; i++) {
            leaves.push({
                x: Math.random() * width, y: Math.random() * height,
                vx: -0.3 - Math.random() * 0.4, vy: 0.3 + Math.random() * 0.5,
                sway: Math.random() * 6, swaySpeed: 0.01 + Math.random() * 0.02,
                color: [[255, 140, 0], [218, 165, 32], [204, 68, 0], [238, 119, 0],
                [187, 85, 0], [255, 102, 0], [221, 136, 0]][Math.floor(Math.random() * 7)],
                size: 2 + Math.random() * 2
            });
        }

        const draw = () => {
            // Draw cached background
            ctx.drawImage(bgCacheRef.current, 0, 0);

            // ── Animated: Clouds ──
            const cd = (frame * 0.2 + 50) % (width + 400) - 200;
            ctx.fillStyle = 'rgba(255,240,220,0.35)';
            ctx.fillRect(cd, skyH * 0.22, 100, 8);
            ctx.fillRect(cd + 20, skyH * 0.18, 60, 6);

            // ── Animated: Lamp glow ──
            const lampX = Math.floor(cols * 0.24), lampRow = Math.floor(grassTop / px);
            ctx.fillStyle = 'rgba(255,238,136,0.03)';
            for (let g = 1; g < 6; g++) {
                ctx.fillRect((lampX - g) * px, (lampRow + g) * px, (1 + g * 2) * px, px);
            }

            // ── Animated: Falling leaves ──
            leaves.forEach(leaf => {
                leaf.x += leaf.vx + Math.sin(frame * leaf.swaySpeed + leaf.sway) * 0.8;
                leaf.y += leaf.vy;
                if (leaf.y > height + 10) { leaf.y = -10; leaf.x = Math.random() * width; }
                if (leaf.x < -10) leaf.x = width + 10;
                ctx.fillStyle = `rgba(${leaf.color[0]},${leaf.color[1]},${leaf.color[2]},0.15)`;
                ctx.fillRect(leaf.x - 2, leaf.y - 2, leaf.size + 4, leaf.size + 4);
                ctx.fillStyle = `rgb(${leaf.color[0]},${leaf.color[1]},${leaf.color[2]})`;
                ctx.fillRect(Math.floor(leaf.x), Math.floor(leaf.y), leaf.size, leaf.size);
            });

            // ── Volumetric haze ──
            const hazeGrad = ctx.createLinearGradient(0, skyH - height * 0.03, 0, skyH + height * 0.06);
            hazeGrad.addColorStop(0, 'rgba(255,210,170,0)');
            hazeGrad.addColorStop(0.5, 'rgba(255,210,170,0.08)');
            hazeGrad.addColorStop(1, 'rgba(255,210,170,0)');
            ctx.fillStyle = hazeGrad;
            ctx.fillRect(0, skyH - height * 0.03, width, height * 0.09);

            // ── Sunset light rays ──
            ctx.globalAlpha = 0.03;
            ctx.fillStyle = '#ffaa44';
            for (let i = 0; i < 5; i++) {
                const rayAngle = -0.3 + i * 0.15;
                ctx.save(); ctx.translate(sunCX, sunCY); ctx.rotate(rayAngle);
                ctx.fillRect(0, -3, width * 0.7, 6 + i * 2); ctx.restore();
            }
            ctx.globalAlpha = 1;

            frame++;
            animId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animId);
    }, [width, height]);

    return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />;
};

export default CampusScene;
