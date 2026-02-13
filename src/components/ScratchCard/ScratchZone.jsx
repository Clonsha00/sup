import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ScratchZone = ({
    width,
    height,
    overlayColor = '#C0C0C0',
    overlayImage = null,
    brushSize = 20,
    onReveal,
    onProgress,
    onScratch,
    revealThreshold = 0.95, // Default 95%
    forceRevealed = false,
    children
}) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isRevealed, setIsRevealed] = useState(forceRevealed);
    const [isScratching, setIsScratching] = useState(false);

    useEffect(() => {
        if (forceRevealed) setIsRevealed(true);
    }, [forceRevealed]);

    useEffect(() => {
        if (isRevealed) return; // Don't draw if already revealed

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Setup Canvas
        canvas.width = width;
        canvas.height = height;

        // Reset Composite Operation (Important!)
        ctx.globalCompositeOperation = 'source-over';

        // Fill Overlay
        if (overlayImage) {
            const img = new Image();
            img.src = overlayImage;
            img.onload = () => {
                ctx.drawImage(img, 0, 0, width, height);
            };
        } else {
            ctx.fillStyle = overlayColor;
            ctx.fillRect(0, 0, width, height);

            // Add some "Glitter/Noise" texture
            addNoise(ctx, width, height);
        }
    }, [width, height, overlayColor, overlayImage, isRevealed]);

    const addNoise = (ctx, w, h) => {
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            if (Math.random() > 0.9) {
                const val = Math.random() * 50;
                data[i] = Math.min(255, data[i] + val);
                data[i + 1] = Math.min(255, data[i + 1] + val);
                data[i + 2] = Math.min(255, data[i + 2] + val);
            }
        }
        ctx.putImageData(imageData, 0, 0);
    };

    const handleScratch = (e) => {
        if (isRevealed) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        let clientX, clientY;
        if (e.type.includes('touch')) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
            if (e.buttons !== 1) return; // Only scratch if mouse is pressed
        }

        // Account for CSS transforms (scale) on parent elements
        const scaleX = rect.width / canvas.width;
        const scaleY = rect.height / canvas.height;
        const x = (clientX - rect.left) / scaleX;
        const y = (clientY - rect.top) / scaleY;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();

        // Main brush
        ctx.arc(x, y, brushSize, 0, 2 * Math.PI);
        ctx.fill();

        // Roughness (Scatter effect)
        for (let i = 0; i < 5; i++) {
            const offsetX = (Math.random() - 0.5) * brushSize;
            const offsetY = (Math.random() - 0.5) * brushSize;
            const size = (Math.random() * 0.5 + 0.5) * brushSize * 0.6;

            ctx.beginPath();
            ctx.arc(x + offsetX, y + offsetY, size, 0, 2 * Math.PI);
            ctx.fill();
        }

        if (onScratch) {
            onScratch(x, y);
        }

        checkRevealProgress();
    };

    const checkRevealProgress = () => {
        if (isRevealed) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Check every 10th pixel for performance
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        let transparentPixels = 0;
        const totalPixels = data.length / 4;

        for (let i = 3; i < data.length; i += 40) {
            if (data[i] === 0) {
                transparentPixels++;
            }
        }

        // Checking a subset, so scale up the count
        const percentage = (transparentPixels * 10) / totalPixels;

        if (onProgress) {
            onProgress(percentage);
        }

        if (percentage > revealThreshold) {
            setIsRevealed(true);
            if (onReveal) onReveal();

            // Clear the rest
            ctx.clearRect(0, 0, width, height);
        }
    };

    return (
        <div
            ref={containerRef}
            className={`scratch-zone ${isRevealed ? 'revealed' : ''}`}
            style={{
                position: 'relative',
                width: width,
                height: height,
                userSelect: 'none',
                overflow: 'hidden',
                border: '4px solid #fceabb', // Gold-ish border
                backgroundColor: '#fff',
                borderRadius: '8px'
            }}
        >
            {/* Hidden Content (Underneath) */}
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {children}
            </div>

            {/* Canvas Overlay */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    touchAction: 'none',
                    opacity: isRevealed ? 0 : 1,
                    transition: 'opacity 0.5s ease',
                    zIndex: 20
                }}
                onMouseDown={handleScratch}
                onMouseMove={handleScratch}
                onTouchStart={handleScratch}
                onTouchMove={handleScratch}
            />
        </div>
    );
};

export default ScratchZone;

