import logo from "../assets/logo.png";

const Loader = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <img
        src={logo}
        alt="logo"
        className="w-100 h-auto "
      />
    </div>
  );
};

export default Loader;