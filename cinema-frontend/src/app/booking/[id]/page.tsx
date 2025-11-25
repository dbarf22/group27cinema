'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Movie } from '@/types/movie';
import { useSession } from '@/app/session/SessionContext';

type Ticket = {
  id: number;
  category: 'child' | 'adult' | 'senior';
  price: number;
};

const ageCategories = [
  { id: 'child', label: 'Child (Under 12)', price: 8 },
  { id: 'adult', label: 'Adult', price: 12 },
  { id: 'senior', label: 'Senior (65+)', price: 9 }
];

// Ticket Selection Component
function TicketSelection({ 
  movie, 
  showtime, 
  onContinue 
}: { 
  movie: Movie; 
  showtime: string; 
  onContinue: (tickets: Ticket[]) => void;
}) {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const addTicket = () => {
    setTickets([...tickets, { id: Date.now(), category: 'adult', price: 12 }]);
  };

  const removeTicket = (id: number) => {
    setTickets(tickets.filter(t => t.id !== id));
  };

  const updateTicket = (id: number, category: 'child' | 'adult' | 'senior') => {
    const cat = ageCategories.find(c => c.id === category);
    if (cat) {
      setTickets(tickets.map(t => t.id === id ? { ...t, category, price: cat.price } : t));
    }
  };

  const total = tickets.reduce((sum, t) => sum + t.price, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold mb-4">Select Tickets</h2>
        
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <div className="font-semibold">{movie.title}</div>
          <div className="text-sm text-gray-600">
            Showtime: {new Date(showtime).toLocaleString()}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {tickets.map((ticket, index) => (
            <div key={ticket.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded">
              <span className="font-semibold">Ticket {index + 1}</span>
              <select
                value={ticket.category}
                onChange={(e) => updateTicket(ticket.id, e.target.value as any)}
                className="flex-1 border rounded px-3 py-2"
              >
                {ageCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label} - ${cat.price}
                  </option>
                ))}
              </select>
              <button
                onClick={() => removeTicket(ticket.id)}
                className="text-red-600 hover:text-red-800 font-semibold"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addTicket}
          className="w-full mb-4 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
        >
          + Add Ticket
        </button>

        <div className="border-t pt-4 mb-4">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={() => onContinue(tickets)}
          disabled={tickets.length === 0}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Seat Selection ({tickets.length} ticket{tickets.length !== 1 ? 's' : ''})
        </button>
      </div>
    </div>
  );
}

