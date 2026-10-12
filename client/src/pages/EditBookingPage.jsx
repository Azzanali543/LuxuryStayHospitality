import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { ROLES } from "../constants/roles";
import {
  COLORS,
  FONTS,
  SHADOWS,
  BORDER_RADIUS,
} from "../constants/theme";
import AsideBar from "../components/AsideBar";
import bookingApi from "../api/bookingApi";
import { getAllRooms } from "../api/roomApi";
import * as authApi from "../api/authApi";
import {
  ArrowLeft,
  Save,
  CheckCircle,
  Search,
  Edit,
  Trash2,
} from "lucide-react";

const EditBookingPage = () => {
  const { id } = useParams();
  const user = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [booking, setBooking] = useState(null);
  const [existingGuests, setExistingGuests] = useState([]);
  const [showGuestSearch, setShowGuestSearch] = useState(false);
  const [searchGuestTerm, setSearchGuestTerm] = useState("");
  const [selectedGuest, setSelectedGuest] = useState(null);

  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    room: "",
    checkIn: "",
    checkOut: "",
    guestsCount: 1,
    status: "PENDING",
    billingStatus: "PENDING",
    specialRequests: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState({});

  const isStaffOrAdmin =
    user?.role === ROLES.ADMIN ||
    user?.role === ROLES.MANAGER ||
    user?.role === ROLES.RECEPTIONIST;

  useEffect(() => {
    if (!user || !isStaffOrAdmin) {
      navigate("/login");
      return;
    }

    fetchBooking();
    fetchRooms();
    fetchExistingGuests();
  }, [id, user]);

  const fetchBooking = async () => {
    try {
      setFetching(true);

      const response = await bookingApi.getById(id);
      const data = response?.data || response;

      setBooking(data);

      const guest = data?.guest || data?.user || {};

      const guestName =
        data?.guestName ||
        guest?.name ||
        guest?.fullName ||
        `${guest?.firstName || ""} ${guest?.lastName || ""}`.trim();

      const guestEmail = data?.guestEmail || guest?.email || "";

      const guestPhone =
        data?.guestPhone ||
        guest?.phone ||
        guest?.phoneNumber ||
        "";

      const roomId =
        data?.room?._id ||
        data?.room?.id ||
        data?.roomId ||
        data?.room ||
        "";

      const checkIn = data?.checkIn
        ? new Date(data.checkIn).toISOString().split("T")[0]
        : "";

      const checkOut = data?.checkOut
        ? new Date(data.checkOut).toISOString().split("T")[0]
        : "";

      setFormData({
        guestName,
        guestEmail,
        guestPhone,
        room: roomId,
        checkIn,
        checkOut,
        guestsCount: data?.guestsCount || data?.numberOfGuests || 1,
        status: data?.status || "PENDING",
        billingStatus: data?.billingStatus || "PENDING",
        specialRequests: data?.specialRequests || "",
      });

      if (guest && (guest._id || guest.id || guest.email)) {
        setSelectedGuest(guest);
      }
    } catch (error) {
      console.error("Error fetching booking:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load booking details"
      );
    } finally {
      setFetching(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await getAllRooms();

      const roomData = Array.isArray(response)
        ? response
        : response?.data || response?.rooms || [];

      setRooms(roomData);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to load rooms");
    }
  };

  const fetchExistingGuests = async () => {
    try {
      const response = await authApi.getMyProfile();
      const profile = response?.data || response;

      if (profile && user?.role === ROLES.GUEST) {
        setExistingGuests([profile]);
      }
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleGuestSelect = (guest) => {
    setSelectedGuest(guest);

    const guestName =
      guest?.name ||
      guest?.fullName ||
      `${guest?.firstName || ""} ${guest?.lastName || ""}`.trim();

    setFormData((prev) => ({
      ...prev,
      guestName,
      guestEmail: guest?.email || "",
      guestPhone: guest?.phone || guest?.phoneNumber || "",
    }));

    setShowGuestSearch(false);
    setSearchGuestTerm("");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.guestName.trim()) {
      newErrors.guestName = "Guest name is required";
    }

    if (!formData.guestEmail.trim()) {
      newErrors.guestEmail = "Guest email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.guestEmail)) {
      newErrors.guestEmail = "Please enter a valid email";
    }

    if (!formData.room) {
      newErrors.room = "Please select a room";
    }

    if (!formData.checkIn) {
      newErrors.checkIn = "Check-in date is required";
    }

    if (!formData.checkOut) {
      newErrors.checkOut = "Check-out date is required";
    }

    if (
      formData.checkIn &&
      formData.checkOut &&
      new Date(formData.checkOut) <= new Date(formData.checkIn)
    ) {
      newErrors.checkOut = "Check-out must be after check-in";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;

    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);

    const difference =
      checkOut.getTime() - checkIn.getTime();

    return Math.max(
      0,
      Math.ceil(difference / (1000 * 60 * 60 * 24))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      guestName: true,
      guestEmail: true,
      guestPhone: true,
      room: true,
      checkIn: true,
      checkOut: true,
      guestsCount: true,
      specialRequests: true,
    });

    if (!validate()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      setLoading(true);

      const selectedRoom = rooms.find(
        (room) =>
          room?._id === formData.room ||
          room?.id === formData.room
      );

      const nights = calculateNights();

      const roomPrice =
        selectedRoom?.price ||
        selectedRoom?.pricePerNight ||
        selectedRoom?.rate ||
        0;

      const totalAmount = roomPrice * nights;

      const bookingData = {
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guestsCount: Number(formData.guestsCount),
        specialRequests: formData.specialRequests,
      };

      await bookingApi.update(id, bookingData);

      setSuccess(true);

      toast.success("Booking updated successfully");

      setTimeout(() => {
        navigate("/admin/bookings");
      }, 1000);
    } catch (error) {
      console.error("Error updating booking:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to update booking"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      await bookingApi.cancel(id);

      toast.success("Booking cancelled successfully");

      navigate("/admin/bookings");
    } catch (error) {
      console.error("Error cancelling booking:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to cancel booking"
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedRoom = rooms.find(
    (room) =>
      room?._id === formData.room ||
      room?.id === formData.room
  );

  const nights = calculateNights();

  const roomPrice =
    selectedRoom?.price ||
    selectedRoom?.pricePerNight ||
    selectedRoom?.rate ||
    0;

  const totalAmount = roomPrice * nights;

  const filteredGuests = existingGuests.filter((guest) => {
    const term = searchGuestTerm.toLowerCase();

    const name =
      guest?.name ||
      guest?.fullName ||
      `${guest?.firstName || ""} ${guest?.lastName || ""}`.trim();

    const email = guest?.email || "";

    return (
      name.toLowerCase().includes(term) ||
      email.toLowerCase().includes(term)
    );
  });

  if (!user || !isStaffOrAdmin) {
    return null;
  }

  if (fetching) {
    return (
      <div
        className="flex h-screen overflow-hidden"
        style={{
          backgroundColor: COLORS.BACKGROUND,
        }}
      >
        <AsideBar />

        <main className="flex-1 min-w-0 flex items-center justify-center overflow-hidden">
          <div className="text-center">
            <div
              className="w-9 h-9 border-4 rounded-full animate-spin mx-auto mb-3"
              style={{
                borderColor: COLORS.BORDER,
                borderTopColor: COLORS.ACCENT,
              }}
            />

            <p
              className="text-sm"
              style={{
                color: COLORS.TEXT_SECONDARY,
                fontFamily: FONTS.BODY,
              }}
            >
              Loading booking...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        backgroundColor: COLORS.BACKGROUND,
        fontFamily: FONTS.BODY,
      }}
    >
      <AsideBar />

      <main
        className="flex-1 min-w-0 overflow-hidden"
        style={{
          height: "100vh",
          padding: "12px 16px",
        }}
      >
        {/* HEADER */}
        <div
          className="mb-3 rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${COLORS.PRIMARY} 0%, #332822 100%)`,
            color: "white",
            padding: "12px 16px",
            boxShadow:
              SHADOWS?.SMALL ||
              "0 4px 15px rgba(0,0,0,0.08)",
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="p-2 rounded-lg flex-shrink-0"
                style={{
                  backgroundColor:
                    "rgba(200,169,106,0.18)",
                  color: COLORS.ACCENT,
                }}
              >
                <Edit size={20} />
              </div>

              <div className="min-w-0">
                <h1
                  className="text-lg md:text-xl font-bold truncate"
                  style={{
                    fontFamily: FONTS.HEADING,
                  }}
                >
                  Edit Booking
                </h1>

                <p className="text-[11px] opacity-75">
                  Update reservation details
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/admin/bookings")}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all hover:opacity-90 flex-shrink-0"
              style={{
                backgroundColor:
                  "rgba(255,255,255,0.1)",
                color: "white",
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Bookings</span>
            </button>
          </div>
        </div>

        {/* SUCCESS MESSAGE */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 rounded-lg border p-2.5"
            style={{
              backgroundColor: "#F0FDF4",
              borderColor: "#BBF7D0",
            }}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle
                size={18}
                style={{
                  color: "#16A34A",
                }}
              />

              <div>
                <p
                  className="text-xs font-semibold"
                  style={{
                    color: "#166534",
                  }}
                >
                  Booking updated successfully
                </p>

                <p
                  className="text-[10px]"
                  style={{
                    color: "#15803D",
                  }}
                >
                  Redirecting to bookings...
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* MAIN FORM CARD */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border"
          style={{
            backgroundColor: COLORS.SURFACE,
            borderColor: COLORS.BORDER,
            boxShadow:
              SHADOWS?.SMALL ||
              "0 4px 15px rgba(0,0,0,0.06)",
            padding: "14px 16px",
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* FORM GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2.5">
              {/* GUEST NAME */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    className="text-[11px] font-semibold"
                    style={{
                      color: COLORS.TEXT_PRIMARY,
                    }}
                  >
                    Guest Name
                  </label>

                  {isStaffOrAdmin &&
                    existingGuests.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setShowGuestSearch(
                            (prev) => !prev
                          )
                        }
                        className="text-[10px] flex items-center gap-1"
                        style={{
                          color: COLORS.ACCENT,
                        }}
                      >
                        <Search size={11} />
                        Search Guest
                      </button>
                    )}
                </div>

                <input
                  type="text"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter guest name"
                  className="w-full outline-none transition-all"
                  style={{
                    padding: "7px 9px",
                    border: `1px solid ${
                      touched.guestName &&
                      errors.guestName
                        ? "#DC2626"
                        : COLORS.BORDER
                    }`,
                    borderRadius: BORDER_RADIUS.SM,
                    fontSize: "12px",
                    color: COLORS.TEXT_PRIMARY,
                    backgroundColor: COLORS.SURFACE,
                  }}
                />

                {touched.guestName &&
                  errors.guestName && (
                    <p className="mt-0.5 text-[10px] text-red-600">
                      {errors.guestName}
                    </p>
                  )}

                {/* GUEST SEARCH */}
                {showGuestSearch && (
                  <div
                    className="mt-1.5 rounded-lg border p-1.5"
                    style={{
                      borderColor: COLORS.BORDER,
                      backgroundColor: COLORS.CREAM,
                    }}
                  >
                    <input
                      type="text"
                      value={searchGuestTerm}
                      onChange={(e) =>
                        setSearchGuestTerm(e.target.value)
                      }
                      placeholder="Search by name or email..."
                      className="w-full outline-none rounded-md border px-2 py-1.5 text-[10px]"
                      style={{
                        borderColor: COLORS.BORDER,
                        backgroundColor: COLORS.SURFACE,
                      }}
                    />

                    {searchGuestTerm && (
                      <div className="mt-1 max-h-24 overflow-y-auto">
                        {filteredGuests.length > 0 ? (
                          filteredGuests.map((guest) => {
                            const name =
                              guest?.name ||
                              guest?.fullName ||
                              `${guest?.firstName || ""} ${
                                guest?.lastName || ""
                              }`.trim();

                            return (
                              <button
                                key={
                                  guest?._id ||
                                  guest?.id
                                }
                                type="button"
                                onClick={() =>
                                  handleGuestSelect(
                                    guest
                                  )
                                }
                                className="w-full text-left px-2 py-1.5 rounded-md hover:bg-white transition"
                              >
                                <p
                                  className="text-[10px] font-medium"
                                  style={{
                                    color:
                                      COLORS.TEXT_PRIMARY,
                                  }}
                                >
                                  {name}
                                </p>

                                <p
                                  className="text-[9px]"
                                  style={{
                                    color:
                                      COLORS.TEXT_SECONDARY,
                                  }}
                                >
                                  {guest?.email}
                                </p>
                              </button>
                            );
                          })
                        ) : (
                          <p
                            className="text-[10px] p-1.5"
                            style={{
                              color:
                                COLORS.TEXT_SECONDARY,
                            }}
                          >
                            No guests found.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label
                  className="block mb-1 text-[11px] font-semibold"
                  style={{
                    color: COLORS.TEXT_PRIMARY,
                  }}
                >
                  Email
                </label>

                <input
                  type="email"
                  name="guestEmail"
                  value={formData.guestEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="guest@example.com"
                  className="w-full outline-none"
                  style={{
                    padding: "7px 9px",
                    border: `1px solid ${
                      touched.guestEmail &&
                      errors.guestEmail
                        ? "#DC2626"
                        : COLORS.BORDER
                    }`,
                    borderRadius: BORDER_RADIUS.SM,
                    fontSize: "12px",
                    color: COLORS.TEXT_PRIMARY,
                    backgroundColor: COLORS.SURFACE,
                  }}
                />

                {touched.guestEmail &&
                  errors.guestEmail && (
                    <p className="mt-0.5 text-[10px] text-red-600">
                      {errors.guestEmail}
                    </p>
                  )}
              </div>

              {/* PHONE */}
              <div>
                <label
                  className="block mb-1 text-[11px] font-semibold"
                  style={{
                    color: COLORS.TEXT_PRIMARY,
                  }}
                >
                  Phone
                </label>

                <input
                  type="tel"
                  name="guestPhone"
                  value={formData.guestPhone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="+92 300 1234567"
                  className="w-full outline-none"
                  style={{
                    padding: "7px 9px",
                    border: `1px solid ${COLORS.BORDER}`,
                    borderRadius: BORDER_RADIUS.SM,
                    fontSize: "12px",
                    color: COLORS.TEXT_PRIMARY,
                    backgroundColor: COLORS.SURFACE,
                  }}
                />
              </div>

              {/* ROOM */}
              <div>
                <label
                  className="block mb-1 text-[11px] font-semibold"
                  style={{
                    color: COLORS.TEXT_PRIMARY,
                  }}
                >
                  Room
                </label>

                <select
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full outline-none"
                  style={{
                    padding: "7px 9px",
                    border: `1px solid ${
                      touched.room && errors.room
                        ? "#DC2626"
                        : COLORS.BORDER
                    }`,
                    borderRadius: BORDER_RADIUS.SM,
                    fontSize: "12px",
                    color: COLORS.TEXT_PRIMARY,
                    backgroundColor: COLORS.SURFACE,
                  }}
                >
                  <option value="">Select a room</option>

                  {rooms.map((room) => {
                    const roomId =
                      room?._id || room?.id;

                    return (
                      <option
                        key={roomId}
                        value={roomId}
                      >
                        {room?.roomNumber
                          ? `Room ${room.roomNumber}`
                          : room?.name || "Room"}{" "}
                        {room?.type
                          ? `- ${room.type}`
                          : ""}{" "}
                        {room?.price
                          ? `- $${room.price}/night`
                          : ""}
                      </option>
                    );
                  })}
                </select>

                {touched.room && errors.room && (
                  <p className="mt-0.5 text-[10px] text-red-600">
                    {errors.room}
                  </p>
                )}
              </div>

              {/* CHECK IN */}
              <div>
                <label
                  className="block mb-1 text-[11px] font-semibold"
                  style={{
                    color: COLORS.TEXT_PRIMARY,
                  }}
                >
                  Check-in
                </label>

                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full outline-none"
                  style={{
                    padding: "7px 9px",
                    border: `1px solid ${
                      touched.checkIn &&
                      errors.checkIn
                        ? "#DC2626"
                        : COLORS.BORDER
                    }`,
                    borderRadius: BORDER_RADIUS.SM,
                    fontSize: "12px",
                    color: COLORS.TEXT_PRIMARY,
                    backgroundColor: COLORS.SURFACE,
                  }}
                />

                {touched.checkIn &&
                  errors.checkIn && (
                    <p className="mt-0.5 text-[10px] text-red-600">
                      {errors.checkIn}
                    </p>
                  )}
              </div>

              {/* CHECK OUT */}
              <div>
                <label
                  className="block mb-1 text-[11px] font-semibold"
                  style={{
                    color: COLORS.TEXT_PRIMARY,
                  }}
                >
                  Check-out
                </label>

                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full outline-none"
                  style={{
                    padding: "7px 9px",
                    border: `1px solid ${
                      touched.checkOut &&
                      errors.checkOut
                        ? "#DC2626"
                        : COLORS.BORDER
                    }`,
                    borderRadius: BORDER_RADIUS.SM,
                    fontSize: "12px",
                    color: COLORS.TEXT_PRIMARY,
                    backgroundColor: COLORS.SURFACE,
                  }}
                />

                {touched.checkOut &&
                  errors.checkOut && (
                    <p className="mt-0.5 text-[10px] text-red-600">
                      {errors.checkOut}
                    </p>
                  )}
              </div>

              {/* GUEST COUNT */}
              <div>
                <label
                  className="block mb-1 text-[11px] font-semibold"
                  style={{
                    color: COLORS.TEXT_PRIMARY,
                  }}
                >
                  Number of Guests
                </label>

                <input
                  type="number"
                  name="guestsCount"
                  min="1"
                  value={formData.guestsCount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full outline-none"
                  style={{
                    padding: "7px 9px",
                    border: `1px solid ${COLORS.BORDER}`,
                    borderRadius: BORDER_RADIUS.SM,
                    fontSize: "12px",
                    color: COLORS.TEXT_PRIMARY,
                    backgroundColor: COLORS.SURFACE,
                  }}
                />
              </div>

              {/* STATUS */}
              <div>
                <label
                  className="block mb-1 text-[11px] font-semibold"
                  style={{
                    color: COLORS.TEXT_PRIMARY,
                  }}
                >
                  Booking Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full outline-none"
                  style={{
                    padding: "7px 9px",
                    border: `1px solid ${COLORS.BORDER}`,
                    borderRadius: BORDER_RADIUS.SM,
                    fontSize: "12px",
                    color: COLORS.TEXT_PRIMARY,
                    backgroundColor: COLORS.SURFACE,
                  }}
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">
                    Confirmed
                  </option>
                  <option value="CHECKED_IN">
                    Checked In
                  </option>
                  <option value="CHECKED_OUT">
                    Checked Out
                  </option>
                  <option value="CANCELLED">
                    Cancelled
                  </option>
                </select>
              </div>

              {/* BILLING STATUS */}
              <div>
                <label
                  className="block mb-1 text-[11px] font-semibold"
                  style={{
                    color: COLORS.TEXT_PRIMARY,
                  }}
                >
                  Billing Status
                </label>

                <select
                  name="billingStatus"
                  value={formData.billingStatus}
                  onChange={handleChange}
                  className="w-full outline-none"
                  style={{
                    padding: "7px 9px",
                    border: `1px solid ${COLORS.BORDER}`,
                    borderRadius: BORDER_RADIUS.SM,
                    fontSize: "12px",
                    color: COLORS.TEXT_PRIMARY,
                    backgroundColor: COLORS.SURFACE,
                  }}
                >
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="PARTIAL">Partial</option>
                  <option value="REFUNDED">
                    Refunded
                  </option>
                </select>
              </div>

              {/* SPECIAL REQUESTS */}
              <div className="lg:col-span-2">
                <label
                  className="block mb-1 text-[11px] font-semibold"
                  style={{
                    color: COLORS.TEXT_PRIMARY,
                  }}
                >
                  Special Requests
                </label>

                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows="2"
                  placeholder="Any special requests from the guest..."
                  className="w-full outline-none resize-none"
                  style={{
                    padding: "7px 9px",
                    border: `1px solid ${COLORS.BORDER}`,
                    borderRadius: BORDER_RADIUS.SM,
                    fontSize: "12px",
                    color: COLORS.TEXT_PRIMARY,
                    backgroundColor: COLORS.SURFACE,
                  }}
                />
              </div>
            </div>

            {/* SUMMARY */}
            <div
              className="mt-3 pt-3 border-t"
              style={{
                borderColor: COLORS.BORDER,
              }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div
                  className="rounded-lg px-2.5 py-2"
                  style={{
                    backgroundColor: COLORS.CREAM,
                  }}
                >
                  <p
                    className="text-[9px] uppercase tracking-wide font-semibold"
                    style={{
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  >
                    Room
                  </p>

                  <p
                    className="text-xs font-semibold mt-0.5 truncate"
                    style={{
                      color: COLORS.TEXT_PRIMARY,
                    }}
                  >
                    {selectedRoom?.roomNumber
                      ? `Room ${selectedRoom.roomNumber}`
                      : selectedRoom?.name ||
                        "Not selected"}
                  </p>
                </div>

                <div
                  className="rounded-lg px-2.5 py-2"
                  style={{
                    backgroundColor: COLORS.CREAM,
                  }}
                >
                  <p
                    className="text-[9px] uppercase tracking-wide font-semibold"
                    style={{
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  >
                    Nights
                  </p>

                  <p
                    className="text-xs font-semibold mt-0.5"
                    style={{
                      color: COLORS.TEXT_PRIMARY,
                    }}
                  >
                    {nights}
                  </p>
                </div>

                <div
                  className="rounded-lg px-2.5 py-2"
                  style={{
                    backgroundColor: COLORS.CREAM,
                  }}
                >
                  <p
                    className="text-[9px] uppercase tracking-wide font-semibold"
                    style={{
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  >
                    Rate / Night
                  </p>

                  <p
                    className="text-xs font-semibold mt-0.5"
                    style={{
                      color: COLORS.TEXT_PRIMARY,
                    }}
                  >
                    ${Number(roomPrice).toLocaleString()}
                  </p>
                </div>

                <div
                  className="rounded-lg px-2.5 py-2"
                  style={{
                    backgroundColor: COLORS.PRIMARY,
                    color: "white",
                  }}
                >
                  <p className="text-[9px] uppercase tracking-wide font-semibold opacity-70">
                    Total
                  </p>

                  <p className="text-xs font-bold mt-0.5">
                    ${Number(totalAmount).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-3 pt-3 border-t">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-90 disabled:opacity-50"
                  style={{
                    backgroundColor: "#FEF2F2",
                    color: "#DC2626",
                    border: "1px solid #FECACA",
                  }}
                >
                  <Trash2 size={14} />
                  Cancel Booking
                </button>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/admin/bookings")
                    }
                    disabled={loading}
                    className="px-3.5 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-90 disabled:opacity-50"
                    style={{
                      backgroundColor: COLORS.CREAM,
                      color: COLORS.TEXT_PRIMARY,
                      border: `1px solid ${COLORS.BORDER}`,
                    }}
                  >
                    Discard Changes
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                    style={{
                      backgroundColor: COLORS.ACCENT,
                      color: COLORS.PRIMARY,
                    }}
                  >
                    {loading ? (
                      <>
                        <div
                          className="w-3.5 h-3.5 border-2 rounded-full animate-spin"
                          style={{
                            borderColor:
                              "rgba(31,26,23,0.25)",
                            borderTopColor:
                              COLORS.PRIMARY,
                          }}
                        />

                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Update Booking
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default EditBookingPage;