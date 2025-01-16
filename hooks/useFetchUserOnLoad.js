import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserByToken } from "../lib/redux/slice/auth-slice";

export const useFetchUserOnLoad = () => {
  const dispatch = useDispatch();
  const token = Cookies.get("access_token");
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user?.name) {
      dispatch(fetchUserByToken(token));
    }
  }, [token, dispatch]);
};
