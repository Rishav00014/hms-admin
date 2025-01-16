import "./loader.style.css";

const LineLoader = ({ bg = "bg-white" }) => {
  return (
    <>
      <div className="loaderRectangle">
        <div className={`${bg}`}></div>
        <div className={`${bg}`}></div>
        <div className={`${bg}`}></div>
      </div>
    </>
  );
};

export default LineLoader;
