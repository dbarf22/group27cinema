"use client";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useSession} from '@/app/session/SessionContext';

type Order = {
    bookingId: number;
    cardLastFour: number;
    numberOfTickets: number;
    totalPrice: number;
    movieTitle: string;
    screeningTime: string;
    theatreName: string;
    promotionCode: string;
    promotionDiscount: number;
    tickets: Ticket[];
    bookingTime: string;
}

type Ticket = {
    id: number;
    rowLabel: string;
    seatNumber: number;
    price: number;
    ticketType: string;
}

const PortalPage = () => {
    const [accountType, setAccountType] = useState("");
    const router = useRouter();
    const {currentUser} = useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);

    function formatLocal(iso: string) {
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        return d.toLocaleString();
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                let key = currentUser?.userKey;
                const response = await fetch(`/api/user/bookings?userKey=${key}`);
                const data = await response.json();
                setOrders(data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [currentUser]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let key = currentUser?.userKey;
                const response = await fetch(`/api/auth/get-account-type?userKey=${key}`);
                if (!response.ok) {
                    setAccountType("Customer")
                } else {
                    setAccountType("Admin")
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);


    const go = (path: string) => {
        console.log(`Navigate to: ${path}`);
        router.push(path);
    };

    if (accountType !== "Admin") {
        return (
            <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
                <h1 className={"card-title text-3xl py-7 justify-center"}>Your Order History</h1>
                <div className={"card-body text-xl"}>
                    <table className="table">
                        <thead>
                        <tr className="">
                            <th>Movie Title</th>
                            <th>Last 4 Digits of Payment</th>
                            <th>Number of Tickets</th>
                            <th>Screening Time</th>
                            <th>Promo Used</th>
                            <th>Promotion Discount</th>
                            <th>Price</th>
                            <th>Date of Purchase</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order) => {
                            const modalID = `modal-${order.bookingId}`;
                            return (
                                <tr key={order.bookingId}>
                                    <td>{order.movieTitle}</td>
                                    <td>{order.cardLastFour}</td>
                                    <td>{order.numberOfTickets}</td>
                                    <td>{formatLocal(order.bookingTime)}</td>
                                    <td>{order.promotionCode}</td>
                                    <td>{order.promotionDiscount}%</td>
                                    <td>${order.totalPrice}</td>
                                    <td>{formatLocal(order.bookingTime)}</td>
                                    <td>
                                        <button className="btn"
                                                onClick={() =>
                                                    (document.getElementById(modalID) as HTMLDialogElement).showModal()}>Details
                                        </button>
                                        <dialog id={modalID} className="modal">
                                            <div className="modal-box text-center ">
                                                <h3 className="font-bold text-lg ">Order Details</h3>
                                                <table className="table text-center">
                                                    <thead>
                                                    <tr>
                                                        <td>Seat</td>
                                                        <td>Ticket Type</td>
                                                        <td>Price</td>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                        {order.tickets?.map(ticket => (
                                                            <tr>
                                                                <td>{ticket.rowLabel}{ticket.seatNumber}</td>
                                                                <td>{ticket.ticketType}</td>
                                                                <td>{ticket.price}</td>
                                                            </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                                <div className="modal-action">
                                                    <form method="dialog">
                                                        <button className="btn">Close</button>
                                                    </form>
                                                </div>
                                            </div>
                                        </dialog>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>

            </div>
        );
    }

    return (
        <div>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
                <p className="mb-8">
                    Manage movies, users, promotions, and showtimes from one place.
                </p>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
                    <div
                        onClick={() => go("portal/admin/movies")}
                        className="card cursor-pointer bg-base-100 border-base-300 border shadow-md p-6 hover:shadow-lg
            hover:bg-base-300 transition"
                    >
                        <h2 className="text-xl font-semibold mb-2">Manage Movies</h2>
                        <p className="text-sm">
                            Add new movies.
                        </p>
                    </div>

                    <div
                        onClick={() => go("portal/admin/promotions")}
                        className="card cursor-pointer bg-base-100 border-base-300 border shadow-md p-6
            hover:shadow-lg hover:bg-base-300 transition"
                    >
                        <h2 className="text-xl font-semibold  mb-2">Manage Promotions</h2>
                        <p className="text-sm">
                            Create or update promotional offers and discounts.
                        </p>
                    </div>

                    <div
                        onClick={() => go("portal/admin/manage-showtimes")}
                        className="card cursor-pointer bg-base-100 border-base-300 border shadow-md p-6 hover:shadow-lg
            hover:bg-base-300 transition"
                    >
                        <h2 className="text-xl font-semibold  mb-2">Manage Showtimes</h2>
                        <p className="text-sm">
                            Schedule new showtimes and update existing ones.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortalPage;
