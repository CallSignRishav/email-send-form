import Display from "@/components/Display";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: "Home | Email Send Form",
  };
};

const page = () => {
  return (
    <>
      <div className="grid place-items-center h-dvh">
        <Display />
      </div>
    </>
  );
};

export default page;
