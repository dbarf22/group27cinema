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

type Promo = {
  id: number;
  promoCode: string;
  discount: number; // percentage discount
  description: string;
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
      console.log("Fetching occupied seats for screening:", screeningId);

      const res = await fetch(
        `http://localhost:8080/api/checkout/screening/${screeningId}/seats`
      );

      console.log("Occupied seats response status:", res.status);

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error(
          "Failed to fetch occupied seats:",
          res.status,
          text
        );
        return;
      }

      const data: string[] = await res.json();
      console.log("Occupied seats payload:", data);
      setOccupiedSeats(data);
    } catch (err) {
      console.error("Error fetching occupied seats:", err);
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
  savedCards,
  onNewBooking,
  screeningId,
  auditoriumId,
  rows,
  seatsPerRow,
  userId,
  seatIdOffset = 0,
}: {
  movie: Movie;
  showtime: string;
  tickets: Ticket[];
  seats: string[];
  savedCards: Card[];
  onNewBooking: () => void;
  screeningId: number;
  auditoriumId: number;
  rows: string[];
  seatsPerRow: number;
  userId: number;
  seatIdOffset?: number;
}) {
  const router = useRouter();

  // cards
  const [selectedCardId, setSelectedCardId] = useState<number | null>(
    savedCards[0]?.id ?? null
  );
  const [isPaying, setIsPaying] = useState(false);

  // promotions
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<Promo | null>(null);
  const [promoChecking, setPromoChecking] = useState(false);
  const [promoError, setPromoError] = useState('');

  const TAX_RATE = 0.08;
  const ONLINE_FEE = 2; // $2 flat online fee

  const subtotal = tickets.reduce((sum, t) => sum + t.price, 0);

  const discountAmount =
    appliedPromo && appliedPromo.discount
      ? (subtotal * appliedPromo.discount) / 100
      : 0;

  const subtotalAfterPromo = Math.max(0, subtotal - discountAmount);

  const taxAmount = subtotalAfterPromo * TAX_RATE;

  const finalTotal = subtotalAfterPromo + taxAmount + ONLINE_FEE;

  // Convert labels like "A3" -> seat_id using your layout rule
  function labelToSeatId(label: string): number | null {
    if (!label || label.length < 2) return null;

    const rowChar = label[0]; // 'A'
    const seatNum = parseInt(label.slice(1), 10);
    if (Number.isNaN(seatNum)) return null;

    const rowIndex = rowChar.charCodeAt(0) - 'A'.charCodeAt(0); // 0-based
    const indexWithinAud = rowIndex * seatsPerRow + (seatNum - 1);

    return seatIdOffset + indexWithinAud + 1;
  }

  const handleApplyPromo = async () => {
    setPromoError('');
    setAppliedPromo(null);

    const trimmed = promoCode.trim();
    if (!trimmed) {
      setPromoError('Please enter a promo code.');
      return;
    }

    setPromoChecking(true);
    try {
      // adjust URL/path to your actual promo validation endpoint
      const resp = await fetch(
        `http://localhost:8080/api/checkout/discount/${encodeURIComponent(
          trimmed
        )}`
      );

      if (!resp.ok) {
        const text = await resp.text();
        console.error('Promo validate failed:', text);
        setPromoError('Promo code is invalid or expired.');
        setAppliedPromo(null);
        return;
      }

      const data = await resp.json();
      // assuming backend returns { id, promoCode, discount, description }
      const promo: Promo = {
        id: data.id,
        promoCode: data.promoCode,
        discount: data.discount,
        description: data.description,
      };

      setAppliedPromo(promo);
      setPromoError('');
    } catch (err) {
      console.error('Error validating promo:', err);
      setPromoError('Could not validate promo code. Try again.');
      setAppliedPromo(null);
    } finally {
      setPromoChecking(false);
    }
  };

  const handleClearPromo = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!screeningId || !userId) {
      alert('Missing screening or user info.');
      return;
    }

    if (!selectedCardId) {
      alert('Please select a payment method.');
      return;
    }

    setIsPaying(true);

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

      const adultCount = tickets.filter((t) => t.category === 'adult').length;
      const childCount = tickets.filter((t) => t.category === 'child').length;
      const seniorCount = tickets.filter((t) => t.category === 'senior').length;

      const body = {
        screeningId,
        seatIds,
        cardID: selectedCardId,
        userID: userId,
        promoCode: appliedPromo ? appliedPromo.promoCode : '',
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

      onNewBooking();
    } catch (err) {
      console.error(err);
      alert('Payment failed. Please try again.');
    } finally {
      setIsPaying(false);
    }
  };

  const handleGoToEditProfile = () => {
    router.push('/profile/edit');
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
            <span className="font-semibold">Seats:</span> {seats.join(', ')}
          </div>

          <div className="border-t pt-3 space-y-1">
  {/* Ticket subtotal before promo */}
  <div className="flex justify-between text-sm">
    <span>Ticket Subtotal:</span>
    <span>${subtotal.toFixed(2)}</span>
  </div>

  {/* Promo discount (if any) */}
  {appliedPromo && (
    <>
      <div className="flex justify-between text-sm text-green-700">
        <span>
          Promo ({appliedPromo.promoCode} - {appliedPromo.discount}% off):
        </span>
        <span>- ${discountAmount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{appliedPromo.description}</span>
      </div>
    </>
  )}

  {/* Subtotal after promo */}
  <div className="flex justify-between text-sm">
    <span>Subtotal after promo:</span>
    <span>${subtotalAfterPromo.toFixed(2)}</span>
  </div>

  {/* 8% tax */}
  <div className="flex justify-between text-sm">
    <span>Sales tax (8%):</span>
    <span>${taxAmount.toFixed(2)}</span>
  </div>

  {/* $2 fee */}
  <div className="flex justify-between text-sm">
    <span>Online booking fee:</span>
    <span>${ONLINE_FEE.toFixed(2)}</span>
  </div>

  {/* Final total */}
  <div className="flex justify-between text-xl font-semibold pt-2">
    <span>Total:</span>
    <span>${finalTotal.toFixed(2)}</span>
  </div>
</div>

        </div>

        {/* Promo code section */}
        <div className="mb-6 border rounded-lg p-4 bg-gray-50 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold">Have a promo code?</h3>
            {appliedPromo && (
              <button
                type="button"
                className="text-xs text-red-600 hover:underline"
                onClick={handleClearPromo}
              >
                Remove promo
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 border rounded px-3 py-2 text-sm"
              placeholder="Enter promo code"
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              disabled={promoChecking}
              className="px-4 py-2 rounded bg-gray-800 text-white text-sm font-semibold disabled:opacity-50"
            >
              {promoChecking ? 'Checking...' : 'Apply'}
            </button>
          </div>
          {promoError && (
            <div className="text-xs text-red-600 mt-1">{promoError}</div>
          )}
          {appliedPromo && !promoError && (
            <div className="text-xs text-green-700 mt-1">
              Promo <span className="font-semibold">{appliedPromo.promoCode}</span> applied: {appliedPromo.discount}
              % off.
            </div>
          )}
        </div>

        {/* Payment section */}
        <form onSubmit={handlePayment} className="space-y-4">
          <h3 className="text-xl font-semibold mb-2">Payment Method</h3>

          {savedCards.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                You don&apos;t have any saved payment methods.
              </p>
              <button
                type="button"
                onClick={handleGoToEditProfile}
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Add Payment Method in Profile
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {savedCards.map((card) => (
                  <label
                    key={card.id}
                    className="flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="savedCard"
                      value={card.id}
                      checked={selectedCardId === card.id}
                      onChange={() => setSelectedCardId(card.id ?? null)}
                    />
                    <div className="text-sm">
                      <div className="font-semibold">
                        {card.cardType}{' '}
                        {card.lastFour
                          ? `ending in ${card.lastFour}`
                          : card.cardNumber
                          ? `ending in ${card.cardNumber.slice(-4)}`
                          : ''}
                      </div>
                      <div className="text-gray-600">
                        Expires {card.expMonth}/{card.expYear}
                      </div>
                      {card.billingStreet && (
                        <div className="text-xs text-gray-500">
                          Billing: {card.billingStreet}
                          {card.billingCity && `, ${card.billingCity}`}
                          {card.billingState && `, ${card.billingState}`}{' '}
                          {card.billingZip}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              <button
                type="button"
                onClick={handleGoToEditProfile}
                className="w-full mt-2 border border-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-50 text-sm"
              >
                Manage Payment Methods in Profile
              </button>

              <button
                type="submit"
                disabled={isPaying || !selectedCardId}
                className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPaying ? 'Processing...' : 'Complete Payment'}
              </button>
            </>
          )}
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
  const [seatIdOffset, setSeatIdOffset] = useState<number>(0);

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

    // 3) Find the screening for this showtime
    const matchingScreening = movieData.showtimes?.find(
      (st: any) => st.showtime === selectedShowtime
    );

    if (!matchingScreening) {
      console.warn('No matching screening for showtime', selectedShowtime);
      return;
    }

    // use screening id for occupied seats (what you already do)
    const screeningIdLocal: number = matchingScreening.id;
    setScreeningId(screeningIdLocal);

    // 4) Get the auditorium id from the screening
    // Adjust these two lines depending on your actual JSON shape:
    const screeningAuditoriumId: number | undefined =
      matchingScreening.auditorium?.id ?? matchingScreening.auditoriumId;

    if (!screeningAuditoriumId) {
      console.warn('Screening has no auditorium id:', matchingScreening);
      return;
    }

    // 5) Fetch auditoriums
    const audRes = await fetch('/api/showrooms');
    if (!audRes.ok) {
      console.error('Failed to fetch showrooms');
      return;
    }
    const auditoriums = await audRes.json();

    // 6) Find the auditorium by its id (NOT by showtime anymore)
    const matchingAuditorium = auditoriums.find(
      (aud: any) => aud.id === screeningAuditoriumId
    );

    if (!matchingAuditorium) {
      console.warn(
        'No matching auditorium for id',
        screeningAuditoriumId,
        'available auditoriums:',
        auditoriums
      );
      return;
    }

    setAuditoriumId(matchingAuditorium.id);

// 7) Use its rows/columns to size the seat map
const rowCount: number = matchingAuditorium.rows ?? 10;
const colCount: number = matchingAuditorium.columns ?? 10;

// --- NEW: compute offset based on auditoriums before this one ---
let offset = 0;
for (const aud of auditoriums) {
  if (aud.id === matchingAuditorium.id) break;
  const r = aud.rows ?? 10;
  const c = aud.columns ?? 10;
  offset += r * c;
}
setSeatIdOffset(offset);
// For your example:
// - aud1: offset = 0          -> seat IDs 1..150
// - aud2: offset = 150        -> seat IDs 151..250
// - aud3: offset = 150+100=250 -> seat IDs 251..300
// ---------------------------------------------------------------

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
    router.push('/booking/success');
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
          savedCards={(currentUser as any)?.cards ?? []}
          onNewBooking={handleNewBooking}
          screeningId={screeningId}
          auditoriumId={auditoriumId ?? 1}
          rows={rows}
          seatsPerRow={seatsPerRow}
          userId={(currentUser as any)?.id}
        />
      )}
    </main>
  );
}
