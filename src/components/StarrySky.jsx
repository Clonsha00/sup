import React, { useRef, useEffect } from 'react';

const StarrySky = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Resize
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        // Stars
        const stars = [];
        const numStars = 200;
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                blinkSpeed: Math.random() * 0.05 + 0.01,
                opacity: Math.random(),
                direction: Math.random() > 0.5 ? 1 : -1
            });
        }

        // Draw
        const draw = () => {
            // Dark night sky (Gradient)
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#020024'); // Deep blue/black top
            gradient.addColorStop(1, '#090979'); // Deep blue bottom
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Stars
            stars.forEach(star => {
                // Update opacity for twinkling
                star.opacity += star.blinkSpeed * star.direction;
                if (star.opacity >= 1 || star.opacity <= 0.2) {
                    star.direction *= -1;
                }

                // Draw Pixel Star (Rect instead of Circle)
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.fillRect(star.x, star.y, star.size, star.size);
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0 // Background layer
            }}
        />
    );
};

export default StarrySky;
