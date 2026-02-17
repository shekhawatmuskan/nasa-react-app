export default function SideBar(props) {
  const { handleToggleModal, data } = props;
  return (
    <div className="sidebar">
      <div className="sidebarContents">
        <button onClick={handleToggleModal} className="sidebarCloseBtn">
          <i className="fa-solid fa-times"></i>
        </button>
        <h2>{data?.title}</h2>
        <div className="descriptionContainer">
          <p className="descriptionTitle">{data?.date}</p>
          <p>{data?.explanation} </p>
        </div>
      </div>
    </div>
  );
}