// Seat Selection Component
function SeatSelection({ 
  movie, 
  showtime, 
  tickets, 
  onBack, 
  onConfirm 
}: { 
  movie: Movie; 
  showtime: string; 
  tickets: Ticket[]; 
  onBack: () => void;
  onConfirm: (seats: string[]) => void;
}) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12;

  // Mock occupied seats - in real app, fetch from backend
  const occupiedSeats = ['A3', 'A4', 'B5', 'C6', 'C7', 'D8'];

  const toggleSeat = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return;
    
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length < tickets.length) {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  const getSeatClass = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) {
      return 'bg-gray-400 cursor-not-allowed';
    }
    if (selectedSeats.includes(seatId)) {
      return 'bg-blue-600 text-white';
    }
    return 'bg-green-200 hover:bg-green-300 cursor-pointer';
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-blue-600 hover:underline flex items-center gap-2">
        ← Back to Tickets
      </button>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold mb-4">Select Seats</h2>
        
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <div className="font-semibold">{movie.title}</div>
          <div className="text-sm text-gray-600">
            Showtime: {new Date(showtime).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            Please select {tickets.length} seat{tickets.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Screen */}
        <div className="mb-8">
          <div className="bg-gray-800 text-white text-center py-2 rounded-t-3xl mx-12">
            SCREEN
          </div>
        </div>

        {/* Seat Grid */}
        <div className="mb-6 overflow-x-auto">
          <div className="inline-block min-w-full">
            {rows.map(row => (
              <div key={row} className="flex items-center gap-2 mb-2">
                <span className="w-6 font-semibold">{row}</span>
                {Array.from({ length: seatsPerRow }).map((_, i) => {
                  const seatNum = i + 1;
                  const seatId = `${row}${seatNum}`;
                  return (
                    <button
                      key={seatId}
                      onClick={() => toggleSeat(seatId)}
                      className={`w-10 h-10 rounded-t-lg font-semibold text-sm transition ${getSeatClass(seatId)}`}
                      disabled={occupiedSeats.includes(seatId)}
                    >
                      {seatNum}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-200 rounded-t-lg"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-t-lg"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-400 rounded-t-lg"></div>
            <span>Occupied</span>
          </div>
        </div>

        {selectedSeats.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="font-semibold mb-2">Selected Seats:</div>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map(seat => (
                <span key={seat} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  {seat}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => onConfirm(selectedSeats)}
          disabled={selectedSeats.length !== tickets.length}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {selectedSeats.length === tickets.length 
            ? 'Confirm Booking' 
            : `Select ${tickets.length - selectedSeats.length} more seat${tickets.length - selectedSeats.length !== 1 ? 's' : ''}`
          }
        </button>
      </div>
    </div>
  );
}

// Confirmation Component
function BookingConfirmation({ 
  movie, 
  showtime, 
  tickets, 
  seats, 
  onNewBooking 
}: { 
  movie: Movie; 
  showtime: string; 
  tickets: Ticket[]; 
  seats: string[];
  onNewBooking: () => void;
}) {
  const total = tickets.reduce((sum, t) => sum + t.price, 0);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left space-y-3">
          <div>
            <span className="font-semibold">Movie:</span> {movie.title}
          </div>
          <div>
            <span className="font-semibold">Showtime:</span> {new Date(showtime).toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Tickets:</span> {tickets.length}
          </div>
          <div>
            <span className="font-semibold">Seats:</span> {seats.join(', ')}
          </div>
          <div className="border-t pt-3 text-xl">
            <span className="font-semibold">Total:</span> ${total.toFixed(2)}
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          A confirmation email has been sent to your registered email address.
        </p>

        <button
          onClick={onNewBooking}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Book Another Movie
        </button>
      </div>
    </div>
  );
}

// Main Booking Page
export default function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ showtime?: string }>;
}) {
  const router = useRouter();
  const { currentUser } = useSession();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [currentShowtime, setCurrentShowtime] = useState<string>('');
  const [step, setStep] = useState<'tickets' | 'seats' | 'confirmation'>('tickets');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [seats, setSeats] = useState<string[]>([]);

  useEffect(() => {
    // If not logged in, send them to login page
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      const resolvedParams = await params;
      const resolvedSearchParams = await searchParams;
      
      const res = await fetch(`/api/movies/${resolvedParams.id}`);
      if (!res.ok) {
        notFound();
      }
      const movieData = await res.json();
      setMovie(movieData);
      
      if (resolvedSearchParams.showtime) {
        setCurrentShowtime(resolvedSearchParams.showtime);
      }
    };

    fetchData();
  }, [params, searchParams, currentUser, router]);

  // While redirecting / not logged in, don't show booking UI
  if (!currentUser) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="text-center">
          You must be logged in to book tickets. Redirecting to login...
        </div>
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="text-center">Loading...</div>
      </main>
    );
  }

  const handleTicketsContinue = (selectedTickets: Ticket[]) => {
    setTickets(selectedTickets);
    setStep('seats');
  };

  const handleSeatsConfirm = (selectedSeats: string[]) => {
    setSeats(selectedSeats);
    setStep('confirmation');
  };

  const handleNewBooking = () => {
    router.push('/');
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      {step === 'tickets' && (
        <TicketSelection
          movie={movie}
          showtime={currentShowtime}
          onContinue={handleTicketsContinue}
        />
      )}

      {step === 'seats' && (
        <SeatSelection
          movie={movie}
          showtime={currentShowtime}
          tickets={tickets}
          onBack={() => setStep('tickets')}
          onConfirm={handleSeatsConfirm}
        />
      )}

      {step === 'confirmation' && (
        <BookingConfirmation
          movie={movie}
          showtime={currentShowtime}
          tickets={tickets}
          seats={seats}
          onNewBooking={handleNewBooking}
        />
      )}
    </main>
  );
}
