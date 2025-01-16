import { MultiDigitAnimatedNumber } from "../common/AnimatedNumbers";

const Stat = ({ title, stat, icon, number }) => {
  return (
    <div className="bg-white w-full lg:w-[23.8%] text-sm p-4  rounded-xl shadow">
      <div className="flex justify-between">
        <div className="pb-2">
          <p className="pb-2 capitalize">{title}</p>

          <MultiDigitAnimatedNumber
            value={number}
            duration={3000}
            className="text-2xl font-bold text-gray-600"
          />
        </div>
        <div
          className={`${
            icon === "ri-box-2-line"
              ? "bg-red-100"
              : icon === "ri-signal-tower-line"
              ? "bg-amber-100"
              : icon === "ri-history-line"
              ? "bg-pink-100"
              : "bg-blue-100"
          } h-12 w-12 bg-blue-50 flex items-center justify-center rounded-full`}
        >
          <i
            className={`${icon} ri-2x  ${
              icon === "ri-box-2-line"
                ? "text-red-400"
                : icon === "ri-signal-tower-line"
                ? "text-amber-400"
                : icon === "ri-history-line"
                ? "text-pink-400"
                : "text-blue-400"
            } `}
          ></i>
        </div>
      </div>
      <p className="text-sm">
        <span className="text-green-400">
          <i className="ri-arrow-right-up-long-line"></i> {stat}
        </span>{" "}
        Up from yesterday
      </p>
    </div>
  );
};

export default Stat;
