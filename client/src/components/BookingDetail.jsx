import React from "react";
import { COLORS } from "../constants/theme";
import {
  CalendarDays,
  Bed,
  User,
  Hash,
  Moon,
  Users,
  Mail,
  Phone,
  CircleDollarSign,
} from "lucide-react";

const statusLabel = (status) => {
  if (!status) return "—";
  return status
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const BookingDetails = ({ booking }) => {
  return (
    <div
      className="
        w-full
        rounded-3xl
        mt-6
        p-5
        sm:p-6
        lg:p-8
        border
        transition-all
        duration-300
      "
      style={{
        backgroundColor: COLORS.SURFACE,
        borderColor: COLORS.BORDER,
        boxShadow: COLORS.CARD,
      }}
    >
      <h2
        className="text-lg sm:text-xl lg:text-2xl font-bold mb-6"
        style={{ color: COLORS.PRIMARY }}
      >
        Booking Details
      </h2>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-6 border-b"
        style={{ borderColor: COLORS.BORDER }}
      >
        <div>
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            <Hash size={17} />
            <span>Booking ID</span>
          </div>
          <p className="font-semibold mt-2 break-all" style={{ color: COLORS.TEXT_PRIMARY }}>
            {booking?.bookingId || "—"}
          </p>
        </div>

        <div>
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            <User size={17} />
            <span>Guest Name</span>
          </div>
          <p className="font-semibold mt-2" style={{ color: COLORS.TEXT_PRIMARY }}>
            {booking?.guestName || "—"}
          </p>
        </div>

        <div>
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            <Mail size={17} />
            <span>Email</span>
          </div>
          <p className="font-semibold mt-2 break-all" style={{ color: COLORS.TEXT_PRIMARY }}>
            {booking?.guestEmail || "—"}
          </p>
        </div>

        <div>
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            <Phone size={17} />
            <span>Phone</span>
          </div>
          <p className="font-semibold mt-2" style={{ color: COLORS.TEXT_PRIMARY }}>
            {booking?.guestPhone || "—"}
          </p>
        </div>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-b"
        style={{ borderColor: COLORS.BORDER }}
      >
        <div>
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            <Bed size={17} />
            <span>Room</span>
          </div>
          <p className="font-semibold mt-2" style={{ color: COLORS.TEXT_PRIMARY }}>
            {booking?.roomName || booking?.roomType || "—"}
          </p>
        </div>

        <div>
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            <Bed size={17} />
            <span>Room Number</span>
          </div>
          <p className="font-semibold mt-2" style={{ color: COLORS.TEXT_PRIMARY }}>
            {booking?.roomNumber ?? "—"}
          </p>
        </div>

        <div>
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            <Users size={17} />
            <span>Guests</span>
          </div>
          <p className="font-semibold mt-2" style={{ color: COLORS.TEXT_PRIMARY }}>
            {booking?.guestsCount ?? "—"}
          </p>
        </div>

        <div>
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            <CircleDollarSign size={17} />
            <span>Price / Night</span>
          </div>
          <p className="font-semibold mt-2" style={{ color: COLORS.TEXT_PRIMARY }}>
            {booking?.pricePerNight != null && booking?.pricePerNight !== "—"
              ? `PKR ${booking.pricePerNight}`
              : "—"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        <div>
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            <CalendarDays size={17} />
            <span>Check-in Date</span>
          </div>
          <p className="font-semibold mt-2" style={{ color: COLORS.TEXT_PRIMARY }}>
            {booking?.checkInDate || "—"}
          </p>
          <p className="text-sm mt-1" style={{ color: COLORS.TEXT_SECONDARY }}>
            {booking?.checkInTime || ""}
          </p>
        </div>

        <div>
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            <CalendarDays size={17} />
            <span>Check-out Date</span>
          </div>
          <p className="font-semibold mt-2" style={{ color: COLORS.TEXT_PRIMARY }}>
            {booking?.checkOutDate || "—"}
          </p>
          <p className="text-sm mt-1" style={{ color: COLORS.TEXT_SECONDARY }}>
            {booking?.checkOutTime || ""}
          </p>
        </div>

        <div>
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            <Moon size={17} />
            <span>Total Nights</span>
          </div>
          <p className="font-semibold mt-2" style={{ color: COLORS.TEXT_PRIMARY }}>
            {booking?.totalNights || "—"}
          </p>
        </div>

        <div>
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            <Hash size={17} />
            <span>Booking Status</span>
          </div>
          <p className="font-semibold mt-2 capitalize" style={{ color: COLORS.TEXT_PRIMARY }}>
            {statusLabel(booking?.bookingStatus)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;