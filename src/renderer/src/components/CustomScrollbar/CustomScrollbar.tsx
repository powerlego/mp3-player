import React, { ReactNode } from "react";
import "./CustomScrollbar.css";

interface CustomScrollbarForwardRefProps {
  scrollHostClassName?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

interface CustomScrollbarProps extends CustomScrollbarForwardRefProps {
  scrollRef: React.RefObject<HTMLDivElement>;
}

const SCROLL_BOX_MIN_HEIGHT = 20;

function CustomScrollbar({ children, className, scrollHostClassName, style, scrollRef }: CustomScrollbarProps) {
  const [hovering, setHovering] = React.useState(false);
  const [scrollBoxHeight, setScrollBoxHeight] = React.useState(SCROLL_BOX_MIN_HEIGHT);
  const [scrollBoxTop, setScrollBoxTop] = React.useState(0);
  const [lastScrollThumbPosition, setScrollThumbPosition] = React.useState(0);
  const [isDragging, setDragging] = React.useState(false);

  const handleMouseOver = React.useCallback(() => {
    !hovering && setHovering(true);
  }, [hovering]);

  const handleMouseOut = React.useCallback(() => {
    !!hovering && setHovering(false);
  }, [hovering]);

  const handleDocumentMouseUp = React.useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        setDragging(false);
      }
    },
    [isDragging]
  );

  const handleDocumentMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        if (!scrollHostRef.current) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        const scrollHostElement = scrollHostRef.current;
        const { scrollHeight, offsetHeight } = scrollHostElement;

        const deltaY = e.clientY - lastScrollThumbPosition;
        const percentage = deltaY * (scrollHeight / offsetHeight);

        setScrollThumbPosition(e.clientY);
        setScrollBoxTop(Math.min(Math.max(0, scrollBoxTop + deltaY), offsetHeight - scrollBoxHeight));
        scrollHostElement.scrollTop = Math.min(scrollHostElement.scrollTop + percentage, scrollHeight - offsetHeight);
      }
    },
    [isDragging, lastScrollThumbPosition, scrollBoxHeight, scrollBoxTop]
  );

  const handleScrollThumbMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setScrollThumbPosition(e.clientY);
    setDragging(true);
  }, []);

  const handleScroll = React.useCallback(() => {
    if (!scrollHostRef) {
      return;
    }
    if (!scrollHostRef.current) {
      return;
    }
    const scrollHostElement = scrollHostRef.current;
    const { scrollTop, scrollHeight, offsetHeight } = scrollHostElement;
    let newTop = (scrollTop / scrollHeight) * offsetHeight;
    // newTop = newTop + parseInt(scrollTop, 10);
    newTop = Math.min(newTop, offsetHeight - scrollBoxHeight);
    setScrollBoxTop(newTop);
  }, [scrollBoxHeight]);

  const scrollHostRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!scrollHostRef.current) {
      return;
    }
    const scrollHostElement = scrollHostRef.current;
    const { clientHeight, scrollHeight } = scrollHostElement;
    const scrollThumbPercentage = clientHeight / scrollHeight;
    const scrollThumbHeight = Math.max(scrollThumbPercentage * clientHeight, SCROLL_BOX_MIN_HEIGHT);
    setScrollBoxHeight(scrollThumbHeight);
    scrollHostElement.addEventListener("scroll", handleScroll, true);
    return function cleanup() {
      scrollHostElement.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  React.useEffect(() => {
    if (!scrollHostRef.current) {
      return;
    }
    const scrollHostElement = scrollHostRef.current;
    const { clientHeight, scrollHeight } = scrollHostElement;
    const scrollThumbPercentage = clientHeight / scrollHeight;
    const scrollThumbHeight = Math.max(scrollThumbPercentage * clientHeight, SCROLL_BOX_MIN_HEIGHT);
    setScrollBoxHeight(scrollThumbHeight);
  }, [children]);

  React.useEffect(() => {
    //this is handle the dragging on scroll-thumb
    document.addEventListener("mousemove", handleDocumentMouseMove);
    document.addEventListener("mouseup", handleDocumentMouseUp);
    document.addEventListener("mouseleave", handleDocumentMouseUp);
    return function cleanup() {
      document.removeEventListener("mousemove", handleDocumentMouseMove);
      document.removeEventListener("mouseup", handleDocumentMouseUp);
      document.removeEventListener("mouseleave", handleDocumentMouseUp);
    };
  }, [handleDocumentMouseMove, handleDocumentMouseUp]);

  function mergeRefs<T>(refs: Array<React.Ref<T>>) {
    return (value: T) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(value);
        }
        else if (ref !== null) {
          (ref as React.MutableRefObject<T | null>).current = value;
        }
      });
    };
  }
  return (
    <div
      className={`relative h-full ${className ?? ""}`}
      style={style}
      onMouseLeave={handleMouseOut}
      onMouseOver={handleMouseOver}
    >
      <div
        className={`scrollhost h-full relative ${scrollHostClassName ?? ""}`}
        ref={scrollRef ? mergeRefs([scrollHostRef, scrollRef]) : scrollHostRef}
      >
        {children}
      </div>
      <div
        className={`${
          hovering ? "opacity-100" : "opacity-0"
        } h-full w-2 right-0 top-0 bottom-0 absolute rounded-lg bg-black bg-opacity-40 dark:bg-white dark:bg-opacity-20 transition-opacity duration-300 ease-out`}
      >
        <div
          className="w-1.5 h-5 absolute bg-gray-900 dark:bg-gray-100 rounded-lg ml-[1px]"
          style={{
            height: scrollBoxHeight,
            top: scrollBoxTop,
          }}
          onMouseDown={handleScrollThumbMouseDown}
        />
      </div>
    </div>
  );
}

function CustomScrollbarForwardRef(props: CustomScrollbarForwardRefProps, ref: React.Ref<HTMLDivElement>) {
  return <CustomScrollbar {...props} scrollRef={ref as React.RefObject<HTMLDivElement>} />;
}

export default React.forwardRef(CustomScrollbarForwardRef);
export { CustomScrollbar, CustomScrollbarForwardRef };
