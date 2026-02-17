import { useState, useEffect, useRef } from "react";

export default function Main(props) {
  const { data, showModal } = props;
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [touchStartDistance, setTouchStartDistance] = useState(null);
  const [touchStartZoom, setTouchStartZoom] = useState(1);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Reset zoom and position when image changes
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [data?.hdurl]);

  const getDistance = (touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    const newZoom = Math.max(0.1, Math.min(5, zoom + delta));
    setZoom(newZoom);
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      setTouchStartDistance(distance);
      setTouchStartZoom(zoom);
    } else if (e.touches.length === 1 && zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 2 && touchStartDistance !== null) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      const scale = distance / touchStartDistance;
      const newZoom = Math.max(0.1, Math.min(5, touchStartZoom * scale));
      setZoom(newZoom);
    } else if (e.touches.length === 1 && isDragging && zoom > 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchStartDistance(null);
  };

  const handleZoomOut = () => {
    setZoom(Math.max(0.1, zoom - 0.05));
  };

  const handleZoomIn = () => {
    setZoom(Math.min(5, zoom + 0.05));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseup", handleMouseUp);
      container.addEventListener("mouseleave", handleMouseUp);
      container.addEventListener("touchstart", handleTouchStart, { passive: false });
      container.addEventListener("touchmove", handleTouchMove, { passive: false });
      container.addEventListener("touchend", handleTouchEnd);

      return () => {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseup", handleMouseUp);
        container.removeEventListener("mouseleave", handleMouseUp);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [zoom, isDragging, dragStart, position, touchStartDistance, touchStartZoom]);

  return (
    <div
      ref={containerRef}
      className={`imgContainer ${showModal ? 'sidebarOpen' : ''}`}
      onMouseDown={handleMouseDown}
      style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
    >
      <div className="zoomControls">
        <button onClick={handleZoomIn} className="zoomBtn" title="Zoom In">
          <i className="fa-solid fa-plus"></i>
        </button>
        <button onClick={handleZoomOut} className="zoomBtn" title="Zoom Out">
          <i className="fa-solid fa-minus"></i>
        </button>
        <button onClick={handleResetZoom} className="zoomBtn" title="Reset Zoom">
          <i className="fa-solid fa-rotate-right"></i>
        </button>
      </div>
      <div className="imageWrapper">
        <div
          className="imageTransform"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            transformOrigin: 'center center',
          }}
        >
          <img
            ref={imgRef}
            src={data.hdurl}
            alt={data.title || "bg-img"}
            className="bgImage"
          />
        </div>
      </div>
    </div>
  );
}
