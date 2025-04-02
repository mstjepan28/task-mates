import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCallback } from "react";
import { database } from "./database/database";
import { MainRouter } from "./router/mainRouter";

export default () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 60 * 5 * 1000,
        staleTime: 60 * 4 * 1000,
      },
    },
  });

  const onAppMount = useCallback(() => {
    database.openConnection();

    return () => {
      database.closeConnection();
    };
  }, []);

  return (
    <div ref={onAppMount} className="w-dvw h-dvh fixed bg-gradient-to-r from-slate-950 to-slate-800 text-gray-50">
      <QueryClientProvider client={queryClient}>
        <MainRouter />
      </QueryClientProvider>
    </div>
  );
};
