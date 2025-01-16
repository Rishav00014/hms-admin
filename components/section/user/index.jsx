"use client";
import { useDispatch, useSelector } from "react-redux";
import { createUser, fetchUser } from "@/lib/redux/slice/user-slice";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import moment from "moment";
const token = Cookies.get("access_token");
const TableRow = ({ data }) => {
  const [status, setStatus] = useState(false);
  const dispatch = useDispatch();
  const { _id, name, role, username, phoneNo, createdAt, block } = data;
  const date = moment(createdAt).format("D MMM YY");
  const { user, userLoading = true } = useSelector((state) => state.auth);

  const handleStatus = async (id) => {
    setStatus(!status);
    const resultAction = await dispatch(
      createUser({
        token,
        data: {
          block: !status,
        },
        userId: id,
      })
    );
  };
  const roleSkin = (text) => {
    if (text?.includes("Super")) {
      return "teal";
    } else if (text?.includes("Air")) {
      return "red";
    } else {
      return "green";
    }
  };

  useEffect(() => {
    setStatus(block);
    return () => {};
  }, [block]);

  const actionAccess = ["Super Admin"];
  const hasAccess = actionAccess?.includes(user?.role);

  return (
    <tr className="border-b">
      <td className="px-4 py-3 capitalize">{name || username}</td>
      <td className="px-4 py-3">
        <span className="font-semibold text-purple-500 text-md">@ </span>
        {username}
      </td>

      <td className="px-4 py-3 text-left ">{phoneNo}</td>
      <td className="px-4 py-3 text-center capitalize">
        <span
          className={`text-${roleSkin(role)}-600 bg-${roleSkin(
            role
          )}-100 px-4 py-1.5 rounded-2xl font-medium`}
        >
          {role}
        </span>
      </td>
      <td className="px-4 py-3 text-left">{date}</td>
      <td className="px-4 py-3 flex justify-center">
        <label className="inline-flex items-center me-5 cursor-pointer">
          <input
            disabled={userLoading || !hasAccess || (username === "admin")}
            checked={!status}
            onChange={() => handleStatus(_id, status)}
            type="checkbox"
            className="sr-only peer disabled:cursor-not-allowed"
          />
          <div
            className={`${
              !hasAccess && "opacity-50 cursor-not-allowed"
            } relative w-11 h-6 bg-gray-200 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-green-600`}
          />
        </label>
      </td>
    </tr>
  );
};
const AllUsers = () => {
  const dispatch = useDispatch();
  const { dataLoading, userList } = useSelector((state) => state.user);

  useEffect(() => {
    token && dispatch(fetchUser({ token }));
    return () => {};
  }, [token]);

  return (
    <section className="text-gray-600">
      <div className="w-full bg-white rounded-xl mt-6 pb-6 shadow">
        <div className="overflow-x-auto">
          <table className="w-full font-medium ">
            <thead className="border-b text-sm capitalize text-black ">
              <tr>
                <th className="text-left font-bold  px-4 py-3">name</th>
                <th className="text-left font-bold  px-4 py-3">user name</th>
                <th className="text-left font-bold px-4 py-3">phone no</th>
                <th className="text-center font-bold px-4 py-3">role</th>
                <th className="text-left font-bold px-4 py-3">Date</th>
                <th className="text-center font-bold px-4 py-3">action</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {userList.map((user, index) => {
                const { _id } = user;
                return <TableRow data={user} key={_id} />;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AllUsers;
