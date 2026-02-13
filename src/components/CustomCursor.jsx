import React, { useEffect, useRef, useState } from 'react';
import './CustomCursor.scss'; // We'll create this scss file

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const [isPointer, setIsPointer] = useState(false);
    const [isScratching, setIsScratching] = useState(false);

    useEffect(() => {
        const moveCursor = (e) => {
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            }
        };

        const handleMouseDown = () => setIsScratching(true);
        const handleMouseUp = () => setIsScratching(false);

        const handleMouseOver = (e) => {
            const tagName = e.target.tagName.toLowerCase();
            const isClickable =
                tagName === 'button' ||
                tagName === 'a' ||
                e.target.style.cursor === 'pointer' ||
                e.target.classList.contains('scratch-zone');

            setIsPointer(isClickable);
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <div className="custom-cursor-wrapper" ref={cursorRef}>
            <div className={`cursor-coin ${isScratching ? 'scratching' : ''}`}>
                🪙
            </div>
        </div>
    );
};

export default CustomCursor;
