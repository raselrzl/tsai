import { SignUp } from "@clerk/nextjs";


import { Metadata } from "next";


export const metadata: Metadata = {
  title: "ts-ai"
};
const page = () => {
  return (
    <div className="flex items-center justify-center h-screen mx-auto">
        <SignUp />
    </div>
  )
};

export default page;