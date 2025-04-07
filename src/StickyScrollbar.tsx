import React, { useRef, useEffect, useCallback } from "react";
import styled from "styled-components";

const TargetScrollableBlock = styled.div`
  overflow: auto;
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */

  ::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
`;

const StickyScrollScrollbar = styled.div`
  position: sticky;
  bottom: 0;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  height: 19px;
`;

const InnerScrollSizer = styled.div`
  width: 2500px;
  height: 44px;
`;

const StickyScrollbar = ({ children }) => {
  const targetScrollableRef = useRef<HTMLDivElement | null>(null);
  const stickyScrollRef = useRef<HTMLDivElement | null>(null);
  const fauxWidthElement = useRef<HTMLDivElement | null>(null);

  // Define types for the scroll handlers
  type ScrollHandler = () => void;

  const handleStickyScroll: ScrollHandler = useCallback(() => {
    requestAnimationFrame(() => {
      const target = targetScrollableRef.current;
      const sticky = stickyScrollRef.current;
      if (target && sticky) {
        target.scrollLeft = sticky.scrollLeft;
      }
    });
  }, []);

  const handleTargetScroll: ScrollHandler = useCallback(() => {
    requestAnimationFrame(() => {
      const target = targetScrollableRef.current;
      const sticky = stickyScrollRef.current;
      if (target && sticky) {
        sticky.scrollLeft = target.scrollLeft;
      }
    });
  }, []);

  useEffect(() => {
    const target = targetScrollableRef.current;
    const sticky = stickyScrollRef.current;
    const faux = fauxWidthElement.current;

    if (!target || !sticky || !faux) return;

    // Define type for the resize observer callback
    type ResizeObserverCallback = () => void;

    const updateFauxWidth: ResizeObserverCallback = () => {
      faux.style.width = `${target.scrollWidth}px`;
    };

    updateFauxWidth();

    const resizeObserver = new ResizeObserver(updateFauxWidth);
    resizeObserver.observe(target);

    // Define type for the checkScrollbar function
    type CheckScrollbarFunction = () => void;

    const checkScrollbar: CheckScrollbarFunction = () => {
      const hasScroll = target.scrollWidth > target.clientWidth;
      target.setAttribute("has-scrollbar", hasScroll ? "true" : "false");
    };

    checkScrollbar();
    window.addEventListener("resize", checkScrollbar);

    // Event listeners
    sticky.addEventListener("scroll", handleStickyScroll);
    target.addEventListener("scroll", handleTargetScroll);

    return () => {
      resizeObserver.unobserve(target);
      window.removeEventListener("resize", checkScrollbar);
      sticky.removeEventListener("scroll", handleStickyScroll);
      target.removeEventListener("scroll", handleTargetScroll);
    };
  }, [handleStickyScroll, handleTargetScroll]);

  return (
    <div>
      <TargetScrollableBlock ref={targetScrollableRef}>
        {children}
      </TargetScrollableBlock>
      <StickyScrollScrollbar ref={stickyScrollRef}>
        <InnerScrollSizer ref={fauxWidthElement}>&nbsp;</InnerScrollSizer>
      </StickyScrollScrollbar>
    </div>
  );
};

export default StickyScrollbar;
