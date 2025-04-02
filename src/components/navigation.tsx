import type { ReactNode } from "react";
import { MdOutlineRateReview, MdOutlineReviews, MdRateReview, MdReviews } from "react-icons/md";
import { Link, useLocation } from "react-router";

const ICON_SIZE = 38;

export const Navigation = () => {
  return (
    <div className="fixed z-20 bottom-4 right-4 grid gap-y-4">
      <NavigateButton
        to="/explore-movies"
        icon={<MdOutlineReviews size={ICON_SIZE} />}
        activeIcon={<MdReviews size={ICON_SIZE} />}
      />
      <NavigateButton
        to="/my-ratings"
        icon={<MdOutlineRateReview size={ICON_SIZE} />}
        activeIcon={<MdRateReview size={ICON_SIZE} />}
      />
    </div>
  );
};

const NavigateButton = ({ to, icon, activeIcon }: { to: string; icon: ReactNode; activeIcon: ReactNode }) => {
  const { pathname } = useLocation();
  const isActivePath = pathname === to;
  return (
    <div
      className={`size-16 flex items-center justify-center border-2 rounded-full text-white ${isActivePath ? "pointer-events-none bg-emerald-600" : "bg-slate-700"}`}
    >
      <Link to={to} className="round-full">
        {isActivePath ? activeIcon : icon}
      </Link>
    </div>
  );
};
