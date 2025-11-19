import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";
import {Movie} from "@/types/movie";

async function fetchMovie(id: string): Promise<Movie | null> {
    const res = await fetch(`http://localhost:8080/api/movies/${id}`, {
        next: {revalidate: 60},
    });
    if (!res.ok) return null;
    return res.json();
}

// function to get the embed ID from the youtube link
function getYouTubeId(url: string): string | null {
    try {
        const parsed = new URL(url);
        if (parsed.hostname.includes("youtube.com")) {
            return parsed.searchParams.get("v");
        }
        if (parsed.hostname === "youtu.be") {
            return parsed.pathname.slice(1);
        }
    } catch {
        return null;
    }
    return null;
}

export default async function MovieDetails(
    {params}: { params: Promise<{ id: string }> }
) {
    const {id} = await params;
    const movie = await fetchMovie(id);
    if (!movie) return notFound();
    const ytId = movie.trailer ? getYouTubeId(movie.trailer) : null;

    const showtimes = Array.isArray(movie.showtimes)
        ? movie.showtimes.map((st: any) => (typeof st === "string" ? st : st.showtime || st.time || ""))
            .filter(Boolean)
        : [];

    return (
        <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
            {/* MOVIE POSTER */}
            <div className="flex justify-center">
                <div className="relative w-64 h-96 rounded-xl overflow-hidden shadow-lg">
                    <Image
                        src={movie.poster || "/placeholder.png"}
                        alt={`${movie.title} poster`}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            {/* TITLE */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold">{movie.title}</h1>
                <p className="text-gray-700">
                    {movie.genre} · Rating: {movie.rating}/5
                </p>
            </div>

            {/* MOVIE DESCRIPTION */}
            {movie.description && (
                <p className="text-lg leading-7">{movie.description}</p>
            )}

            {/* SHOWTIMES */}
            {Array.isArray(movie.showtimes) && movie.showtimes.length > 0 && (
                <section>
                    <h2 className="text-xl font-semibold mb-3">Showtimes</h2>
                    <div className="flex flex-wrap gap-2">
                        {showtimes.map((time: string, i: number) => (
                            <Link
                                key={i}
                                href={`/booking/${movie.id}?showtime=${encodeURIComponent(time)}`}
                                className="px-4 py-2 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition"
                            >
                                {new Date(time).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {ytId ? (
                <div className="w-full max-w-3xl mx-auto">
                    <div className="relative pb-[56%] h-0 overflow-hidden rounded-lg shadow-lg">
                        <iframe
                            src={`https://www.youtube.com/embed/${ytId}`}
                            title={`${movie.title} trailer`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute top-0 left-0 w-full h-full"
                        />
                    </div>
                </div>
            ) : (
                <p className="text-sm text-gray-500">No trailer available</p>
            )}
        </main>
    );
}
