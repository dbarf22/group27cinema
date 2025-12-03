import {Movie} from "@/types/movie";
import HomePageClient from "./HomePageClient";

export default async function HomePage() {
    const res = await fetch("http://localhost:8080/api/movies", {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch movies");
    const allMovies: Movie[] = await res.json();

    const nowPlaying = allMovies.filter((m) => m.showtimes?.length > 0);
    const comingSoon = allMovies.filter((m) => !m.showtimes?.length);



    return (

        <HomePageClient nowPlaying={nowPlaying} comingSoon={comingSoon} />
    );
}
