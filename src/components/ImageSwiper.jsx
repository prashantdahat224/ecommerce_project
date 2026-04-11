import React, { useState, useRef } from "react";

export default function ImageSwiper({ images = [], onImageClick }) {

  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const minSwipeDistance = 50;

  const next = () => {
    setCurrent(prev => prev < images.length - 1 ? prev + 1 : prev);
  };

  const prev = () => {
    setCurrent(prev => prev > 0 ? prev - 1 : prev);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;

    if (diff > minSwipeDistance) next();
    if (diff < -minSwipeDistance) prev();
  };

  return (
    <div style={styles.container}>

      {/* Left Button */}
      <button onClick={prev} style={{ ...styles.button, left: 5 }}>
        {"<"}
      </button>

      {/* Image viewport */}
      <div
        style={styles.imageViewport}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >

        {/* Sliding container */}
        <div
          style={{
            ...styles.imageTrack,
            transform: `translateX(-${current * 100}%)`,
          }}
        >



          {/* {images.map((img, index) => (
            <img
              key={index}
              src={img}
              style={styles.image}
              onClick={() => onImageClick?.(img)}
            />
          ))} */}
          {images.map((img, index) => (
  <div key={index} style={{ width: "100%", height: "300px", flexShrink: 0 }}>
    {Math.abs(index - current) <= 1 ? (
      <img
        src={img}
        style={styles.image}
        onClick={() => onImageClick?.(img)}
      />
    ) : (
      <div style={{ width: "100%", height: "300px", background: "#f0f0f0" }} />
    )}
  </div>
))}

  




        </div>

      </div>

      {/* Right Button */}
      <button onClick={next} style={{ ...styles.button, right: 5 }}>
        {">"}
      </button>

      {/* Indicators */}
      <div style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            style={{
              ...styles.dot,
              width: current === index ? "16px" : "6px",
              backgroundColor: current === index ? "black" : "#ccc",
            }}
          />
        ))}
      </div>

    </div>
  );
}

const styles = {

  container: {
    position: "relative",
    width: "100%",
    maxWidth: "400px",
    margin: "auto",
  },

  imageViewport: {
    overflow: "hidden",
    width: "100%",
    height: "300px",
  },

  imageTrack: {
    display: "flex",
    transition: "transform 0.25s ease", // smooth animation
  },

  image: {
    width: "100%",
    height: "300px",
   objectFit: "cover",
   objectPosition: "center",
    flexShrink: 0,
    userSelect: "none",
  },

  button: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.5)",
    color: "white",
    border: "none",
    padding: "8px 10px",
    cursor: "pointer",
    borderRadius: "5px",
    zIndex: 1,
  },

  indicatorContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "6px",
    marginTop: "8px",
  },

  dot: {
    height: "6px",
    borderRadius: "3px",
    transition: "all 0.25s ease",
    cursor: "pointer",
  },

};