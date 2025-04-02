import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { FullScreenLayout } from "../layouts/fullScreenLayout";

export const MainRouter = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <FullScreenLayout />,
      children: [
        {
          path: "/",
          Component: () => <Navigate to="/explore-movies" />,
        },
        {
          path: "/explore-movies",
          lazy: async () => ({ Component: (await import("../screens/movieExplorer")).MovieExplorer }),
        },
        {
          path: "/my-ratings",
          lazy: async () => ({ Component: (await import("../screens/ratingsList")).RatingsList }),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
