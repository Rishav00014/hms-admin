"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

const AnimatedNumber = ({ value, duration = 2000, className = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const countRef = useRef(null);
  const prevValue = useRef(0);

  const animateValue = useCallback(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(
        prevValue.current + (value - prevValue.current) * progress
      );
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        prevValue.current = value;
      }
    };
    requestAnimationFrame(step);
  }, [value, duration]);

  useEffect(() => {
    animateValue();
  }, [animateValue]);

  useEffect(() => {
    if (countRef.current) {
      const height = countRef.current.offsetHeight;
      const translateY = ((displayValue % 10) * height) / 10;

      countRef.current.style.transform = `translateY(-${translateY}px)`;

      countRef.current.animate(
        [
          { transform: `translateY(-${translateY}px) scale(1.1)` },
          { transform: `translateY(-${translateY}px) scale(1)` },
        ],
        {
          duration: 200,
          easing: "ease-out",
        }
      );
    }
  }, [displayValue]);

  return (
    <div
      className={`relative overflow-hidden inline-block ${className}`}
      style={{ height: "1em" }}
    >
      <span
        ref={countRef}
        className="absolute left-0 transition-all duration-300 ease-in-out flex flex-col items-center"
        aria-hidden="true"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <span
            key={num}
            className="flex items-center justify-center"
            style={{ height: "1em" }}
          >
            {num}
          </span>
        ))}
      </span>
      <span className="sr-only">{value}</span>
    </div>
  );
};

const MultiDigitAnimatedNumber = ({
  value,
  duration = 2000,
  className = "",
  digitClassName = "",
}) => {
  const digits = String(value).padStart(6, "0").split("").map(Number);
  const visibleDigits = String(value).length;

  return (
    <div className={`flex ${className}`} aria-label={value.toString()}>
      {digits.map((digit, index) => (
        <AnimatedNumber
          key={index}
          value={digit}
          duration={duration + index * 100} // Stagger the animation
          className={`w-4 ${digitClassName} ${
            index < digits.length - visibleDigits ? "hidden" : ""
          }`}
        />
      ))}
    </div>
  );
};

export { AnimatedNumber, MultiDigitAnimatedNumber };
