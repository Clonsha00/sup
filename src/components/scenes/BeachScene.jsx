import React, { useRef, useEffect } from 'react';

const BeachScene = ({ width, height }) => {
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

        // ── Render static background ONCE ──
        const renderBg = () => {
            const w = width, h = height;
            const offscreen = document.createElement('canvas');
            offscreen.width = w;
            offscreen.height = h;
            const offCtx = offscreen.getContext('2d');
            const imgData = offCtx.createImageData(w, h);
            const data = imgData.data;

            const skyH = h * 0.32;
            const oceanTop = skyH;
            const oceanH = h * 0.22;
            const shoreH = h * 0.04;
            const sandTop = oceanTop + oceanH + shoreH;

            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    const idx = (y * w + x) * 4;
                    let r, g, b;

                    if (y < skyH) {
                        const t = y / skyH;
                        const skyTop = [60, 140, 220], skyMid = [120, 190, 240], skyBot = [180, 220, 250];
                        [r, g, b] = t < 0.5
                            ? lerpColor(...skyTop, ...skyMid, t / 0.5)
                            : lerpColor(...skyMid, ...skyBot, (t - 0.5) / 0.5);

                        // Sun glow
                        const sunCX = w * 0.82, sunCY = skyH * 0.28;
                        const dist = Math.sqrt((x - sunCX) ** 2 + (y - sunCY) ** 2);
                        const sunR = h * 0.12;
                        if (dist < sunR * 3) {
                            const glow = 1 - dist / (sunR * 3);
                            r = Math.min(255, r + glow * 120);
                            g = Math.min(255, g + glow * 100);
                            b = Math.min(255, b + glow * 40);
                        }
                        if (dist < sunR * 0.6) {
                            const core = 1 - dist / (sunR * 0.6);
                            r = Math.min(255, r + core * 80);
                            g = Math.min(255, g + core * 70);
                            b = Math.min(255, b + core * 30);
                        }
                    } else if (y < oceanTop + oceanH) {
                        const ot = (y - oceanTop) / oceanH;
                        [r, g, b] = ot < 0.5
                            ? lerpColor(20, 100, 210, 15, 80, 185, ot / 0.5)
                            : lerpColor(15, 80, 185, 10, 60, 160, (ot - 0.5) / 0.5);
                    } else if (y < sandTop) {
                        const st = (y - oceanTop - oceanH) / shoreH;
                        [r, g, b] = st < 0.5
                            ? lerpColor(160, 200, 230, 220, 210, 185, st / 0.5)
                            : lerpColor(220, 210, 185, 245, 222, 180, (st - 0.5) / 0.5);
                    } else {
                        const st = (y - sandTop) / (h - sandTop);
                        [r, g, b] = lerpColor(248, 225, 185, 220, 190, 145, st);
                        const noise = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
                        const grain = (noise - Math.floor(noise)) * 12 - 6;
                        r = Math.max(0, Math.min(255, r + grain));
                        g = Math.max(0, Math.min(255, g + grain * 0.8));
                        b = Math.max(0, Math.min(255, b + grain * 0.5));
                        if (st < 0.1) {
                            const wetness = (1 - st / 0.1) * 0.2;
                            r -= wetness * 30; g -= wetness * 15; b += wetness * 15;
                        }
                    }

                    data[idx] = r; data[idx + 1] = g; data[idx + 2] = b; data[idx + 3] = 255;
                }
            }

            offCtx.putImageData(imgData, 0, 0);

            // Sun core
            const px = Math.max(2, Math.floor(h / 180));
            const sunX = Math.floor(w * 0.82 / px), sunY = Math.floor(skyH * 0.28 / px);
            offCtx.fillStyle = '#fff8c0';
            offCtx.fillRect(sunX * px - 2 * px, sunY * px - 2 * px, 5 * px, 5 * px);
            offCtx.fillStyle = '#fffde8';
            offCtx.fillRect(sunX * px - px, sunY * px - px, 3 * px, 3 * px);

            bgCacheRef.current = offscreen;
        };

        renderBg();

        const skyH = height * 0.32;
        const oceanTop = skyH;
        const oceanH = height * 0.22;
        const px = Math.max(2, Math.floor(height / 180));
        const cols = Math.ceil(width / px);
        const dp = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x * px, y * px, w * px, h * px); };

        const draw = () => {
            // Draw cached background
            ctx.drawImage(bgCacheRef.current, 0, 0);

            // ── Animated waves overlay (slowed down) ──
            for (let layer = 0; layer < 4; layer++) {
                const alpha = 0.35 - layer * 0.06;
                const speed = 0.8 - layer * 0.15;
                const rowOff = oceanTop + layer * oceanH / 5;
                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                for (let x = 0; x < width; x += 5) {
                    const wy = Math.sin((x * 0.012 + frame * speed * 0.012)) * 3;
                    ctx.fillRect(x, rowOff + wy, 4, 2);
                }
            }

            // Sun reflections (slower)
            const sunReflX = width * 0.82;
            ctx.fillStyle = 'rgba(255,240,200,0.1)';
            for (let i = 0; i < 6; i++) {
                const rx = sunReflX + Math.sin(frame * 0.012 + i) * 8;
                const ry = oceanTop + 5 + i * (oceanH / 7);
                ctx.fillRect(rx - 4, ry, 8, 2);
            }

            // Shoreline foam (slower)
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            for (let x = 0; x < width; x += 6) {
                const fy = Math.sin((x + frame * 0.4) / 8) * 3;
                ctx.fillRect(x, oceanTop + oceanH + fy - 2, 5, 3);
            }

            // ── Props (drawn AFTER waves, so they appear in front) ──
            const scy = Math.floor((height * 0.54) / px);

            // Palm Tree Left
            const ptx = Math.floor(cols * 0.05), pty = scy - 38;
            dp(ptx + 6, pty + 12, 3, 4, '#a0704d'); dp(ptx + 6, pty + 16, 4, 4, '#8b5e3c');
            dp(ptx + 6, pty + 20, 4, 4, '#9b6840'); dp(ptx + 6, pty + 24, 4, 4, '#8b5e3c');
            dp(ptx + 6, pty + 28, 4, 4, '#9b6840'); dp(ptx + 6, pty + 32, 4, 4, '#8b5e3c');
            dp(ptx + 6, pty + 36, 4, 4, '#9b6840'); dp(ptx + 5, pty + 40, 5, 4, '#8b5e3c');
            dp(ptx + 5, pty + 44, 6, 3, '#7a4e2c');
            dp(ptx + 7, pty + 12, 1, 32, '#a8785a');
            dp(ptx + 2, pty, 10, 3, '#1e8a1e'); dp(ptx + 1, pty + 3, 12, 3, '#228b22');
            dp(ptx + 3, pty + 6, 8, 3, '#2a9a2a'); dp(ptx - 2, pty + 1, 4, 4, '#1a7a1a');
            dp(ptx - 5, pty + 3, 4, 3, '#157015'); dp(ptx + 12, pty + 1, 4, 4, '#1e8a1e');
            dp(ptx + 15, pty + 3, 4, 3, '#157015'); dp(ptx + 4, pty - 2, 6, 2, '#32cd32');
            dp(ptx + 5, pty - 3, 4, 1, '#3adb3a'); dp(ptx + 0, pty + 5, 3, 2, '#228b22');
            dp(ptx + 11, pty + 5, 3, 2, '#228b22'); dp(ptx + 3, pty + 9, 8, 3, '#1a7a1a');
            dp(ptx + 5, pty + 9, 3, 3, '#6b3a15'); dp(ptx + 6, pty + 9, 1, 1, '#8b5a35');
            dp(ptx + 9, pty + 10, 3, 3, '#5a2a0a'); dp(ptx + 10, pty + 10, 1, 1, '#7a4a2a');

            // Palm Tree Right
            const pt2x = Math.floor(cols * 0.56), pt2y = scy - 30;
            dp(pt2x + 5, pt2y + 10, 3, 4, '#a0704d'); dp(pt2x + 5, pt2y + 14, 3, 4, '#8b5e3c');
            dp(pt2x + 5, pt2y + 18, 3, 4, '#9b6840'); dp(pt2x + 5, pt2y + 22, 3, 4, '#8b5e3c');
            dp(pt2x + 5, pt2y + 26, 4, 4, '#9b6840'); dp(pt2x + 4, pt2y + 30, 5, 3, '#8b5e3c');
            dp(pt2x + 4, pt2y + 33, 6, 3, '#7a4e2c'); dp(pt2x + 6, pt2y + 10, 1, 24, '#a8785a');
            dp(pt2x + 1, pt2y, 10, 3, '#1e8a1e'); dp(pt2x + 0, pt2y + 3, 12, 3, '#228b22');
            dp(pt2x + 2, pt2y + 6, 8, 2, '#2a9a2a'); dp(pt2x - 3, pt2y + 2, 4, 3, '#1a7a1a');
            dp(pt2x + 12, pt2y + 2, 4, 3, '#1e8a1e'); dp(pt2x + 3, pt2y - 1, 6, 1, '#32cd32');
            dp(pt2x + 1, pt2y + 5, 2, 2, '#228b22'); dp(pt2x + 9, pt2y + 5, 2, 2, '#228b22');
            dp(pt2x + 3, pt2y + 8, 6, 2, '#1a7a1a'); dp(pt2x + 5, pt2y + 8, 3, 2, '#5a2a0a');

            // Umbrella
            const ux = Math.floor(cols * 0.70), uy = scy - 6;
            dp(ux + 9, uy - 22, 2, 30, '#8b4513'); dp(ux + 10, uy - 22, 1, 30, '#6b3010');
            dp(ux + 9, uy - 23, 2, 1, '#9b5523');
            dp(ux + 6, uy - 28, 8, 2, '#e84040'); dp(ux + 4, uy - 26, 12, 2, '#ee5555');
            dp(ux + 2, uy - 24, 16, 2, '#e84040'); dp(ux + 0, uy - 22, 20, 3, '#ee5555');
            dp(ux - 1, uy - 19, 22, 2, '#e84040');
            dp(ux + 6, uy - 26, 2, 8, '#fff'); dp(ux + 12, uy - 26, 2, 8, '#fff'); dp(ux + 9, uy - 28, 2, 2, '#fff');
            dp(ux + 0, uy - 17, 20, 1, '#c43030');
            dp(ux - 2, uy + 6, 22, 2, '#ff69b4'); dp(ux - 2, uy + 8, 22, 2, '#ffe0f0'); dp(ux - 2, uy + 10, 22, 1, '#ff69b4');

            // Sandcastle
            const scx = Math.floor(cols * 0.18);
            dp(scx, scy + 2, 18, 8, '#d4a76a'); dp(scx + 1, scy + 2, 16, 1, '#e0b87a'); dp(scx, scy + 9, 18, 1, '#c49760');
            dp(scx + 1, scy - 3, 5, 6, '#d4a76a'); dp(scx + 1, scy - 4, 5, 1, '#c49760');
            dp(scx + 1, scy - 4, 1, 1, '#dab480'); dp(scx + 3, scy - 4, 1, 1, '#dab480'); dp(scx + 5, scy - 4, 1, 1, '#dab480');
            dp(scx + 12, scy - 3, 5, 6, '#d4a76a'); dp(scx + 12, scy - 4, 5, 1, '#c49760');
            dp(scx + 12, scy - 4, 1, 1, '#dab480'); dp(scx + 14, scy - 4, 1, 1, '#dab480'); dp(scx + 16, scy - 4, 1, 1, '#dab480');
            dp(scx + 5, scy - 8, 8, 11, '#d4a76a'); dp(scx + 6, scy - 8, 6, 1, '#e0b87a'); dp(scx + 5, scy - 9, 8, 1, '#c49760');
            dp(scx + 5, scy - 9, 2, 1, '#dab480'); dp(scx + 8, scy - 9, 2, 1, '#dab480'); dp(scx + 11, scy - 9, 2, 1, '#dab480');
            dp(scx + 9, scy - 14, 1, 5, '#8b4513'); dp(scx + 10, scy - 14, 4, 3, '#ff4444'); dp(scx + 10, scy - 13, 3, 1, '#ff6666');
            dp(scx + 8, scy + 0, 3, 3, '#b08040'); dp(scx + 8, scy + 0, 3, 1, '#9b7030');
            dp(scx + 3, scy + 5, 1, 1, '#fff'); dp(scx + 14, scy + 5, 1, 1, '#fff');

            // Surfboard
            const sbx = Math.floor(cols * 0.88);
            dp(sbx + 2, scy - 14, 1, 2, '#00bcd4'); dp(sbx + 1, scy - 12, 3, 3, '#00bcd4');
            dp(sbx + 0, scy - 9, 5, 18, '#00bcd4'); dp(sbx + 1, scy + 9, 3, 3, '#00a0b4');
            dp(sbx + 2, scy + 12, 1, 2, '#008c9e'); dp(sbx + 0, scy - 2, 5, 2, '#ff4444');
            dp(sbx + 1, scy - 10, 1, 16, '#33d4e8'); dp(sbx + 2, scy - 12, 1, 24, '#009aaa');
            dp(sbx + 2, scy + 10, 2, 2, '#005566');

            // Small props
            const shells = [[0.24, 3], [0.34, 5], [0.44, 2], [0.52, 6], [0.62, 4], [0.80, 7], [0.38, 9], [0.76, 3]];
            shells.forEach(([xp, yo]) => {
                const sx = Math.floor(cols * xp), sy = scy + yo;
                dp(sx, sy, 3, 2, '#fff5e6'); dp(sx, sy + 2, 3, 1, '#e8d5b8');
                dp(sx + 1, sy, 1, 1, '#ffeedd'); dp(sx, sy + 2, 1, 1, '#d8c5a8');
            });
            // Starfish (compact 5-arm)
            const sfx = Math.floor(cols * 0.32), sfy = scy + 4;
            dp(sfx + 2, sfy - 2, 2, 2, '#ff6347');     // top arm
            dp(sfx + 5, sfy, 2, 2, '#ff5533');          // right arm
            dp(sfx + 4, sfy + 3, 2, 2, '#e8402a');      // bottom-right
            dp(sfx, sfy + 3, 2, 2, '#e8402a');           // bottom-left
            dp(sfx - 1, sfy, 2, 2, '#ff5533');           // left arm
            dp(sfx + 1, sfy, 4, 3, '#ff6347');           // center body
            dp(sfx + 2, sfy + 1, 2, 1, '#ff7f50');       // highlight
            // Volleyball (20x20 pixel art with shading)
            const vx = Math.floor(cols * 0.48) - 10, vy = scy - 16;
            const O = '#1a1a2e', B1 = '#2233aa', B2 = '#3355cc', B3 = '#5577dd', Y1 = '#d49c10', Y2 = '#f0b820', Y3 = '#ffd040', W = '#eeeae4', WH = '#fff', SH = '#ccc8c0';
            // Row 0-1 (top cap)
            dp(vx + 6, vy, 8, 1, O);
            dp(vx + 4, vy + 1, 2, 1, O); dp(vx + 6, vy + 1, 3, 1, B2); dp(vx + 9, vy + 1, 2, 1, WH); dp(vx + 11, vy + 1, 3, 1, Y3); dp(vx + 14, vy + 1, 2, 1, O);
            // Row 2
            dp(vx + 3, vy + 2, 1, 1, O); dp(vx + 4, vy + 2, 2, 1, B3); dp(vx + 6, vy + 2, 2, 1, B2); dp(vx + 8, vy + 2, 1, 1, WH); dp(vx + 9, vy + 2, 2, 1, WH); dp(vx + 11, vy + 2, 2, 1, Y3); dp(vx + 13, vy + 2, 2, 1, Y2); dp(vx + 15, vy + 2, 1, 1, Y1); dp(vx + 16, vy + 2, 1, 1, O);
            // Row 3
            dp(vx + 2, vy + 3, 1, 1, O); dp(vx + 3, vy + 3, 2, 1, B3); dp(vx + 5, vy + 3, 2, 1, B2); dp(vx + 7, vy + 3, 1, 1, B1); dp(vx + 8, vy + 3, 2, 1, WH); dp(vx + 10, vy + 3, 1, 1, W); dp(vx + 11, vy + 3, 2, 1, Y3); dp(vx + 13, vy + 3, 3, 1, Y2); dp(vx + 16, vy + 3, 1, 1, Y1); dp(vx + 17, vy + 3, 1, 1, O);
            // Row 4
            dp(vx + 1, vy + 4, 1, 1, O); dp(vx + 2, vy + 4, 2, 1, B3); dp(vx + 4, vy + 4, 2, 1, B2); dp(vx + 6, vy + 4, 1, 1, B1); dp(vx + 7, vy + 4, 2, 1, WH); dp(vx + 9, vy + 4, 1, 1, W); dp(vx + 10, vy + 4, 1, 1, Y3); dp(vx + 11, vy + 4, 4, 1, Y2); dp(vx + 15, vy + 4, 2, 1, Y1); dp(vx + 17, vy + 4, 1, 1, W); dp(vx + 18, vy + 4, 1, 1, O);
            // Row 5
            dp(vx + 1, vy + 5, 1, 1, O); dp(vx + 2, vy + 5, 1, 1, B3); dp(vx + 3, vy + 5, 2, 1, B2); dp(vx + 5, vy + 5, 1, 1, B1); dp(vx + 6, vy + 5, 2, 1, WH); dp(vx + 8, vy + 5, 1, 1, W); dp(vx + 9, vy + 5, 1, 1, Y3); dp(vx + 10, vy + 5, 4, 1, Y2); dp(vx + 14, vy + 5, 2, 1, Y1); dp(vx + 16, vy + 5, 1, 1, WH); dp(vx + 17, vy + 5, 1, 1, B1); dp(vx + 18, vy + 5, 1, 1, O);
            // Row 6
            dp(vx + 0, vy + 6, 1, 1, O); dp(vx + 1, vy + 6, 2, 1, B2); dp(vx + 3, vy + 6, 1, 1, B1); dp(vx + 4, vy + 6, 1, 1, B1); dp(vx + 5, vy + 6, 2, 1, WH); dp(vx + 7, vy + 6, 1, 1, W); dp(vx + 8, vy + 6, 1, 1, Y3); dp(vx + 9, vy + 6, 4, 1, Y2); dp(vx + 13, vy + 6, 2, 1, Y1); dp(vx + 15, vy + 6, 1, 1, WH); dp(vx + 16, vy + 6, 2, 1, B1); dp(vx + 18, vy + 6, 1, 1, B2); dp(vx + 19, vy + 6, 1, 1, O);
            // Row 7
            dp(vx + 0, vy + 7, 1, 1, O); dp(vx + 1, vy + 7, 1, 1, WH); dp(vx + 2, vy + 7, 1, 1, B2); dp(vx + 3, vy + 7, 1, 1, B1); dp(vx + 4, vy + 7, 2, 1, WH); dp(vx + 6, vy + 7, 1, 1, W); dp(vx + 7, vy + 7, 1, 1, Y3); dp(vx + 8, vy + 7, 4, 1, Y2); dp(vx + 12, vy + 7, 2, 1, Y1); dp(vx + 14, vy + 7, 1, 1, WH); dp(vx + 15, vy + 7, 1, 1, B1); dp(vx + 16, vy + 7, 2, 1, B2); dp(vx + 18, vy + 7, 1, 1, WH); dp(vx + 19, vy + 7, 1, 1, O);
            // Row 8
            dp(vx + 0, vy + 8, 1, 1, O); dp(vx + 1, vy + 8, 2, 1, WH); dp(vx + 3, vy + 8, 1, 1, W); dp(vx + 4, vy + 8, 1, 1, WH); dp(vx + 5, vy + 8, 1, 1, W); dp(vx + 6, vy + 8, 1, 1, Y3); dp(vx + 7, vy + 8, 4, 1, Y2); dp(vx + 11, vy + 8, 2, 1, Y1); dp(vx + 13, vy + 8, 1, 1, WH); dp(vx + 14, vy + 8, 1, 1, B1); dp(vx + 15, vy + 8, 3, 1, B2); dp(vx + 18, vy + 8, 1, 1, WH); dp(vx + 19, vy + 8, 1, 1, O);
            // Row 9
            dp(vx + 0, vy + 9, 1, 1, O); dp(vx + 1, vy + 9, 2, 1, W); dp(vx + 3, vy + 9, 1, 1, WH); dp(vx + 4, vy + 9, 1, 1, W); dp(vx + 5, vy + 9, 1, 1, Y3); dp(vx + 6, vy + 9, 4, 1, Y2); dp(vx + 10, vy + 9, 2, 1, Y1); dp(vx + 12, vy + 9, 1, 1, WH); dp(vx + 13, vy + 9, 1, 1, B1); dp(vx + 14, vy + 9, 3, 1, B2); dp(vx + 17, vy + 9, 1, 1, B1); dp(vx + 18, vy + 9, 1, 1, SH); dp(vx + 19, vy + 9, 1, 1, O);
            // Row 10
            dp(vx + 0, vy + 10, 1, 1, O); dp(vx + 1, vy + 10, 1, 1, W); dp(vx + 2, vy + 10, 1, 1, WH); dp(vx + 3, vy + 10, 1, 1, Y3); dp(vx + 4, vy + 10, 1, 1, Y2); dp(vx + 5, vy + 10, 4, 1, Y2); dp(vx + 9, vy + 10, 2, 1, Y1); dp(vx + 11, vy + 10, 1, 1, WH); dp(vx + 12, vy + 10, 1, 1, B1); dp(vx + 13, vy + 10, 3, 1, B2); dp(vx + 16, vy + 10, 2, 1, B1); dp(vx + 18, vy + 10, 1, 1, SH); dp(vx + 19, vy + 10, 1, 1, O);
            // Row 11
            dp(vx + 0, vy + 11, 1, 1, O); dp(vx + 1, vy + 11, 1, 1, W); dp(vx + 2, vy + 11, 1, 1, Y3); dp(vx + 3, vy + 11, 3, 1, Y2); dp(vx + 6, vy + 11, 3, 1, Y1); dp(vx + 9, vy + 11, 1, 1, Y1); dp(vx + 10, vy + 11, 1, 1, WH); dp(vx + 11, vy + 11, 1, 1, B1); dp(vx + 12, vy + 11, 3, 1, B2); dp(vx + 15, vy + 11, 2, 1, B1); dp(vx + 17, vy + 11, 1, 1, SH); dp(vx + 18, vy + 11, 1, 1, W); dp(vx + 19, vy + 11, 1, 1, O);
            // Row 12
            dp(vx + 0, vy + 12, 1, 1, O); dp(vx + 1, vy + 12, 1, 1, Y3); dp(vx + 2, vy + 12, 3, 1, Y2); dp(vx + 5, vy + 12, 3, 1, Y1); dp(vx + 8, vy + 12, 1, 1, Y1); dp(vx + 9, vy + 12, 1, 1, WH); dp(vx + 10, vy + 12, 1, 1, W); dp(vx + 11, vy + 12, 1, 1, B1); dp(vx + 12, vy + 12, 3, 1, B2); dp(vx + 15, vy + 12, 2, 1, B1); dp(vx + 17, vy + 12, 1, 1, W); dp(vx + 18, vy + 12, 1, 1, SH); dp(vx + 19, vy + 12, 1, 1, O);
            // Row 13
            dp(vx + 0, vy + 13, 1, 1, O); dp(vx + 1, vy + 13, 1, 1, Y2); dp(vx + 2, vy + 13, 3, 1, Y1); dp(vx + 5, vy + 13, 2, 1, Y1); dp(vx + 7, vy + 13, 2, 1, WH); dp(vx + 9, vy + 13, 1, 1, W); dp(vx + 10, vy + 13, 1, 1, B1); dp(vx + 11, vy + 13, 3, 1, B2); dp(vx + 14, vy + 13, 2, 1, B1); dp(vx + 16, vy + 13, 1, 1, W); dp(vx + 17, vy + 13, 1, 1, SH); dp(vx + 18, vy + 13, 1, 1, W); dp(vx + 19, vy + 13, 1, 1, O);
            // Row 14
            dp(vx + 1, vy + 14, 1, 1, O); dp(vx + 2, vy + 14, 2, 1, Y1); dp(vx + 4, vy + 14, 2, 1, Y1); dp(vx + 6, vy + 14, 2, 1, WH); dp(vx + 8, vy + 14, 1, 1, W); dp(vx + 9, vy + 14, 1, 1, B1); dp(vx + 10, vy + 14, 3, 1, B2); dp(vx + 13, vy + 14, 2, 1, B1); dp(vx + 15, vy + 14, 1, 1, W); dp(vx + 16, vy + 14, 1, 1, SH); dp(vx + 17, vy + 14, 1, 1, W); dp(vx + 18, vy + 14, 1, 1, O);
            // Row 15
            dp(vx + 1, vy + 15, 1, 1, O); dp(vx + 2, vy + 15, 2, 1, Y1); dp(vx + 4, vy + 15, 1, 1, Y1); dp(vx + 5, vy + 15, 2, 1, WH); dp(vx + 7, vy + 15, 1, 1, W); dp(vx + 8, vy + 15, 1, 1, B1); dp(vx + 9, vy + 15, 3, 1, B1); dp(vx + 12, vy + 15, 2, 1, B1); dp(vx + 14, vy + 15, 2, 1, SH); dp(vx + 16, vy + 15, 1, 1, W); dp(vx + 17, vy + 15, 1, 1, SH); dp(vx + 18, vy + 15, 1, 1, O);
            // Row 16
            dp(vx + 2, vy + 16, 1, 1, O); dp(vx + 3, vy + 16, 2, 1, Y1); dp(vx + 5, vy + 16, 2, 1, WH); dp(vx + 7, vy + 16, 1, 1, B1); dp(vx + 8, vy + 16, 3, 1, B1); dp(vx + 11, vy + 16, 2, 1, B1); dp(vx + 13, vy + 16, 2, 1, SH); dp(vx + 15, vy + 16, 1, 1, W); dp(vx + 16, vy + 16, 1, 1, SH); dp(vx + 17, vy + 16, 1, 1, O);
            // Row 17
            dp(vx + 3, vy + 17, 1, 1, O); dp(vx + 4, vy + 17, 2, 1, WH); dp(vx + 6, vy + 17, 1, 1, W); dp(vx + 7, vy + 17, 1, 1, B1); dp(vx + 8, vy + 17, 3, 1, B1); dp(vx + 11, vy + 17, 2, 1, SH); dp(vx + 13, vy + 17, 1, 1, W); dp(vx + 14, vy + 17, 1, 1, SH); dp(vx + 15, vy + 17, 1, 1, W); dp(vx + 16, vy + 17, 1, 1, O);
            // Row 18
            dp(vx + 4, vy + 18, 2, 1, O); dp(vx + 6, vy + 18, 1, 1, W); dp(vx + 7, vy + 18, 1, 1, B1); dp(vx + 8, vy + 18, 2, 1, B1); dp(vx + 10, vy + 18, 2, 1, SH); dp(vx + 12, vy + 18, 2, 1, W); dp(vx + 14, vy + 18, 2, 1, O);
            // Row 19
            dp(vx + 6, vy + 19, 8, 1, O);
            for (let i = 0; i < 3; i++) {
                const fx = Math.floor(cols * (0.28 + i * 0.07)), fy = scy + 8 + (i % 2) * 3;
                dp(fx, fy, 2, 3, '#c9985a'); dp(fx, fy, 2, 1, '#b88848');
                dp(fx + 3, fy + 1, 2, 3, '#c9985a'); dp(fx + 3, fy + 1, 2, 1, '#b88848');
            }
            const dwx = Math.floor(cols * 0.42), dwy = scy + 1;
            dp(dwx, dwy, 14, 2, '#9b7a5a'); dp(dwx, dwy, 14, 1, '#ab8a6a');
            dp(dwx + 1, dwy - 1, 3, 1, '#8b6a4a'); dp(dwx + 11, dwy - 1, 2, 1, '#8b6a4a');
            dp(dwx + 13, dwy + 1, 2, 1, '#8b6a4a');

            // Seagulls
            for (let i = 0; i < 3; i++) {
                const bx = Math.floor((frame * (0.25 + i * 0.08) + i * 90) % (cols + 20)) - 10;
                const by = Math.floor(skyH * (0.15 + i * 0.07) / px);
                dp(bx, by, 1, 1, '#555'); dp(bx - 1, by - 1, 1, 1, '#555');
                dp(bx + 1, by - 1, 1, 1, '#555'); dp(bx - 2, by, 1, 1, '#444'); dp(bx + 2, by, 1, 1, '#444');
            }

            // Clouds (animated)
            const cd = (frame * 0.3) % (width + 300) - 150;
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fillRect(cd, skyH * 0.32, 90, 6);
            ctx.fillRect(cd + 15, skyH * 0.27, 60, 6);
            ctx.fillRect(cd + 30, skyH * 0.24, 30, 5);

            // Atmospheric haze
            ctx.fillStyle = 'rgba(200,220,240,0.06)';
            ctx.fillRect(0, oceanTop - height * 0.02, width, height * 0.06);

            frame++;
            animId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animId);
    }, [width, height]);

    return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />;
};

export default BeachScene;
