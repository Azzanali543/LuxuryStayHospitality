import { useState, useEffect } from "react";
import {
  BellRing,
  ConciergeBell,
  Flag,
  FileText,
  Wrench,
  CheckCircle,
  Key,
  Home
} from "lucide-react";
import ProfileSection from "./ProfileSection";
import bookingApi from "../../api/bookingApi";
import maintenanceApi from "../../api/mainteanceApi";
import {
  COLORS,
  SHADOWS,
  FONTS
} from "../../constants/theme";

function ServiceRequestPage() {

  const [allBookings, setAllBookings] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [bookingId, setBookingId] = useState("");
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [checkingIn, setCheckingIn] = useState(false);

  const [service, setService] = useState("Air Conditioner");
  const [priority, setPriority] = useState("Normal");
  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    setFetchError("");
    
    try {
      console.log("=== FETCHING BOOKINGS ===");
      
      let bookings = [];
      
      try {
        console.log("Trying bookingApi.getAll()...");
        const response = await bookingApi.getAll();
        console.log("getAll response:", response);
        
        if (response?.data?.bookings) {
          bookings = response.data.bookings;
        } else if (response?.data) {
          bookings = Array.isArray(response.data) ? response.data : [response.data];
        }
      } catch (err) {
        console.log("getAll failed:", err.message);
      }
      
      if (bookings.length === 0) {
        try {
          console.log("Trying bookingApi.getMyActiveBookings()...");
          const response = await bookingApi.getMyActiveBookings();
          console.log("getMyActiveBookings response:", response);
          
          if (response?.data?.bookings) {
            bookings = response.data.bookings;
          } else if (response?.data) {
            bookings = Array.isArray(response.data) ? response.data : [response.data];
          }
        } catch (err) {
          console.log("getMyActiveBookings failed:", err.message);
        }
      }
      
      console.log("All bookings found:", bookings);
      console.log("Number of bookings:", bookings.length);
      
      setAllBookings(bookings);
      
      if (bookings.length > 0) {
        bookings.forEach((booking, index) => {
          console.log(`Booking ${index + 1}:`, {
            id: booking._id || booking.id,
            status: booking.status,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            roomNumber: booking.room?.roomNumber || booking.roomNumber
          });
        });
        
        const checkedInBookings = bookings.filter(b => 
          b.status === 'checked-in' || 
          b.status === 'checked_in' || 
          b.status === 'Checked-in' ||
          b.status === 'CheckedIn'
        );
        
        if (checkedInBookings.length > 0) {
          console.log("Found checked-in bookings:", checkedInBookings);
          setActiveBookings(checkedInBookings);
          if (checkedInBookings.length === 1) {
            setBookingId(checkedInBookings[0]._id || checkedInBookings[0].id);
          }
        } else {
          console.log("No checked-in bookings found");
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const upcomingOrCurrent = bookings.filter(b => {
            if (b.status === 'cancelled' || b.status === 'canceled') return false;
            
            const checkOut = new Date(b.checkOut);
            checkOut.setHours(0, 0, 0, 0);
            return today <= checkOut;
          });
          
          setActiveBookings(upcomingOrCurrent);
          if (upcomingOrCurrent.length === 1) {
            setBookingId(upcomingOrCurrent[0]._id || upcomingOrCurrent[0].id);
          }
          
          if (upcomingOrCurrent.length === 0) {
            setFetchError("No bookings found. Please make a reservation first.");
          } else {
            setFetchError("Please check-in to your room before requesting maintenance.");
          }
        }
      } else {
        setFetchError("No bookings found. Please make a reservation first.");
        setActiveBookings([]);
      }
      
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setFetchError("Could not load your bookings. Please try again.");
      setActiveBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleCheckIn = async (bookingIdToCheckIn) => {
    setCheckingIn(true);
    setSubmitError("");
    
    try {
      console.log("=== CHECKING IN ===");
      console.log("Booking ID:", bookingIdToCheckIn);
      
      const response = await bookingApi.updateStatus(bookingIdToCheckIn, 'checked-in');
      console.log("Check-in response:", response);
      
      await fetchBookings();
      
      setSubmitError("");
      alert("✅ Successfully checked in! You can now request maintenance.");
      
    } catch (err) {
      console.error("Error checking in:", err);
      console.error("Error response:", err.response?.data);
      
      let errorMessage = "Could not check in. Please try again.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setSubmitError(errorMessage);
    } finally {
      setCheckingIn(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!bookingId) {
      setSubmitError("Please select which room this request is for.");
      return;
    }

    if (!description.trim()) {
      setSubmitError("Please describe the issue.");
      return;
    }

    setSubmitting(true);
    
    try {
      const requestData = {
        bookingId: bookingId,
        issueType: service,
        description: description.trim(),
        priority: priority,
      };
      
      console.log("=== SUBMITTING MAINTENANCE REQUEST ===");
      console.log("Request Data:", JSON.stringify(requestData, null, 2));
      
      const response = await maintenanceApi.create(requestData);
      console.log("Success Response:", response);
      
      setSubmitted(true);
      setService("Air Conditioner");
      setPriority("Normal");
      setDescription("");
      
      setTimeout(() => setSubmitted(false), 4000);
      
    } catch (err) {
      console.error("=== ERROR SUBMITTING REQUEST ===");
      console.error("Error:", err);
      
      if (err.response) {
        console.error("Error response status:", err.response.status);
        console.error("Error response data:", err.response.data);
        
        let errorMessage = "Couldn't submit your request. Please try again.";
        
        if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }
        
        setSubmitError(errorMessage);
      } else if (err.message) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Couldn't submit your request. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getRoomDisplay = (booking) => {
    if (!booking) return 'Unknown Room';
    
    const room = booking.room || {};
    const roomNumber = room.roomNumber || booking.roomNumber || 'N/A';
    const roomType = room.type || booking.roomType || booking.type || 'Room';
    const status = booking.status || 'Unknown';
    
    return `Room ${roomNumber} — ${roomType} (${status})`;
  };

  const isCheckedIn = (booking) => {
    if (!booking) return false;
    const status = booking.status || '';
    return status === 'checked-in' || status === 'checked_in' || status === 'Checked-in' || status === 'CheckedIn';
  };

  const getSelectedBooking = () => {
    return activeBookings.find(b => (b._id || b.id) === bookingId);
  };

  const selectedBooking = getSelectedBooking();
  const isBookingCheckedIn = isCheckedIn(selectedBooking);

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_320px]">
      <ProfileSection
        title="Maintenance Request"
        icon={Wrench}
      >
        <p className="mb-6 text-sm text-gray-500">
          Report any issue in your room and our maintenance team will be notified.
        </p>

        {!loadingBookings && activeBookings.length > 0 && !activeBookings.some(b => isCheckedIn(b)) && (
          <div className="mb-4 p-3 rounded-lg" style={{ background: '#fef3c7', border: '1px solid #f59e0b' }}>
            <p className="text-sm" style={{ color: '#92400e' }}>
              Please check-in to your room before requesting maintenance.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-5">
          {/* Room */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <ConciergeBell size={16} />
              Room
            </label>

            {loadingBookings ? (
              <p className="text-sm text-gray-500">Loading your rooms...</p>
            ) : activeBookings.length === 0 ? (
              <div>
                <p className="text-sm" style={{ color: COLORS.ERROR }}>
                  {fetchError || "No bookings found. Please make a reservation first."}
                </p>
                <button
                  type="button"
                  onClick={fetchBookings}
                  className="mt-2 text-sm underline"
                  style={{ color: COLORS.ACCENT }}
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <select
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="w-full rounded-xl border p-3"
                  style={{
                    borderColor: COLORS.BORDER,
                    background: COLORS.SURFACE,
                  }}
                  required
                >
                  <option value="" disabled>Select a room</option>
                  {activeBookings.map((b) => (
                    <option key={b._id || b.id} value={b._id || b.id}>
                      {getRoomDisplay(b)}
                    </option>
                  ))}
                </select>
                
                {bookingId && selectedBooking && !isBookingCheckedIn && (
                  <button
                    type="button"
                    onClick={() => handleCheckIn(bookingId)}
                    disabled={checkingIn}
                    className="w-full py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: COLORS.ACCENT,
                      color: COLORS.CREAM,
                      opacity: checkingIn ? 0.6 : 1,
                    }}
                  >
                    {checkingIn ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                        Checking in...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Key size={16} />
                        Check-in to this room
                      </span>
                    )}
                  </button>
                )}
                
                {bookingId && selectedBooking && isBookingCheckedIn && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.SUCCESS }}>
                    <CheckCircle size={16} />
                    <span>Checked in</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Service */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <ConciergeBell size={16} />
              Issue Type
            </label>

            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full rounded-xl border p-3"
              style={{
                borderColor: COLORS.BORDER,
                background: COLORS.SURFACE,
              }}
              required
              disabled={activeBookings.length === 0}
            >
              <option value="Air Conditioner">Air Conditioner</option>
              <option value="Electricity">Electricity</option>
              <option value="Water Leakage">Water Leakage</option>
              <option value="TV">TV</option>
              <option value="Door Lock">Door Lock</option>
              <option value="Furniture">Furniture</option>
              <option value="Bathroom">Bathroom</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Flag size={16} />
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-xl border p-3"
              style={{
                borderColor: COLORS.BORDER,
                background: COLORS.SURFACE,
              }}
              required
              disabled={activeBookings.length === 0}
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <FileText size={16} />
              Description
            </label>

            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border p-3"
              style={{
                borderColor: COLORS.BORDER,
                background: COLORS.SURFACE,
              }}
              placeholder="Describe the maintenance issue in detail..."
              required
              disabled={activeBookings.length === 0}
            />
          </div>

          {submitError && (
            <p className="text-sm" style={{ color: COLORS.ERROR }}>
              {submitError}
            </p>
          )}
          
          {submitted && (
            <p className="text-sm" style={{ color: COLORS.SUCCESS }}>
              Request submitted — our team has been notified.
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || activeBookings.length === 0 || !isBookingCheckedIn}
            className="w-full py-4 rounded-xl text-lg font-bold transition-transform hover:-translate-y-0.5"
            style={{
              background: COLORS.PRIMARY,
              color: COLORS.CREAM,
              boxShadow: SHADOWS.CARD,
              fontFamily: FONTS.BODY,
              opacity: (submitting || activeBookings.length === 0 || !isBookingCheckedIn) ? 0.6 : 1,
              cursor: (submitting || activeBookings.length === 0 || !isBookingCheckedIn) ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                Submitting...
              </span>
            ) : !isBookingCheckedIn ? (
              <span className="flex items-center justify-center gap-2">
                <Key size={18} />
                Check-in first to request maintenance
              </span>
            ) : (
              "Submit Service Request"
            )}
          </button>
        </form>
      </ProfileSection>

      <section
        className="rounded-[18px] border p-6"
        style={{
          background: COLORS.PRIMARY,
          borderColor: COLORS.PRIMARY,
          boxShadow: SHADOWS.CARD,
        }}
      >
        <Wrench size={30} color={COLORS.ACCENT} />

        <h2 className="mt-4 text-xl font-bold text-white">
          Maintenance Support
        </h2>

        <p className="mt-3 text-sm text-white/60 leading-6">
          Our maintenance staff is available 24/7 to resolve issues in your room.
        </p>

        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-white font-semibold">Average Response</p>
            <p className="text-white/70 text-sm">15 - 30 minutes</p>
          </div>

          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-white font-semibold">Emergency</p>
            <p className="text-white/70 text-sm">
              Critical issues receive immediate attention.
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-white font-semibold">Available</p>
            <p className="text-green-300 font-medium">
              24 Hours • 7 Days
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServiceRequestPage;