import React, { useRef, useEffect } from 'react';

const FireworksScene = ({ width, height }) => {
    const canvasRef = useRef(null);
    const bgCacheRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        let frame = 0;
        let animId;

        // Pixel Size: Finer for more detail
        const px = Math.max(1, Math.floor(height / 360));
        const cols = Math.ceil(width / px);
        const rows = Math.ceil(height / px);

        const lerpColor = (r1, g1, b1, r2, g2, b2, t) =>
            [Math.floor(r1 + (r2 - r1) * t), Math.floor(g1 + (g2 - g1) * t), Math.floor(b1 + (b2 - b1) * t)];

        const hexToRgb = (hex) => {
            const r = parseInt(hex.substring(1, 3), 16);
            const g = parseInt(hex.substring(3, 5), 16);
            const b = parseInt(hex.substring(5, 7), 16);
            return [r, g, b];
        }

        // ── Render static background ONCE ──
        const renderBg = () => {
            const w = width, h = height;
            const offscreen = document.createElement('canvas');
            offscreen.width = w;
            offscreen.height = h;
            const offCtx = offscreen.getContext('2d');

            // 1. Realistic Night Sky
            const gradient = offCtx.createLinearGradient(0, 0, 0, h);
            gradient.addColorStop(0.0, '#020205'); // Pure Black/Void
            gradient.addColorStop(0.6, '#050510'); // Deepest Blue
            gradient.addColorStop(1.0, '#151525'); // City Light Pollution (Horizon)

            offCtx.fillStyle = gradient;
            offCtx.fillRect(0, 0, w, h);

            // 2. Realistic Moon
            const moonX = w * 0.8;
            const moonY = h * 0.15;
            const moonR = h * 0.08;

            // Moon Glow
            const glowR = moonR * 4;
            const moonGlow = offCtx.createRadialGradient(moonX, moonY, moonR, moonX, moonY, glowR);
            moonGlow.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            moonGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
            offCtx.fillStyle = moonGlow;
            offCtx.beginPath();
            offCtx.arc(moonX, moonY, glowR, 0, Math.PI * 2);
            offCtx.fill();

            // Moon Body
            offCtx.fillStyle = '#fdfdfd';
            offCtx.beginPath();
            offCtx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
            offCtx.fill();

            // Moon Craters (Subtle)
            offCtx.fillStyle = '#e0e0e0';
            offCtx.beginPath();
            offCtx.arc(moonX - moonR * 0.3, moonY + moonR * 0.1, moonR * 0.2, 0, Math.PI * 2);
            offCtx.arc(moonX + moonR * 0.4, moonY - moonR * 0.3, moonR * 0.15, 0, Math.PI * 2);
            offCtx.fill();

            // 3. Stars (More visible in dark night)
            for (let i = 0; i < 150; i++) {
                const x = Math.random() * w;
                const y = Math.random() * h * 0.7; // Avoid horizon
                const size = Math.random() > 0.95 ? 2 : 1;
                const opacity = Math.random() * 0.8 + 0.2;
                offCtx.fillStyle = `rgba(255,255,255,${opacity})`;
                offCtx.fillRect(x, y, size, size);
            }

            // 4. Distant City Silhouette
            const skylineH = h * 0.65;
            offCtx.fillStyle = '#0a0a14'; // Almost black
            offCtx.beginPath();
            offCtx.moveTo(0, h);
            let cx = 0;
            while (cx < w) {
                const bw = 20 + Math.random() * 40;
                const bh = 10 + Math.random() * (h * 0.15);
                offCtx.lineTo(cx, skylineH - bh);
                offCtx.lineTo(cx + bw, skylineH - bh);
                cx += bw;
            }
            offCtx.lineTo(w, h);
            offCtx.lineTo(0, h);
            offCtx.fill();

            bgCacheRef.current = offscreen;
        };

        renderBg();

        // ── Building Generation ──
        const buildings = [];
        const generateBuildings = () => {
            let cx = 0;
            // Generate multiple layers for depth
            const layers = 3;
            for (let l = 0; l < layers; l++) {
                cx = -50;
                while (cx < width + 50) {
                    const bw = (30 + Math.random() * 50) * (width / 1000);
                    // Layer 0 (Back): Taller, darker, more atmospheric
                    // Layer 2 (Front): Shorter/Detailed, darker
                    const baseH = height * (0.3 + l * 0.15);
                    const bh = baseH + Math.random() * (height * 0.2);

                    buildings.push({
                        x: cx,
                        w: bw,
                        h: bh,
                        layer: l, // 0=Back, 2=Front
                        type: Math.random() > 0.5 ? 'glass' : 'concrete',
                        windows: Math.random() > (0.4 - l * 0.1), // Front buildings have more windows
                        lightColor: Math.random() > 0.6 ? [220, 240, 255] : [255, 220, 180],
                        antenna: Math.random() > 0.7
                    });

                    // Gap between buildings
                    cx += bw + (Math.random() * 15 + 5);
                }
            }

            // Sort by layer (0 first/back, 2 last/front)
            buildings.sort((a, b) => a.layer - b.layer);
        };
        generateBuildings();

        // ── Clouds ──
        const clouds = [];
        for (let i = 0; i < 5; i++) {
            clouds.push({
                x: Math.random() * width,
                y: height * (0.1 + Math.random() * 0.3),
                w: 120 + Math.random() * 180,
                h: 8 + Math.random() * 15,
                speed: 0.1 + Math.random() * 0.2
            });
        }

        // ── Fireworks ──
        const fireworks = [];
        const spawnFirework = () => {
            const colors = [
                [255, 0, 128], // Hot Pink
                [0, 255, 255], // Cyan
                [255, 255, 0], // Yellow
                [180, 0, 255]  // Purple
            ];
            const x = Math.random() * width;
            const y = height * 0.2 + Math.random() * height * 0.3;
            const color = colors[Math.floor(Math.random() * colors.length)];

            for (let i = 0; i < 30; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1 + Math.random() * 3;
                fireworks.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 60 + Math.random() * 40,
                    maxLife: 100,
                    color,
                    size: Math.random() > 0.5 ? 2 : 1
                });
            }
        };

        const drawRect = (x, y, w, h, c) => {
            ctx.fillStyle = c;
            ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
        };

        const draw = () => {
            // 1. Draw Static Bg (Sky + Sun + Distant City)
            ctx.drawImage(bgCacheRef.current, 0, 0);

            // 2. Draw Clouds (Behind buildings)
            clouds.forEach(c => {
                c.x += c.speed;
                if (c.x > width) c.x = -c.w;

                // Pixel Cloud Style (Night)
                ctx.fillStyle = 'rgba(30, 30, 60, 0.5)'; // Dark Blue-Grey Shadow
                ctx.fillRect(c.x, c.y, c.w, c.h);
                ctx.fillStyle = 'rgba(200, 220, 255, 0.1)'; // Cool White Moonlight Highlight
                ctx.fillRect(c.x + 10, c.y, c.w - 20, 2); // Top edge highlight
            });

            // 3. Draw Buildings (Layered)
            const groundY = height;
            buildings.forEach(b => {
                const bTop = groundY - b.h;

                // Color based on layer (Atmospheric Perspective)
                // Back (0) = Lighter/Bluer (faded)
                // Front (2) = Darker/Blacker
                let baseColor;
                if (b.layer === 0) baseColor = '#1a1a2e'; // Lightest (Back)
                else if (b.layer === 1) baseColor = '#101020'; // Mid
                else baseColor = '#050510'; // Darkest (Front)

                // Main Building Body
                ctx.fillStyle = baseColor;
                ctx.fillRect(b.x, bTop, b.w, b.h);

                // Rim Light (Cool Blue/Moonlight) - Left border for separation
                // Brighter for front layers
                ctx.fillStyle = `rgba(100, 200, 255, ${0.1 + b.layer * 0.1})`;
                ctx.fillRect(b.x, bTop, 2, b.h);
                // Right border shadow
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fillRect(b.x + b.w - 2, bTop, 2, b.h);

                // Windows (Grid)
                if (b.windows) {
                    const winW = Math.max(2, px);
                    const winH = Math.max(3, px * 1.5);
                    const gapX = winW * 2;
                    const gapY = winH * 2;
                    const startX = b.x + 5;
                    const startY = bTop + 5;

                    for (let wy = startY; wy < groundY - 10; wy += gapY) {
                        for (let wx = startX; wx < b.x + b.w - 5; wx += gapX) {
                            // Random light on/off
                            const isLit = (Math.sin(wx * 12.9898 + wy * 78.233) * 43758.5453) % 1 > (0.6 + b.layer * 0.05); // Back layers have fewer detail

                            if (isLit) {
                                // Dimmer lights for back layers
                                const opacity = 0.5 + b.layer * 0.25;
                                const isCool = (wx + wy) % 5 === 0;
                                ctx.fillStyle = isCool
                                    ? `rgba(162, 210, 255, ${opacity})`
                                    : `rgba(255, 235, 167, ${opacity})`;
                                ctx.fillRect(wx, wy, winW, winH);
                            }
                        }
                    }
                }

                // Roof Details (Antenna) - Only front layers
                if (b.antenna && b.layer >= 1) {
                    ctx.fillStyle = baseColor;
                    ctx.fillRect(b.x + b.w * 0.5, bTop - 15, 2, 15);
                    // Red Blink Light
                    if (frame % 60 < 30) {
                        ctx.fillStyle = '#ff0000';
                        ctx.fillRect(b.x + b.w * 0.5 - 1, bTop - 17, 4, 4);
                    }
                }
            });

            // 4. Fireworks
            if (frame % 40 === 0 && Math.random() > 0.5) spawnFirework();
            fireworks.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.05; // Gravity
                p.life--;

                const alpha = p.life / p.maxLife;
                const [r, g, b] = p.color;
                ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
                ctx.fillRect(p.x, p.y, p.size * px, p.size * px);

                if (p.life <= 0) fireworks.splice(i, 1);
            });

            // 5. Foreground: Rooftop Parapet
            // Viewer is standing on a roof
            const paraH = height * 0.15;
            const paraY = height - paraH;

            // Wall Body (Concrete)
            const cementGrad = ctx.createLinearGradient(0, paraY, 0, height);
            cementGrad.addColorStop(0, '#2b2b3b');
            cementGrad.addColorStop(1, '#1a1a24');
            ctx.fillStyle = cementGrad;
            ctx.fillRect(0, paraY, width, paraH);

            // Wall Top Edge (Lighter)
            ctx.fillStyle = '#3e3e4f';
            ctx.fillRect(0, paraY, width, 10);

            // Railing
            ctx.fillStyle = '#111';
            const railH = 40;
            const railY = paraY - railH;
            // Top Rail
            ctx.fillRect(0, railY, width, 4);
            // Posts
            for (let rx = 20; rx < width; rx += 100) {
                ctx.fillRect(rx, railY, 4, railH);
            }

            // Atmosphere / Vignette
            const fogGrad = ctx.createRadialGradient(width / 2, height / 2, height * 0.3, width / 2, height / 2, height);
            fogGrad.addColorStop(0, 'rgba(0,0,0,0)');
            fogGrad.addColorStop(1, 'rgba(20, 10, 30, 0.4)');
            ctx.fillStyle = fogGrad;
            ctx.fillRect(0, 0, width, height);

            frame++;
            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(animId);
    }, [width, height]);

    return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />;
};

export default FireworksScene;
