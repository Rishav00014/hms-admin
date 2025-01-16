import Link from "next/link";

const DashboardLink = ({
  active = false,
  label = "Label",
  heroIcon,
  route = "#",
  handleClick = () => {},
}) => {
  return (
    <li onClick={handleClick} className="w-full">
      <Link
        href={route}
        className={`${
          active ? "bg-gray-100 text-gray-600" : "bg-transparent text-gray-400"
        } w-full hover:bg-gray-50 hover:text-gray-600 rounded-md py-2.5 px-3 flex flex-row items-center gap-1.5 transition-all duration-200`}
      >
        <span className="text-md">
          <i className={`${heroIcon}`}></i>
        </span>
        <span className="font-medium text-sm capitalize">{label}</span>
      </Link>
    </li>
  );
};

export default DashboardLink;
