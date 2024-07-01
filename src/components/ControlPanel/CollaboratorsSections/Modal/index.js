export const Modal = ({ children, title, subtitle, onClose }) => {
  return (
    <>
      <div className="modal" id="modal-new-collaborator">
        <div className="modal-content--medium">
          <span className="close" onClick={() => onClose(false)}></span>
          <h2 className="modal-title">{title}</h2>
          <p>{subtitle}</p>
          {children}
        </div>
      </div>
    </>
  );
};
