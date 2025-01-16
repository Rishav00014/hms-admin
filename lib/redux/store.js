import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth-slice";
import trolleyReducer from "./slice/trolley-slice";
import userReducer from "./slice/user-slice";
import repairReducer from "./slice/trolley-repair-slice";
import hallReducer from "./slice/hall-slice";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      trolley: trolleyReducer,
      user: userReducer,
      hall: hallReducer
    },
    devTools: process.env.NODE_ENV !== "production",
  });
}

export const store = makeStore();
