"use client";
import { createUser, fetchUser } from "@/lib/redux/slice/user-slice";
import { errorToast, successToast } from "@/utils/toastMessage";
import Cookies from "js-cookie";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CreateUser = () => {
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    password: "",
    phoneNo: "",
    role: "Supervisor",
    password: "",
  });

  const token = Cookies.get("access_token");

  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.user);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event, data) => {
    event.preventDefault();
    const resultAction = await dispatch(
      createUser({
        token,
        data,
      })
    );

    if (createUser.fulfilled.match(resultAction)) {
      setUserData({
        name: "",
        username: "",
        password: "",
        phoneNo: "",
        role: "Supervisor"
      });
      successToast("User added successfully!");
      dispatch(fetchUser({ token }));
    } else {
      const message = resultAction.payload;
      errorToast(message);
    }
  };
  return (
    <section className="text-gray-600">
      {/* header */}
      <div className="flex justify-between items-center text-sm text-gray-50 w-full bg-blue-400 px-8 py-4 rounded-xl">
        <h1 className="font-bold  text-4xl pb-2">See list of created users</h1>
        <Link href="/users">
          <button className="bg-blue-200 p-3 h-fit rounded-full">
            <i className="ri-play-large-line text-white ri-xl"></i>
          </button>
        </Link>
      </div>

      {/* form  */}

      <div className="my-6 mx-auto w-1/2 rounded-xl bg-white p-5">
        <form
          onSubmit={(e) => handleSubmit(e, userData)}
          className="w-full grid grid-cols-2 gap-4 text-sm"
        >
          <div className="w-full flex flex-col gap-2">
            <label>Full Name</label>
            <input
              required
              className="border bg-gray-100 p-2 rounded-lg outline-none"
              type="text"
              value={userData?.name}
              name="name"
              placeholder="Enter name"
              onChange={handleChange}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label>User Name</label>
            <input
              required
              className="border bg-gray-100 p-2 rounded-lg outline-none"
              type="text"
              name="username"
              placeholder="Enter username"
              value={userData?.username}
              onChange={handleChange}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label>Phone Number</label>
            <input
              required
              className="border bg-gray-100 p-2 rounded-lg outline-none"
              type="tel"
              name="phoneNo"
              placeholder="Enter your phone number"
              value={userData?.phoneNo}
              onChange={handleChange}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label>Role</label>
            <select
              required
              name="role"
              className="border bg-gray-100 p-2 rounded-lg outline-none"
              value={userData?.role}
              onChange={handleChange}
            >
              <option value="Air India">Supervisor</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <label>Password</label>
            <input
              required
              className="border bg-gray-100 p-2 rounded-lg outline-none"
              type="text"
              value={userData?.password}
              name="password"
              placeholder="Enter password"
              onChange={handleChange}
            />
          </div>
          <button
            disabled={loading}
            className="col-span-2 mt-3 text-white bg-blue-400 px-20 py-3 rounded-lg font-medium disabled:opacity-50"
          >
            Add User
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateUser;
