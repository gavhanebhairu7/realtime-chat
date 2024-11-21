import React from "react";
import Logout from "./Logout";
import { IoPersonAddSharp } from "react-icons/io5";

function LeftPanel({ setContactVisible }) {
  return (
    // user profile future scope
    <div className="w-[5%] flex flex-col justify-end items-center py-10 bg-slate-950 border border-slate-900">
      <div
        className="h-[70vh] flex flex-col p-5 hover:cursor-pointer"
        onClick={() => setContactVisible((prev) => !prev)}
      >
        <IoPersonAddSharp className="text-white hover:bg-slate-700 h-12 w-12 p-2 rounded-full" />
      </div>
      <div className="h-[30vh] flex flex-col justify-end">
        <Logout />
      </div>
    </div>
  );
}

export default LeftPanel;
