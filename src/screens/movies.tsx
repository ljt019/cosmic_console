import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";
import { walkInOn } from "@/api/lights/walkInOn";
import { Film, Clock, Users } from "lucide-react";

const movies = [
  {
    name: "Sun Our Living Star",
    path: "movies/sun_our_living_star.mp4",
    runtime: "25 minutes",
    audience: "unknown",
  },
  {
    name: "Dark Matter",
    path: "movies/dark_matter_mystery.mp4",
    runtime: "38 minutes",
    audience: "unknown",
  },
  {
    name: "From the Earth to the Universe",
    path: "movies/from_the_earth_to_the_universe.mp4",
    runtime: "30 minutes",
    audience: "unknown",
  },
  {
    name: "Seeing",
    path: "movies/seeing.mp4",
    runtime: "22 minutes",
    audience: "unknown",
  },
];

interface MovieButtonProps {
  name: string;
  path: string;
  runtime: string;
  audience: string;
}

function MovieButton({ name, path, runtime, audience }: MovieButtonProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        <CardDescription>
          <div className="flex items-center mt-1">
            <Clock className="mr-1 h-4 w-4" />
            <span className="text-sm">{runtime}</span>
          </div>
          <div className="flex items-center mt-1">
            <Users className="mr-1 h-4 w-4" />
            <span className="text-sm">{audience}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full"
          onClick={() => invoke("open_movie_window", { relativePath: path })}
        >
          <Film className="mr-2 h-4 w-4" />
          Play Movie
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Movies() {
  useEffect(() => {
    walkInOn();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Full Dome Movies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieButton
            key={movie.path}
            name={movie.name}
            path={movie.path}
            runtime={movie.runtime}
            audience={movie.audience}
          />
        ))}
      </div>
    </div>
  );
}
