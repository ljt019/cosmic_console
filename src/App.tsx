import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Movies from "@/screens/movies";
import Movie from "@/screens/movie-player";
import Stellarium from "@/screens/stellarium";
import OpenSpace from "@/screens/open-space";

import { Button } from "./components/ui/button";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface RouteConfig {
  name: string;
  path: string;
  screen: React.ComponentType;
  sidebar: boolean;
}

const routesConfig: RouteConfig[] = [
  {
    name: "Movies",
    path: "/",
    screen: Movies,
    sidebar: true,
  },
  {
    name: "Movie",
    path: "/movie",
    screen: Movie,
    sidebar: false,
  },
  {
    name: "Open Space",
    path: "/open-space",
    screen: OpenSpace,
    sidebar: true,
  },
  {
    name: "Stellarium",
    path: "/stellarium",
    screen: Stellarium,
    sidebar: true,
  },
];

function SideBar() {
  const navigate = useNavigate();

  const isCurrentRoute = (routePath: string) => {
    return window.location.hash.includes(routePath);
  };

  // Map over routes and create a sidebar with buttons for each route
  return (
    <div className="w-1/6 h-screen bg-gray-800 text-white">
      {routesConfig.map((route) => (
        <div className="p-4">
          {route.path != "/movie" && (
            <Button
              onClick={() => navigate(route.path)}
              className={`block w-full text-left ${
                isCurrentRoute(route.path)
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {route.name}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

function Layout({
  children,
  renderSidebar,
}: {
  children: React.ReactNode;
  renderSidebar: boolean;
}) {
  return (
    <div className="flex">
      {renderSidebar && <SideBar />}
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}

function AppScreens() {
  return (
    <Routes>
      {routesConfig.map((route) => (
        <Route
          path={route.path}
          element={
            <Layout renderSidebar={route.sidebar}>
              <route.screen />
            </Layout>
          }
        />
      ))}
    </Routes>
  );
}

function App() {
  let queryClient = new QueryClient();

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AppScreens />
      </QueryClientProvider>
    </Router>
  );
}

export default App;
