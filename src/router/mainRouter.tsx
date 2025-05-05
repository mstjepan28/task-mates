import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { FullScreenLayout } from "../layouts/fullScreenLayout";
import { MovieExplorer } from "../screens/movieExplorer";
import { MovieMenu } from "../screens/movieMenu";
import { RatingsList } from "../screens/ratingsList";

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
          Component: MovieMenu,
        },
        {
          path: "/movies/explore",
          Component: MovieExplorer,
        },
        {
          path: "/movies/ratings",
          Component: RatingsList,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
