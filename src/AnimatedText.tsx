import anime from "animejs";
import React, { useRef, useMemo, useEffect } from "react";
import { styled } from "styled-components";

const AnimatedInlineBlock = styled.span`
  display: inline-block;
  will-change: transform;
`;

const AnimatedText = ({ children }) => {
  const containerRef = useRef(null);
  const words = useMemo(() => children.trim().split(" "), [children]);

  const wordPositionsRef = useRef([]);
  const lastMouseXRef = useRef(null);
  const lastMouseYRef = useRef(null);
  const smoothedXRef = useRef(null);
  const smoothedYRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const idleTimeoutRef = useRef(null);

  const customEasing = "out(6)";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wordElements = Array.from(container.querySelectorAll(".word"));
    const wordPositions = [];
    wordElements.forEach((word) => {
      const rect = (word as HTMLBaseElement).getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const centerX = rect.left - containerRect.left + rect.width / 2;
      const centerY = rect.top - containerRect.top + rect.height / 2;
      wordPositions.push({ element: word, centerX, centerY });
    });
    wordPositionsRef.current = wordPositions;
  }, [words]);

  const handleMouseMove = (event) => {
    const container = containerRef.current;
    // if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const mouseX = event.clientX - containerRect.left;
    const mouseY = event.clientY - containerRect.top;

    const alpha = 0.998;
    if (smoothedXRef.current === null || smoothedYRef.current === null) {
      smoothedXRef.current = mouseX;
      smoothedYRef.current = mouseY;
    } else {
      smoothedXRef.current =
        smoothedXRef.current * (1 - alpha) + mouseX * alpha;
      smoothedYRef.current =
        smoothedYRef.current * (1 - alpha) + mouseY * alpha;
    }

    let movementSpeed = 0;
    const lastMouseX = lastMouseXRef.current;
    const lastMouseY = lastMouseYRef.current;
    if (lastMouseX !== null && lastMouseY !== null) {
      const deltaX = smoothedXRef.current - lastMouseX;
      const deltaY = smoothedYRef.current - lastMouseY;
      movementSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
    lastMouseXRef.current = smoothedXRef.current;
    lastMouseYRef.current = smoothedYRef.current;

    if (movementSpeed < 2) return;

    const gravityConstant = 500;
    const offset = 10;
    const maxDisplacement = 200;

    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      requestAnimationFrame(() => {
        const wordPositions = wordPositionsRef.current;
        wordPositions.forEach((pos) => {
          const dx = smoothedXRef.current - pos.centerX;
          const dy = smoothedYRef.current - pos.centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const rawDisplacement =
            (gravityConstant / (distance + offset)) * (movementSpeed / 10);
          const displacement = Math.min(maxDisplacement, rawDisplacement);
          const angle = Math.atan2(dy, dx);
          const translateX = -Math.cos(angle) * displacement;
          const translateY = -Math.sin(angle) * displacement;

          anime({
            targets: pos.element,
            translateX: translateX,
            translateY: translateY,
            duration: 100,
            ease: customEasing,
          });
        });
        isAnimatingRef.current = false;
      });
    }

    clearTimeout(idleTimeoutRef.current);
    idleTimeoutRef.current = setTimeout(() => {
      anime({
        targets: container.querySelectorAll(".word"),
        translateX: 0,
        translateY: 0,
        duration: 1600,
        ease: customEasing,
      });
    }, 100);
  };

  const handleMouseLeave = () => {
    const container = containerRef.current;
    if (container) {
      anime({
        targets: container.querySelectorAll(".word"),
        translateX: 0,
        translateY: 0,
        duration: 1600,
        ease: customEasing,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <AnimatedInlineBlock className="word">{word}</AnimatedInlineBlock>
          {index < words.length - 1 && (
            <AnimatedInlineBlock className="space">&nbsp;</AnimatedInlineBlock>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default AnimatedText;
