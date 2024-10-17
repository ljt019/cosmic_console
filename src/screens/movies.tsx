import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";
import { walkInOn } from "@/api/lights/walkInOn";

export default function Movies() {
  useEffect(() => {
    walkInOn();
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-center">Full Dome Movies</h1>
      <div className="flex justify-center">
        <MovieButtons />
      </div>
    </div>
  );
}

const movies = [
  {
    name: "Sun Our Living Star",
    path: "movies/sun_our_living_star.mp4",
  },
  {
    name: "Dark Matter",
    path: "movies/dark_matter_mystery.mp4",
  },
  {
    name: "From the Earth to the Universe",
    path: "movies/from_the_earth_to_the_universe.mp4",
  },
  {
    name: "Seeing",
    path: "movies/seeing.mp4",
  },
];

function MovieButtons() {
  return (
    <div className="flex">
      {movies.map((movie) => (
        <div className="mt-4">
          <MovieButton name={movie.name} path={movie.path} />
        </div>
      ))}
    </div>
  );
}

interface MovieButtonProps {
  name: string;
  path: string;
}

function MovieButton({ name, path }: MovieButtonProps) {
  return (
    <Button onClick={() => invoke("open_movie_window", { relativePath: path })}>
      {name}
    </Button>
  );
}
