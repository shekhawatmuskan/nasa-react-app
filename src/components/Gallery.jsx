export default function Gallery(props) {
  const { images, loading, onSelectImage } = props;

  if (loading) {
    return (
      <div className="galleryContainer">
        <div className="loadingState">
          <i className="fa-solid fa-gear"></i> Loading images...
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="galleryContainer">
        <div className="noImages">
          <p>No images found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="galleryContainer">
      <div className="galleryGrid">
        {images.map((image, index) => (
          <div
            key={image.date || index}
            className="galleryItem"
            onClick={() => onSelectImage(image)}
          >
            {image.media_type === 'image' ? (
              <img
                src={image.url}
                alt={image.title || `APOD ${image.date}`}
                loading="lazy"
              />
            ) : (
              <div className="videoPlaceholder">
                <i className="fa-solid fa-video"></i>
                <p>Video</p>
              </div>
            )}
            <div className="galleryItemOverlay">
              <h3>{image.title}</h3>
              <p className="galleryDate">{image.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
