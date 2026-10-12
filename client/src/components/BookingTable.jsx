import { formatCurrency, formatDate } from "../utils/billing";

export default function BookingTable({ bookings, selectedId, onSelect }) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E9E4DD] border-dashed py-14 text-center">
        <p className="text-sm text-[#6B625B]">
          No bookings match your search.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#E9E4DD] bg-white shadow-md">
      <table className="w-full min-w-[860px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[#E9E4DD] bg-[#F8F6F3]">
            <th className="w-10 py-3 pl-4 pr-2"></th>

            <th className="whitespace-nowrap px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B625B]">
              Booking ID
            </th>

            <th className="whitespace-nowrap px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B625B]">
              Guest Name
            </th>

            <th className="whitespace-nowrap px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B625B]">
              Room No.
            </th>

            <th className="whitespace-nowrap px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B625B]">
              Check-In
            </th>

            <th className="whitespace-nowrap px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B625B]">
              Check-Out
            </th>

            <th className="whitespace-nowrap px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B625B]">
              Room Type
            </th>

            <th className="whitespace-nowrap px-3 py-3 pr-4 text-right text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B625B]">
              Rate / Night
            </th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => {
            const isSelected = booking.id === selectedId;

            return (
              <tr
                key={booking.id}
                onClick={() => onSelect(booking.id)}
                className={`cursor-pointer border-b border-[#E9E4DD] last:border-b-0 transition-all duration-200 ${
                  isSelected
                    ? "bg-[#C8A96A]/10"
                    : "hover:bg-[#F8F6F3]"
                }`}
              >
                <td className="py-3 pl-4 pr-2">
                  <span
                    className={`relative flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                      isSelected
                        ? "border-[#C8A96A]"
                        : "border-[#B8AEA4]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="selected-booking"
                      checked={isSelected}
                      onChange={() => onSelect(booking.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      aria-label={`Select booking ${booking.id}`}
                    />

                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-[#C8A96A]" />
                    )}
                  </span>
                </td>

                <td className="whitespace-nowrap px-3 py-3 font-mono text-[13px] font-medium text-[#2A211B]">
                  {booking.displayId || booking.id}
                </td>

                <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-[#2A211B]">
                  {booking.guestName}
                </td>

                <td className="whitespace-nowrap px-3 py-3 text-sm text-[#6B625B]">
                  {booking.roomNumber}
                </td>

                <td className="whitespace-nowrap px-3 py-3 text-sm text-[#6B625B]">
                  {formatDate(booking.checkIn)}
                </td>

                <td className="whitespace-nowrap px-3 py-3 text-sm text-[#6B625B]">
                  {formatDate(booking.checkOut)}
                </td>

                <td className="whitespace-nowrap px-3 py-3 text-sm text-[#6B625B]">
                  {booking.roomType}
                </td>

                <td className="whitespace-nowrap px-3 py-3 pr-4 text-right font-mono text-sm font-medium text-[#2A211B]">
                  {formatCurrency(booking.ratePerNight)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}