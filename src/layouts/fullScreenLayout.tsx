import { Outlet } from "react-router";
import { Navigation } from "../components/navigation";

export const FullScreenLayout = () => {
  return (
    <div className="size-full flex flex-col fixed overflow-hidden">
      <Navigation />
      <Outlet />
    </div>
  );
};
