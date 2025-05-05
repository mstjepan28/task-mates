import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
    {/* <PostHogProvider apiKey={env.posthogKey} options={{ api_host: env.posthogHost }}>
      <App />
    </PostHogProvider> */}
  </StrictMode>,
);
