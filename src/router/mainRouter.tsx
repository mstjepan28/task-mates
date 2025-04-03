import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { FullScreenLayout } from "../layouts/fullScreenLayout";

const lazyLoad = async (path: string) => {
  const screen = await import(path);
  const keys = Object.keys(screen);

  return { Component: screen[keys[0]] };
};

export const MainRouter = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <FullScreenLayout />,
      children: [
        {
          path: "/",
          Component: () => <Navigate to="/movies" />,
        },
        {
          path: "/movies",
          lazy: async () => lazyLoad("../screens/movieMenu.tsx"),
        },
        {
          path: "/movies/explore",
          lazy: async () => lazyLoad("../screens/movieExplorer"),
        },
        {
          path: "/movies/ratings",
          lazy: async () => lazyLoad("../screens/ratingsList"),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
