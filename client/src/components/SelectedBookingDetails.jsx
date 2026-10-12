import { formatCurrency, formatDate } from "../utils/billing";

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B625B]">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-[#2A211B]">
        {value}
      </p>
    </div>
  );
}

export default function SelectedBookingDetails({ booking, breakdown }) {
  return (
    <section className="rounded-3xl border border-[#E9E4DD] bg-white p-6 shadow-lg transition-all duration-300">
      <h3 className="text-lg font-semibold text-[#2A211B]">
        Selected Booking Details
      </h3>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        <Field
          label="Booking ID"
          value={<span className="font-mono">{booking.displayId || booking.id}</span>}
        />

        <Field label="Guest Name" value={booking.guestName} />

        <Field label="Room Number" value={booking.roomNumber} />

        <Field label="Room Type" value={booking.roomType} />

        <Field
          label="Check-In"
          value={formatDate(booking.checkIn)}
        />

        <Field
          label="Check-Out"
          value={formatDate(booking.checkOut)}
        />

        <Field
          label="Stay Duration"
          value={`${breakdown.nights} night${breakdown.nights > 1 ? "s" : ""}`}
        />

        <Field
          label="Guests"
          value={booking.guestsCount ?? "—"}
        />

        <Field
          label="Rate / Night"
          value={formatCurrency(booking.ratePerNight)}
        />

        <Field
          label="Subtotal"
          value={formatCurrency(breakdown.subtotal)}
        />
      </div>
    </section>
  );
}