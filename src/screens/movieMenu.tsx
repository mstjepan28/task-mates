import { Link } from "react-router";

export const MovieMenu = () => {
  return (
    <div className="grid gap-y-4 p-4">
      <h1 className="text-4xl italic text-center py-4">𝓜𝓸𝓿𝓲𝓮𝓼</h1>
      <MovieMenuItem path="/movies/explore">Explore page</MovieMenuItem>
      <MovieMenuItem path="/movies/ratings">My ratings</MovieMenuItem>
    </div>
  );
};

const MovieMenuItem = ({ path, children }: { path: string; children: React.ReactNode }) => {
  return (
    <Link
      to={path}
      className="
        font-extrabold uppercase border rounded-lg p-4 text-center text-gray-50 
        transition-colors duration-200 backdrop-blur-2xl brightness-200
      "
    >
      {children}
    </Link>
  );
};
