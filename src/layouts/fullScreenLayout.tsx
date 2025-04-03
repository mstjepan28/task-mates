import { Outlet } from "react-router";

export const FullScreenLayout = () => {
  return (
    <div className="size-full flex flex-col fixed overflow-hidden">
      <Outlet />
    </div>
  );
};
