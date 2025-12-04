'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { Movie } from '@/types/movie';
import { useSession } from '@/app/session/SessionContext';

type Ticket = {
  id: number;
  category: 'child' | 'adult' | 'senior';
  price: number;
};

type Card = {
  cardType: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  billingStreet: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  lastFour: string;
  // backend card has an id
  id?: number;
};

const ageCategories = [
  { id: 'child', label: 'Child (Under 12)', price: 8 },
  { id: 'adult', label: 'Adult', price: 12 },
  { id: 'senior', label: 'Senior (65+)', price: 9 },
];

// ----------------------------------------------------
// Ticket Selection Component
// ----------------------------------------------------
function TicketSelection({
  movie,
  showtime,
  onContinue,
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
    setTickets(tickets.filter((t) => t.id !== id));
  };

  const updateTicket = (id: number, category: 'child' | 'adult' | 'senior') => {
    const cat = ageCategories.find((c) => c.id === category);
    if (cat) {
      setTickets(
        tickets.map((t) =>
          t.id === id ? { ...t, category, price: cat.price } : t
        )
      );
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
            <div
              key={ticket.id}
              className="flex items-center gap-3 bg-gray-50 p-3 rounded"
            >
              <span className="font-semibold">Ticket {index + 1}</span>
              <select
                value={ticket.category}
                onChange={(e) =>
                  updateTicket(ticket.id, e.target.value as any)
                }
                className="flex-1 border rounded px-3 py-2"
              >
                {ageCategories.map((cat) => (
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
          Continue to Seat Selection ({tickets.length} ticket
          {tickets.length !== 1 ? 's' : ''})
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Seat Selection Component
// ----------------------------------------------------
function SeatSelection({
  movie,
  showtime,
  tickets,
  rows,
  seatsPerRow,
  screeningId,
  onBack,
  onConfirm,
}: {
  movie: Movie;
  showtime: string;
  tickets: Ticket[];
  rows: string[];
  seatsPerRow: number;
  screeningId: number;
  onBack: () => void;
  onConfirm: (seats: string[]) => void;
}) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);

  // Fetch occupied seats for this screening
  useEffect(() => {
    if (!screeningId) return;

    const fetchOccupiedSeats = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/checkout/screening/${screeningId}/seats`
        );
        if (!res.ok) {
          console.error('Failed to fetch occupied seats');
          return;
        }
        const data: string[] = await res.json();
        setOccupiedSeats(data);
      } catch (err) {
        console.error('Error fetching occupied seats:', err);
      }
    };

    fetchOccupiedSeats();
  }, [screeningId]);

  const toggleSeat = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else if (selectedSeats.length < tickets.length) {
      setSelectedSeats([...selectedSeats, seatId]);
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
      <button
        onClick={onBack}
        className="text-blue-600 hover:underline flex items-center gap-2"
      >
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
            Please select {tickets.length} seat
            {tickets.length !== 1 ? 's' : ''}
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
            {rows.map((row) => (
              <div key={row} className="flex items-center gap-2 mb-2">
                <span className="w-6 font-semibold">{row}</span>
                {Array.from({ length: seatsPerRow }).map((_, i) => {
                  const seatNum = i + 1;
                  const seatId = `${row}${seatNum}`;
                  return (
                    <button
                      key={seatId}
                      onClick={() => toggleSeat(seatId)}
                      className={`w-10 h-10 rounded-t-lg font-semibold text-sm transition ${getSeatClass(
                        seatId
                      )}`}
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
              {selectedSeats.map((seat) => (
                <span
                  key={seat}
                  className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                >
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
            : `Select ${
                tickets.length - selectedSeats.length
              } more seat${
                tickets.length - selectedSeats.length !== 1 ? 's' : ''
              }`}
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Booking Confirmation Component
// ----------------------------------------------------
function BookingConfirmation({
  movie,
  showtime,
  tickets,
  seats,
  savedCard,
  onNewBooking,
  screeningId,
  auditoriumId,
  rows,
  seatsPerRow,
  userId,
}: {
  movie: Movie;
  showtime: string;
  tickets: Ticket[];
  seats: string[];
  savedCard: Card | null;
  onNewBooking: () => void;
  screeningId: number;
  auditoriumId: number;
  rows: string[];
  seatsPerRow: number;
  userId: number;
}) {
  const total = tickets.reduce((sum, t) => sum + t.price, 0);

  const [cardholderName, setCardholderName] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>(
    savedCard ? `**** **** **** ${savedCard.lastFour}` : ''
  );
  const [expMonth, setExpMonth] = useState<string>(savedCard?.expMonth ?? '');
  const [expYear, setExpYear] = useState<string>(
    savedCard?.expYear ? savedCard.expYear.slice(-2) : ''
  );
  const [cvc, setCvc] = useState<string>('');
  const [isPaying, setIsPaying] = useState(false);

  // Convert labels like "A3" -> seat_id using your auditorium layout rule
  function labelToSeatId(label: string): number | null {
    if (!label || label.length < 2) return null;

    const rowChar = label[0];
    const seatNum = parseInt(label.slice(1), 10);
    if (Number.isNaN(seatNum)) return null;

    const rowIndex = rowChar.charCodeAt(0) - 'A'.charCodeAt(0); // 0-based
    const seatsPerAud = rows.length * seatsPerRow;

    // auditorium 1: 1..seatsPerAud
    // auditorium 2: seatsPerAud+1..2*seatsPerAud, etc.
    const baseId = (auditoriumId - 1) * seatsPerAud + 1;
    const indexWithinAud = rowIndex * seatsPerRow + (seatNum - 1);

    return baseId + indexWithinAud;
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardNumber || !expMonth || !expYear || !cvc) {
      alert('Please fill in your card details to complete payment.');
      return;
    }

    if (!screeningId || !userId) {
      alert('Missing screening or user info.');
      return;
    }

    setIsPaying(true);
    console.log('handlePayment called');

    try {
      // Convert seat labels to numeric seat IDs:
      const seatIds = seats
        .map(labelToSeatId)
        .filter((id): id is number => id !== null);

      if (seatIds.length !== seats.length) {
        alert('Error converting seat labels to seat IDs.');
        setIsPaying(false);
        return;
      }

      const adultCount = tickets.filter(
        (t) => t.category === 'adult'
      ).length;
      const childCount = tickets.filter(
        (t) => t.category === 'child'
      ).length;
      const seniorCount = tickets.filter(
        (t) => t.category === 'senior'
      ).length;

      const body = {
        screeningId,
        seatIds,
        cardID: savedCard && savedCard.id ? savedCard.id : 1, // fallback test card
        userID: userId,
        promoID: 0,
        adultTickets: adultCount,
        childTickets: childCount,
        seniorTickets: seniorCount,
      };

      console.log('Sending checkout body:', body);

      const resp = await fetch('http://localhost:8080/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log('Checkout response status:', resp.status);

      if (!resp.ok) {
        const text = await resp.text();
        console.error('Checkout failed:', text);
        alert('Payment / booking failed. Check console/backend logs.');
        setIsPaying(false);
        return;
      }

      const data = await resp.json();
      console.log('Checkout response JSON:', data);

      if (!data.success) {
        alert(data.message || 'Booking failed.');
        setIsPaying(false);
        return;
      }

      // Success – go home
      onNewBooking();
    } catch (err) {
      console.error(err);
      alert('Payment failed. Please try again.');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-lg border p-8">
        <h2 className="text-3xl font-bold mb-4 text-center">Review & Pay</h2>

        {/* Booking summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-3">
          <div>
            <span className="font-semibold">Movie:</span> {movie.title}
          </div>
          <div>
            <span className="font-semibold">Showtime:</span>{' '}
            {new Date(showtime).toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Tickets:</span> {tickets.length}
          </div>
          <div>
            <span className="font-semibold">Seats:</span>{' '}
            {seats.join(', ')}
          </div>
          <div className="border-t pt-3 text-xl">
            <span className="font-semibold">Total:</span>{' '}
            ${total.toFixed(2)}
          </div>
        </div>

        {/* Payment section */}
        <form onSubmit={handlePayment} className="space-y-4">
          <h3 className="text-xl font-semibold mb-2">Payment Method</h3>

          {/* Saved card display if exists */}
          {savedCard && (
            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm">
              <div className="font-semibold mb-1">Saved Card</div>
              <div>
                {savedCard.cardType} ending in {savedCard.lastFour}
              </div>
              <div>
                Expires {savedCard.expMonth}/
                {savedCard.expYear.slice(-2)}
              </div>
              <div className="mt-2 text-xs text-gray-600">
                You can use this saved card or update the fields below.
              </div>
            </div>
          )}

          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Name on card"
            />
          </div>

          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Card Number
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder={
                savedCard
                  ? `**** **** **** ${savedCard.lastFour}`
                  : '1234 5678 9012 3456'
              }
            />
          </div>

          {/* Expiration + CVC */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Expiration (MM/YY)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={expMonth}
                  onChange={(e) => setExpMonth(e.target.value)}
                  className="w-1/2 border rounded px-3 py-2"
                  placeholder="MM"
                />
                <input
                  type="text"
                  value={expYear}
                  onChange={(e) => setExpYear(e.target.value)}
                  className="w-1/2 border rounded px-3 py-2"
                  placeholder="YY"
                />
              </div>
            </div>

            <div className="w-24">
              <label className="block text-sm font-medium mb-1">
                CVC
              </label>
              <input
                type="password"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="CVC"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPaying}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPaying ? 'Processing...' : 'Complete Payment'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Main Booking Page
// ----------------------------------------------------
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
  const [step, setStep] = useState<'tickets' | 'seats' | 'confirmation'>(
    'tickets'
  );
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [seats, setSeats] = useState<string[]>([]);
  const [rows, setRows] = useState<string[]>(['A', 'B', 'C', 'D']);
  const [seatsPerRow, setSeatsPerRow] = useState<number>(10);
  const [screeningId, setScreeningId] = useState<number | null>(null);
  const [auditoriumId, setAuditoriumId] = useState<number | null>(null);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      const resolvedParams = await params;
      const resolvedSearchParams = await searchParams;

      // 1) Fetch the movie
      const res = await fetch(`/api/movies/${resolvedParams.id}`);
      if (!res.ok) {
        notFound();
      }
      const movieData = await res.json();
      setMovie(movieData);

      // 2) Decide which showtime string we are using
      const selectedShowtime: string =
        resolvedSearchParams.showtime ||
        movieData.showtimes?.[0]?.showtime ||
        '';

      setCurrentShowtime(selectedShowtime);

      // Find screening that matches this showtime
      const matchingScreening = movieData.showtimes?.find(
        (st: any) => st.showtime === selectedShowtime
      );
      if (matchingScreening) {
        setScreeningId(matchingScreening.id); // adjust if field name differs
      }

      if (!selectedShowtime) return;

      // 3) Fetch auditoriums
      const audRes = await fetch('/api/showrooms');
      if (!audRes.ok) {
        console.error('Failed to fetch showrooms');
        return;
      }
      const auditoriums = await audRes.json();

      // 4) Find the auditorium whose showtimes contain this showtime
      const matchingAuditorium = auditoriums.find((aud: any) =>
        aud.showtimes?.some((st: any) => st.showtime === selectedShowtime)
      );

      if (!matchingAuditorium) {
        console.warn('No matching auditorium for showtime', selectedShowtime);
        return;
      }
      setAuditoriumId(matchingAuditorium.id);

      // 5) Use its rows/columns to size the seat map
      const rowCount: number = matchingAuditorium.rows ?? 10;
      const colCount: number = matchingAuditorium.columns ?? 10;

      const rowLabels = Array.from({ length: rowCount }, (_, i) =>
        String.fromCharCode('A'.charCodeAt(0) + i)
      );

      setRows(rowLabels);
      setSeatsPerRow(colCount);
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

      {step === 'seats' && screeningId !== null && (
        <SeatSelection
          movie={movie}
          showtime={currentShowtime}
          tickets={tickets}
          rows={rows}
          seatsPerRow={seatsPerRow}
          screeningId={screeningId}
          onBack={() => setStep('tickets')}
          onConfirm={handleSeatsConfirm}
        />
      )}

      {step === 'confirmation' && screeningId !== null && (
        <BookingConfirmation
          movie={movie}
          showtime={currentShowtime}
          tickets={tickets}
          seats={seats}
          savedCard={(currentUser as any)?.cards?.[0] ?? null}
          onNewBooking={handleNewBooking}
          screeningId={screeningId}
          auditoriumId={auditoriumId ?? 1} // fallback to 1 if somehow null
          rows={rows}
          seatsPerRow={seatsPerRow}
          userId={(currentUser as any)?.id}
        />
      )}
    </main>
  );
}
