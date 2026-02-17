export default function NavigationSidebar(props) {
  const { isOpen, onClose, onShowGallery, onShowToday } = props;

  if (!isOpen) return null;

  return (
    <div className="navigationSidebar">
      <div onClick={onClose} className="navOverlay"></div>
      <div className="navigationContents">
        <button onClick={onClose} className="closeNavBtn">
          <i className="fa-solid fa-times"></i>
        </button>
        <h2>Menu</h2>
        <nav className="navMenu">
          <button onClick={onShowToday} className="navMenuItem">
            <i className="fa-solid fa-image"></i>
            <span>Today's Picture</span>
          </button>
          <button onClick={onShowGallery} className="navMenuItem">
            <i className="fa-solid fa-images"></i>
            <span>All Pictures</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
