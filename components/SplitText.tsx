import React, { useEffect, useRef, useState } from 'react';
import { useSprings, animated, SpringValue, config } from '@react-spring/web';

type EasingType = 'default' | 'gentle' | 'wobbly' | 'stiff' | 'slow' | 'molasses' | 'easeOutQuint';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  animationFrom?: { [key: string]: number | string };
  animationTo?: { [key: string]: number | string };
  easing?: EasingType;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
  onLetterAnimationComplete?: () => void;
  render?: (text: string, index: number) => React.ReactNode;
}

const SplitText: React.FC<SplitTextProps> = ({
  text = '',
  className = '',
  delay = 100,
  animationFrom = { opacity: 0, transform: 'translate3d(0,40px,0)' },
  animationTo = { opacity: 1, transform: 'translate3d(0,0,0)' },
  easing = 'default',
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  onLetterAnimationComplete,
  render,
}) => {
  // Split text by newlines first, then by words
  const lines = text.split('\n').map(line => line.split(' ').map(word => word.split('')));
  const letters = lines.flat(2); // Flatten the array to get all letters
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const animatedCount = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const springs = useSprings(
    letters.length,
    letters.map((_, i) => ({
      from: animationFrom,
      to: async (next: (arg0: { [key: string]: number | string }) => void) => {
        if (inView) {
          await next(animationTo);
          animatedCount.current += 1;
          if (animatedCount.current === letters.length && onLetterAnimationComplete) {
            onLetterAnimationComplete();
          }
        }
      },
      delay: i * delay,
      config: easing === 'easeOutQuint'
        ? { tension: 170, friction: 26, easing: (t: number) => 1 - Math.pow(1 - t, 5) }
        : config[easing as keyof typeof config],
    }))
  );

  let letterIndex = 0;
  
  return (
    <p
      ref={ref}
      className={`split-parent ${className}`}
      style={{ 
        textAlign, 
        overflow: 'visible', 
        display: 'block',     
        whiteSpace: 'pre-line',
        wordWrap: 'break-word',
        lineHeight: '1.2',    
      }}
    >
      {lines.map((line, lineIndex) => (
        <React.Fragment key={lineIndex}>
          {line.map((word, wordIndex) => (
            <span key={`${lineIndex}-${wordIndex}`} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
              {word.map((letter) => {
                const currentIndex = letterIndex++;
                return (
                  <animated.span
                    key={currentIndex}
                    style={{
                      ...(springs[currentIndex] as { [key: string]: SpringValue<string | number> }),
                      display: 'inline-block',
                      willChange: 'transform, opacity',
                    }}
                  >
                    {render ? render(letter, lineIndex) : letter}
                  </animated.span>
                );
              })}
              <span style={{ display: 'inline-block', width: '0.3em' }}>&nbsp;</span>
            </span>
          ))}
          {lineIndex < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </p>
  );
};

export default SplitText;