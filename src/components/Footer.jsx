export default function Footer(props) {
  const { showModal, handleToggleModal, handleToggleNavSidebar, data, showGallery } = props;

  if (showGallery) {
    return (
      <footer className="galleryFooter">
        <div className="bgGradient"></div>
        <div>
          <h1>APOD PROJECT</h1>
          <h2>All Pictures</h2>
        </div>
        <button onClick={handleToggleNavSidebar}>
          <i className="fa-solid fa-bars"></i>
        </button>
      </footer>
    );
  }

  return (
    <footer className={showModal ? 'sidebarOpen' : ''}>
      <div className="bgGradient"></div>
      <div>
        <h1>APOD PROJECT</h1> 
        <h2>{data?.title}</h2>
      </div>
      <div className="footerButtons">
        <button onClick={handleToggleNavSidebar} className="menuBtn">
          <i className="fa-solid fa-bars"></i>
        </button>
        <button onClick={handleToggleModal}>
          <i className="fa-solid fa-circle-info"></i>
        </button>
      </div>
    </footer>
  );
}
