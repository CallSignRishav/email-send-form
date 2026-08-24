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
      <div className="grid min-h-[calc(100dvh-3.5rem)] place-items-center py-8">
        <Display />
      </div>
    </>
  );
};

export default page;
