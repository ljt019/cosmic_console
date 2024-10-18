import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Movies from "@/screens/movies";
import Movie from "@/screens/movie-player";
import Stellarium from "@/screens/stellarium";
import OpenSpace from "@/screens/open-space";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { MainSidebar } from "@/components/main-sidebar";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

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

function Layout({
  children,
  renderSidebar,
}: {
  children: React.ReactNode;
  renderSidebar: boolean;
}) {
  return (
    <div className="h-screen overflow-hidden">
      {renderSidebar ? (
        <>
          <SidebarProvider
            style={
              {
                "--sidebar-width": "19rem",
              } as React.CSSProperties
            }
          >
            <MainSidebar />
            <SidebarInset>
              <div className="mt-[1rem]">{children}</div>
            </SidebarInset>
          </SidebarProvider>
        </>
      ) : (
        <div className="mt-[1rem]">{children}</div>
      )}
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
