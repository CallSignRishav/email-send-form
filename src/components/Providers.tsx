"use client";

import { useTheme } from "next-themes";
import { ToastContainer } from "react-toastify";

const Providers = () => {
  const { theme } = useTheme();

  return (
    <>
      {/* Toast Notification  */}
      <ToastContainer position={"top-center"} autoClose={3000} theme={theme} />
    </>
  );
};

export default Providers;
