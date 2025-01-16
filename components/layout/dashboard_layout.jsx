"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DashboardLink from "./dashboard_link";
import menu from "../../public/database/navigation.json";
import { usePathname } from "next/navigation";
import { useFetchUserOnLoad } from "@/hooks/useFetchUserOnLoad";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/lib/redux/slice/auth-slice";
import Cookies from "js-cookie";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const path = usePathname();
  const token = Cookies.get("access_token");
  // @getting user details - also verifying ✅
  useFetchUserOnLoad();
  const {
    user,
    loading,
    userLoading = true,
  } = useSelector((state) => state.auth);

  const router = useRouter();

  const dispatch = useDispatch();

  // user info
  const { name = "admin", phoneNo, role, _id, block } = user;

  // log out
  const handleLogout = () => {
    dispatch(logout());
    router.replace("/auth");
  };

  const pageTitle = (() => {
    switch (path) {
      case "/manage-trolleys":
        return "Manage Trolleys";
      case "/manage-trolleys/[detail]":
        return "Trolley Detail";
      case "/repair-and-maintenance":
        return "Repair and Maintenance";
      case "/repair-history":
        return "Repair History";
      case "/reports-and-analytics":
        return "Reports and Analytics";
      case "/create-user":
        return "Create User";
      case "/settings":
        return "Settings";
      case "/users":
        return "User List";
      default:
        return "Dashboard";
    }
  })();

  useEffect(() => {
    !token && handleLogout();
    return () => {};
  }, [token, _id, name]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Hidden on small screens, always visible on medium and larger */}
      <div
        className={` fixed inset-y-0 left-0 bg-white shadow transform transition-transform duration-300 z-30 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:w-64 w-64 xl:w-72`}
      >
        <nav className="flex py-4 flex-col gap-7 h-full">
          <div className="px-4 flex justify-center">
            {!userLoading && (
              <Link href="/">
                <Image
                  src={`${
                    role == "Air India"
                      ? "/image/logo.svg"
                      : "/image/logo-2.png"
                  }`}
                  priority={true}
                  alt="logo"
                  height={50}
                  width={150}
                />
              </Link>
            )}
          </div>

          {/* sidebar menu */}
          <ul className=" h-full overflow-y-auto vertical-scrollbar w-full flex flex-col gap-2 px-4 ">
            {/* menu */}
            <div className=" w-full flex flex-col gap-2">
              {menu.map((item, index) => {
                const { route, label, icon, accessFor = [] } = item;
                const haveAccess = accessFor?.includes(role);
                return (
                  haveAccess && (
                    <DashboardLink
                      key={index}
                      active={path === route}
                      route={route}
                      label={label}
                      heroIcon={icon}
                      handleClick={() => setIsSidebarOpen(false)}
                    />
                  )
                );
              })}

              <DashboardLink
                route="#"
                label="Log out"
                heroIcon="ri-logout-circle-line"
                handleClick={() => handleLogout()}
              />
            </div>
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden backdrop-blur-[2px]"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Sticky Header */}
        <header className="sticky top-0 bg-white shadow-sm py-3 flex justify-between items-center z-10 px-5 md:px-8">
          <div className="flex items-center gap-4 sm:gap-0 ">
            {/* Hamburger Icon (Visible on mobile) */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden outline-none "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
            <Link href="#" className="text-gray-800">
              <h1 className="text-sm font-medium ">{pageTitle}</h1>
            </Link>
          </div>

          {/* Bell Icon */}

          <div className="w-2/3 flex flex-row justify-end items-center gap-2">
            {!userLoading && (
              <div className="flex flex-row gap-3">
                <Link href="/profile">
                  <Image
                    className="w-14 h-14 rounded-full aspect-square"
                    src="https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611768.jpg?t=st=1735584879~exp=1735588479~hmac=42a5938dc554e482c14455d865a92131839718a4f3ae191094e95d65e561268d&w=1060"
                    alt="profile"
                    width={100}
                    height={100}
                  />
                </Link>
                <div className="flex flex-col text-gray-400 text-xs justify-center">
                  <p className="font-bold text-black text-base">{name}</p>
                  <p className="text-medium">{role}</p>
                </div>
              </div>
            )}
            {userLoading && (
              <div className="w-[170px] h-14  bg-gray-200 animate-pulse rounded-md" />
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="max-w-[100vw] flex-1 p-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
