import React, { useRef, useEffect, RefObject } from 'react';
import anime from 'animejs';

/** 
 * Interface for configuring the text animation.
 */
export interface TextAnimationOptions {
  /** Overall influence strength for the gravity well effect. Default: 200 */
  gravityConstant?: number;
  /** Offset to avoid division by zero; moderates the effect when very close. Default: 10 */
  offset?: number;
  /** Maximum displacement (in pixels) that a word can move. Default: 20 */
  maxDisplacement?: number;
  /** Smoothing factor for the exponential moving average of mouse coordinates. Default: 0.2 */
  alpha?: number;
  /** Minimum movement speed (in pixels) required to trigger the animation. Default: 2 */
  movementThreshold?: number;
  /** Delay in milliseconds after which the words reset to original positions. Default: 100 */
  resetDelay?: number;
  /** Duration (in milliseconds) for the movement animation. Default: 300 */
  duration?: number;
  /** Duration (in milliseconds) for resetting words back to their original positions. Default: 600 */
  resetDuration?: number;
  /** Custom easing function for the animations. Default: t => 1 - Math.pow(1 - t, 6) */
  ease?: string;
}

/**
 * Custom hook that applies a mouse-driven text animation to a container element.
 * Returns a ref to be attached to the container.
 *
 * @param options - Optional configuration for the text animation.
 * @returns A ref that should be applied to the text container element.
 */
export function useAnimatedText(options?: TextAnimationOptions): RefObject<HTMLDivElement> {
  // Create a ref for the container.
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Merge options with defaults.
    const defaultOptions: Required<TextAnimationOptions> = {
      gravityConstant: 500,
      offset: 10,
      maxDisplacement: 200,
      alpha: 0.998,
      movementThreshold: 2,
      resetDelay: 100,
      duration: 100,
      resetDuration: 1600,
      ease: 'out(6)',
    };
    const opts: Required<TextAnimationOptions> = { ...defaultOptions, ...options };

    const container = containerRef.current;
    if (!container) return;

    // Get the original text and clear the container.
    const text: string = container.innerText;
    container.innerHTML = '';

    // Build the DOM: split the text into words and wrap each in a span.
    const words: string[] = text.split(' ');
    const wordElements: HTMLSpanElement[] = [];
    words.forEach((word: string, index: number) => {
      const wordSpan: HTMLSpanElement = document.createElement('span');
      wordSpan.className = 'word';
      wordSpan.innerText = word;
      container.appendChild(wordSpan);
      wordElements.push(wordSpan);

      // Append a non-breaking space between words (except the last word).
      if (index < words.length - 1) {
        const space: HTMLSpanElement = document.createElement('span');
        space.innerHTML = '&nbsp;';
        container.appendChild(space);
      }
    });

    /**
     * Interface for storing a word element's center position.
     */
    interface WordPosition {
      element: HTMLSpanElement;
      centerX: number;
      centerY: number;
    }

    const wordPositions: WordPosition[] = [];

    // Cache each word's center position relative to the container.
    const cacheWordPositions = (): void => {
      const containerRect: DOMRect = container.getBoundingClientRect();
      wordElements.forEach((word: HTMLSpanElement) => {
        const rect: DOMRect = word.getBoundingClientRect();
        const centerX: number = rect.left - containerRect.left + rect.width / 2;
        const centerY: number = rect.top - containerRect.top + rect.height / 2;
        wordPositions.push({ element: word, centerX, centerY });
      });
    };
    cacheWordPositions();

    // Variables for smoothing and tracking mouse input.
    let lastMouseX: number | null = null;
    let lastMouseY: number | null = null;
    let smoothedX: number | null = null;
    let smoothedY: number | null = null;
    let isAnimating: boolean = false;
    let lastEvent: MouseEvent | null = null;
    let idleTimeout: number | undefined;

    // Event listener: on mouse move.
    const handleMouseMove = (event: MouseEvent): void => {
      clearTimeout(idleTimeout);
      lastEvent = event;

      const containerRect: DOMRect = container.getBoundingClientRect();
      const mouseX: number = lastEvent.clientX - containerRect.left;
      const mouseY: number = lastEvent.clientY - containerRect.top;

      // Initialize or update smoothed coordinates using an exponential moving average.
      if (smoothedX === null || smoothedY === null) {
        smoothedX = mouseX;
        smoothedY = mouseY;
      } else {
        smoothedX = smoothedX * (1 - opts.alpha) + mouseX * opts.alpha;
        smoothedY = smoothedY * (1 - opts.alpha) + mouseY * opts.alpha;
      }

      // Calculate movement speed.
      let movementSpeed: number = 0;
      if (lastMouseX !== null && lastMouseY !== null) {
        const deltaX: number = smoothedX - lastMouseX;
        const deltaY: number = smoothedY - lastMouseY;
        movementSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      }
      lastMouseX = smoothedX;
      lastMouseY = smoothedY;

      // If movement is below the threshold, do nothing.
      if (movementSpeed < opts.movementThreshold) return;

      // Throttle updates with requestAnimationFrame.
      if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(() => {
          wordPositions.forEach((pos) => {
            // Calculate vector from word center to the smoothed mouse position.
            const dx: number = smoothedX! - pos.centerX;
            const dy: number = smoothedY! - pos.centerY;
            const distance: number = Math.sqrt(dx * dx + dy * dy);

            // Gravity well: displacement inversely proportional to distance.
            const rawDisplacement: number =
              (opts.gravityConstant / (distance + opts.offset)) * (movementSpeed / 10);
            const displacement: number = Math.min(opts.maxDisplacement, rawDisplacement);
            const angle: number = Math.atan2(dy, dx);
            const translateX: number = -Math.cos(angle) * displacement;
            const translateY: number = -Math.sin(angle) * displacement;

            anime({
              targets: pos.element,
              translateX,
              translateY,
              duration: opts.duration,
              ease: opts.ease,
            });
          });
          isAnimating = false;
        });
      }

      // When the mouse stops moving, reset words to their original positions.
      idleTimeout = window.setTimeout(() => {
        anime({
          targets: wordElements,
          translateX: 0,
          translateY: 0,
          duration: opts.resetDuration,
          ease: opts.ease,
        });
      }, opts.resetDelay);
    };

    // Event listener: on mouse leave.
    const handleMouseLeave = (): void => {
      anime({
        targets: wordElements,
        translateX: 0,
        translateY: 0,
        duration: opts.resetDuration,
        ease: opts.ease,
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup on unmount.
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (idleTimeout) clearTimeout(idleTimeout);
    };
  }, [options]);

  return containerRef as RefObject<HTMLDivElement>;
}
