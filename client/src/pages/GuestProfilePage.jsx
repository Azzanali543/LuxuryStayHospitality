import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Globe2,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  Home,
  Sparkles,
  Save,
  MapPin,
  Clock3,
  CalendarDays,
  CreditCard,
  Hash,
  Award,
  BedDouble,
  Gift,
  Coffee,
  ConciergeBell,
  Sparkle,
  Flower2,
  Camera,
  CheckCircle2,
  BriefcaseBusiness,
  UserRound,
  LockKeyhole,
  ArrowRight,
  Upload,
  X,
  Wrench,
  ArrowLeft,
} from "lucide-react";

import useAuth from "../hooks/useAuth";

import {
  getMyProfile,
  updateMyProfile,
  uploadProfileImage,
  changePassword,
} from "../api/userApi";
import bookingApi from "../api/bookingApi";
import notificationApi from "../api/notificationApi";

import {
  COLORS,
  FONTS,
  BORDER_RADIUS,
  SHADOWS,
} from "../constants/theme";

import GuestServices from "./GuestServices";
import ServiceRequestPage from "./componnts/ServicesRequestPage";
import ProfileHeader from "./componnts/ProfileHeader";
import TabButton from "./componnts/TabButton";
import BookingCard from "./componnts/BookingCard";
import CurrentBookingCard from "./componnts/CurrentBookingCard";
import InfoCard from "./componnts/InfoCard";
import StatisticCard from "./componnts/StatisticCard";
import ActivityItem from "./componnts/ActivityItem";
import ServiceCard from "./componnts/ServiceCard";
import ToggleSwitch from "./componnts/ToggleSwitch";
import ProfileSection from "./componnts/ProfileSection";

function GuestProfilePage() {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(authUser || {});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userBookings, setUserBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  const [tab, setTab] = useState(
    authUser?.role === "guest" ? "stay" : "profile"
  );

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const fileInputRef = useRef(null);

  const isGuest = profile?.role === "guest";

  useEffect(() => {
    loadProfile();
    if (isGuest) {
      loadUserBookings();
      loadNotifications();
    }
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getMyProfile();
      setProfile(data.user);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadUserBookings = async () => {
    try {
      setBookingLoading(true);
      // Get all bookings for the user
      const response = await bookingApi.getAll();
      const bookingsData = response?.data?.bookings || response?.bookings || [];
      
      // Filter bookings for the current user
      const userBookingsData = bookingsData.filter(
        (booking) => booking.guest?._id === profile._id || booking.guest === profile._id
      );
      
      setUserBookings(userBookingsData);
    } catch (error) {
      console.error("Error loading bookings:", error);
      setUserBookings([]);
    } finally {
      setBookingLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      setNotificationLoading(true);
      const response = await notificationApi.getMine();
      const notificationsData = response?.data?.notifications || response?.notifications || [];
      // Get only the 3 most recent notifications
      setNotifications(notificationsData.slice(0, 3));
    } catch (error) {
      console.error("Error loading notifications:", error);
      setNotifications([]);
    } finally {
      setNotificationLoading(false);
    }
  };

  const initials = useMemo(() => {
    return (
      profile?.name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U"
    );
  }, [profile?.name]);

  const roleLabel = {
    admin: "Administrator",
    manager: "Manager",
    receptionist: "Receptionist",
    housekeeping: "Housekeeping",
    guest: "Guest",
  };

  const handleProfileChange = (field, value) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleProfileSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const data = await updateMyProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        country: profile.country,
        preferredRoomType: profile.preferredRoomType,
        preferredLanguage: profile.preferredLanguage,
        emailNotifications: profile.emailNotifications,
        smsNotifications: profile.smsNotifications,
        marketingEmails: profile.marketingEmails,
      });

      setProfile(data.user);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const data = await uploadProfileImage(file);

      setProfile((previous) => ({
        ...previous,
        profileImage: data.profileImage,
      }));

      const savedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...savedUser,
          profileImage: data.profileImage,
        })
      );

      setSuccess("Profile photo updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to upload profile photo"
      );
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setError("");
      setSuccess("");

      if (
        !password.currentPassword ||
        !password.newPassword ||
        !password.confirmPassword
      ) {
        setError("Please fill all password fields.");
        return;
      }

      if (
        password.newPassword !==
        password.confirmPassword
      ) {
        setError("New passwords do not match.");
        return;
      }

      await changePassword(password);

      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccess("Password changed successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to change password"
      );
    }
  };

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div
            className="animate-pulse text-sm"
            style={{
              color: COLORS.TEXT_SECONDARY,
            }}
          >
            Loading your profile...
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm transition-all duration-300 hover:gap-3"
            style={{
              color: COLORS.TEXT_SECONDARY,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = COLORS.ACCENT;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = COLORS.TEXT_SECONDARY;
            }}
          >
            <ArrowLeft size={18} style={{ color: COLORS.ACCENT }} />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        <ProfileHero
          profile={profile}
          initials={initials}
          roleLabel={roleLabel[profile.role]}
          uploading={uploading}
          onUpload={() =>
            fileInputRef.current?.click()
          }
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        {(error || success) && (
          <div
            className="mt-5 rounded-xl border px-4 py-3 text-sm"
            style={{
              background: error
                ? "rgba(197,48,48,0.08)"
                : "rgba(47,107,79,0.08)",
              borderColor: error
                ? "rgba(197,48,48,0.2)"
                : "rgba(47,107,79,0.2)",
              color: error
                ? COLORS.ERROR
                : COLORS.SUCCESS,
            }}
          >
            {error || success}
          </div>
        )}

        <div
          className="mt-6 flex gap-1 overflow-x-auto rounded-2xl border p-1"
          style={{
            background: COLORS.PRIMARY,
            borderColor: COLORS.PRIMARY,
          }}
        >
          {isGuest && (
            <TabButton
              label="My Stay"
              icon={Home}
              active={tab === "stay"}
              onClick={() => setTab("stay")}
            />
          )}

          <TabButton
            label="Profile"
            icon={User}
            active={tab === "profile"}
            onClick={() => setTab("profile")}
          />

          <TabButton
            label="Security"
            icon={KeyRound}
            active={tab === "security"}
            onClick={() => setTab("security")}
          />

          {isGuest && (
            <TabButton
              label="Services"
              icon={Sparkles}
              active={tab === "services"}
              onClick={() => setTab("services")}
            />
          )}

          {isGuest && (
            <TabButton
              label="Maintenance"
              icon={Wrench}
              active={tab === "maintenance"}
              onClick={() => setTab("maintenance")}
            />
          )}
        </div>

        {isGuest && tab === "stay" && (
          <GuestStayContent 
            profile={profile}
            bookings={userBookings}
            notifications={notifications}
            loading={bookingLoading}
            notificationLoading={notificationLoading}
          />
        )}

        {tab === "profile" && (
          <ProfileInformation
            profile={profile}
            isGuest={isGuest}
            roleLabel={roleLabel[profile.role]}
            onChange={handleProfileChange}
            onSave={handleProfileSave}
            saving={saving}
          />
        )}

        {tab === "security" && (
          <SecurityContent
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            onChangePassword={handlePasswordChange}
          />
        )}

        {isGuest && tab === "services" && (
          <GuestServicesContent />
        )}

        {isGuest && tab === "maintenance" && (
          <ServiceRequestPage />
        )}
      </div>
    </PageShell>
  );
}

function PageShell({ children }) {
  return (
    <div
      className="flex min-h-screen"
      style={{
        background: `
          radial-gradient(
            circle at top right,
            rgba(200,169,106,0.12),
            transparent 30%
          ),
          ${COLORS.BACKGROUND}
        `,
        fontFamily: FONTS.BODY,
      }}
    >
      <main className="min-w-0 flex-1 px-4 py-5 sm:px-7 lg:px-10 lg:py-8">
        {children}
      </main>
    </div>
  );
}

function ProfileHero({
  profile,
  initials,
  roleLabel,
  uploading,
  onUpload,
}) {
  return (
    <section
      className="relative overflow-hidden rounded-[24px] p-6 sm:p-8"
      style={{
        background: `
          linear-gradient(
            135deg,
            ${COLORS.PRIMARY} 0%,
            #352821 55%,
            #574632 100%
          )
        `,
        boxShadow: SHADOWS.CARD,
      }}
    >
      <div
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full opacity-20"
        style={{
          background: COLORS.ACCENT,
          filter: "blur(70px)",
        }}
      />

      <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            <div
              className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[28px] border-4 sm:h-32 sm:w-32"
              style={{
                borderColor: "rgba(255,255,255,0.2)",
                background: COLORS.CREAM,
              }}
            >
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span
                  className="text-3xl font-bold"
                  style={{
                    color: COLORS.PRIMARY,
                    fontFamily: FONTS.HEADING,
                  }}
                >
                  {initials}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onUpload}
              disabled={uploading}
              className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-4 transition-transform hover:scale-105"
              style={{
                background: COLORS.ACCENT,
                borderColor: COLORS.PRIMARY,
                color: COLORS.PRIMARY,
              }}
            >
              {uploading ? (
                <Upload size={16} />
              ) : (
                <Camera size={17} />
              )}
            </button>
          </div>

          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-3 py-1 text-xs font-bold"
                style={{
                  background: "rgba(200,169,106,0.18)",
                  color: COLORS.ACCENT,
                }}
              >
                {roleLabel}
              </span>

              <span
                className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: "rgba(47,107,79,0.2)",
                  color: "#9AD1B0",
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                Active
              </span>
            </div>

            <h1
              className="truncate text-2xl font-bold text-white sm:text-3xl"
              style={{
                fontFamily: FONTS.HEADING,
              }}
            >
              {profile.name}
            </h1>

            <p className="mt-2 flex items-center gap-2 text-sm text-white/65">
              <Mail size={15} />
              {profile.email}
            </p>

            {profile.phone && (
              <p className="mt-1 flex items-center gap-2 text-sm text-white/65">
                <Phone size={15} />
                {profile.phone}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
          <button
            type="button"
            onClick={onUpload}
            disabled={uploading}
            className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5"
            style={{
              background: COLORS.ACCENT,
              color: COLORS.PRIMARY,
            }}
          >
            <Camera size={16} />
            {uploading ? "Uploading..." : "Change Photo"}
          </button>

          <p className="text-center text-xs text-white/45 lg:text-right">
            JPG, PNG or WEBP · Max 5MB
          </p>
        </div>
      </div>
    </section>
  );
}

  function GuestStayContent({ profile, bookings, notifications, loading, notificationLoading }) {
  // Process bookings to match the expected format
  const processedBookings = bookings.map(booking => {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const today = new Date();
    const isCurrent = today >= checkIn && today <= checkOut;
    const nights = booking.nights || Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const dayOfStay = isCurrent ? Math.ceil((today - checkIn) / (1000 * 60 * 60 * 24)) : 1;
    
    return {
      key: booking._id,
      status: isCurrent ? "Current Stay" : "Last Stay",
      room: booking.room?.type || "Luxury Room",
      location: "LuxuryStay",
      meta: isCurrent 
        ? `Room ${booking.room?.roomNumber || '-'} · Day ${dayOfStay} of ${nights}`
        : `Room ${booking.room?.roomNumber || '-'} · Day ${dayOfStay} of ${nights}`,
      active: isCurrent,
      guests: `${booking.guestsCount || 2} Adults`,
      checkIn: checkIn.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      checkOut: checkOut.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      dayOfStay: dayOfStay,
      totalDays: nights,
      roomNumber: booking.room?.roomNumber || '—',
    };
  });

  // Get current booking (first one that is active)
  const currentBookingData = processedBookings.find(b => b.active);
  // Get last booking (first inactive booking)
  const lastBookingData = processedBookings.find(b => !b.active);

  // Format notifications for activity display
  const activityItems = notifications.map(notif => ({
    icon: notif.type === 'booking' ? CalendarDays : 
          notif.type === 'payment' ? CreditCard : 
          notif.type === 'service' ? Coffee : Clock3,
    title: notif.title || "Notification",
    time: notif.createdAt ? new Date(notif.createdAt).toLocaleString() : "Just now",
  }));

  // Default activities if no notifications
  const defaultActivities = [
    {
      icon: CalendarDays,
      title: "Welcome to LuxuryStay",
      time: "Your account is ready",
    }
  ];

  const displayActivities = activityItems.length > 0 ? activityItems : defaultActivities;

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.85fr)]">
      {/* LEFT COLUMN - Current Stay */}
      <div className="grid min-w-0 gap-6">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2
              className="text-lg font-bold"
              style={{
                color: COLORS.TEXT_PRIMARY,
                fontFamily: FONTS.HEADING,
              }}
            >
              Your Stay
            </h2>

            <span
              className="text-xs font-semibold"
              style={{
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              {processedBookings.length} reservation{processedBookings.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {loading ? (
              <div className="col-span-2 text-center py-4">
                <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>Loading bookings...</p>
              </div>
            ) : (
              <>
                {/* LEFT CARD - Current Stay */}
                {currentBookingData ? (
                  <BookingCard
                    key={currentBookingData.key}
                    status="Current Stay"
                    room={currentBookingData.room}
                    location={currentBookingData.location}
                    meta={currentBookingData.meta}
                    active={true}
                  />
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>No current stay</p>
                  </div>
                )}

                {/* RIGHT CARD - Last Stay */}
                {lastBookingData ? (
                  <BookingCard
                    key={lastBookingData.key}
                    status="Last Stay"
                    room={lastBookingData.room}
                    location={lastBookingData.location}
                    meta={lastBookingData.meta}
                    active={false}
                  />
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>No last stay</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {currentBookingData && (
          <CurrentBookingCard
            room={currentBookingData.room}
            guests={currentBookingData.guests}
            checkIn={currentBookingData.checkIn}
            checkOut={currentBookingData.checkOut}
            dayOfStay={currentBookingData.dayOfStay}
            totalDays={currentBookingData.totalDays}
          />
        )}

        <section
          className="rounded-[18px] border p-5 sm:p-6"
          style={{
            background: COLORS.SURFACE,
            borderColor: COLORS.BORDER,
            boxShadow: SHADOWS.CARD,
          }}
        >
          <div className="mb-5 flex items-center justify-between">
            <h2
              className="text-lg font-bold"
              style={{
                color: COLORS.TEXT_PRIMARY,
                fontFamily: FONTS.HEADING,
              }}
            >
              Recent Activity
            </h2>

            <ArrowRight
              size={18}
              color={COLORS.ACCENT}
            />
          </div>

          <div className="grid gap-3">
            {notificationLoading ? (
              <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>Loading activities...</p>
            ) : displayActivities.length > 0 ? (
              displayActivities.map((activity, index) => (
                <ActivityItem
                  key={index}
                  icon={activity.icon}
                  title={activity.title}
                  time={activity.time}
                />
              ))
            ) : (
              <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>No recent activity</p>
            )}
          </div>
        </section>
      </div>

      {/* RIGHT COLUMN - Stay Information */}
      <div className="grid content-start gap-6">
        <AccountSnapshot profile={profile} />
        <InfoCard
          title="Stay Information"
          icon={MapPin}
          rows={[
            { label: "Wi-Fi", value: "LuxuryStay_Guest" },
            { label: "Breakfast", value: "7:00 – 10:30 AM" },
            { label: "Check-out", value: "12:00 PM" },
            { label: "Room Number", value: lastBookingData?.roomNumber || currentBookingData?.roomNumber || "—" },
          ]}
        />
      </div>
    </div>
  );
}

function AccountSnapshot({ profile }) {
  const stats = [
    {
      icon: Hash,
      label: "Member ID",
      value: profile?._id?.slice(-8).toUpperCase() || "GX-48213",
    },
    {
      icon: Award,
      label: "Loyalty Tier",
      value: profile?.loyaltyTier || "Gold",
    },
    {
      icon: Gift,
      label: "Reward Points",
      value: profile?.rewardPoints?.toLocaleString() || "3,200",
    },
  ];

  return (
    <section
      className="rounded-[18px] border p-5 sm:p-6"
      style={{
        background: COLORS.PRIMARY,
        borderColor: COLORS.PRIMARY,
        boxShadow: SHADOWS.CARD,
      }}
    >
      <div className="mb-5 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            background: "rgba(200,169,106,0.16)",
          }}
        >
          <Award
            size={19}
            color={COLORS.ACCENT}
          />
        </div>

        <div>
          <h2
            className="font-bold text-white"
            style={{
              fontFamily: FONTS.HEADING,
            }}
          >
            Account Snapshot
          </h2>

          <p className="text-xs text-white/50">
            Your membership overview
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between rounded-xl p-3"
            style={{
              background: "rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center gap-3">
              <stat.icon
                size={16}
                color={COLORS.ACCENT}
              />

              <span className="text-sm text-white/60">
                {stat.label}
              </span>
            </div>

            <span className="text-sm font-bold text-white">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// All other components remain the same...
// (ProfileInformation, RoleCard, AccountDetailsCard, SecurityContent, 
// GuestServicesContent, FieldInput, PasswordField)

function ProfileInformation({
  profile,
  isGuest,
  roleLabel,
  onChange,
  onSave,
  saving,
}) {
  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.8fr)]">
      <ProfileSection
        title="Personal Information"
        icon={User}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <FieldInput
            icon={User}
            label="Full Name"
            value={profile.name || ""}
            onChange={(e) =>
              onChange("name", e.target.value)
            }
          />

          <FieldInput
            icon={Mail}
            label="Email Address"
            type="email"
            value={profile.email || ""}
            onChange={(e) =>
              onChange("email", e.target.value)
            }
          />

          <FieldInput
            icon={Phone}
            label="Phone Number"
            value={profile.phone || ""}
            placeholder="Add phone number"
            onChange={(e) =>
              onChange("phone", e.target.value)
            }
          />

          <FieldInput
            icon={Calendar}
            label="Date of Birth"
            type="date"
            value={
              profile.dateOfBirth
                ? profile.dateOfBirth.slice(0, 10)
                : ""
            }
            onChange={(e) =>
              onChange(
                "dateOfBirth",
                e.target.value
              )
            }
          />

          <FieldInput
            icon={UserRound}
            label="Gender"
            value={profile.gender || ""}
            placeholder="Optional"
            onChange={(e) =>
              onChange("gender", e.target.value)
            }
          />

          <FieldInput
            icon={Globe2}
            label="Country / Region"
            value={profile.country || ""}
            placeholder="Optional"
            onChange={(e) =>
              onChange("country", e.target.value)
            }
          />
        </div>

        {isGuest && (
          <div className="mt-8 border-t pt-6" style={{ borderColor: COLORS.BORDER }}>
            <div className="mb-4">
              <h3
                className="font-bold"
                style={{
                  color: COLORS.TEXT_PRIMARY,
                  fontFamily: FONTS.HEADING,
                }}
              >
                Preferences
              </h3>

              <p
                className="mt-1 text-xs"
                style={{
                  color: COLORS.TEXT_SECONDARY,
                }}
              >
                Personalize your LuxuryStay experience.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FieldInput
                icon={BedDouble}
                label="Preferred Room Type"
                value={
                  profile.preferredRoomType ||
                  "Deluxe King"
                }
                onChange={(e) =>
                  onChange(
                    "preferredRoomType",
                    e.target.value
                  )
                }
              />

              <FieldInput
                icon={Globe2}
                label="Preferred Language"
                value={
                  profile.preferredLanguage ||
                  "English"
                }
                onChange={(e) =>
                  onChange(
                    "preferredLanguage",
                    e.target.value
                  )
                }
              />
            </div>

            <div
              className="mt-5 divide-y"
              style={{
                borderColor: COLORS.BORDER,
              }}
            >
              <ToggleSwitch
                label="Email Notifications"
                description="Booking updates and receipts"
                checked={
                  profile.emailNotifications ?? true
                }
                onChange={(value) =>
                  onChange(
                    "emailNotifications",
                    value
                  )
                }
              />

              <ToggleSwitch
                label="SMS Notifications"
                description="Check-in reminders and alerts"
                checked={
                  profile.smsNotifications ?? false
                }
                onChange={(value) =>
                  onChange(
                    "smsNotifications",
                    value
                  )
                }
              />

              <ToggleSwitch
                label="Marketing Emails"
                description="Offers, upgrades and news"
                checked={
                  profile.marketingEmails ?? false
                }
                onChange={(value) =>
                  onChange(
                    "marketingEmails",
                    value
                  )
                }
              />
            </div>
          </div>
        )}

        <div className="mt-7 flex justify-end">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            style={{
              background: COLORS.PRIMARY,
              color: COLORS.CREAM,
            }}
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </ProfileSection>

      <div className="grid content-start gap-6">
        <RoleCard
          profile={profile}
          roleLabel={roleLabel}
        />

        <AccountDetailsCard
          profile={profile}
        />
      </div>
    </div>
  );
}

function RoleCard({ profile, roleLabel }) {
  return (
    <section
      className="overflow-hidden rounded-[18px] border"
      style={{
        background: COLORS.PRIMARY,
        borderColor: COLORS.PRIMARY,
        boxShadow: SHADOWS.CARD,
      }}
    >
      <div className="p-6">
        <div
          className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{
            background: "rgba(200,169,106,0.16)",
          }}
        >
          <BriefcaseBusiness
            size={22}
            color={COLORS.ACCENT}
          />
        </div>

        <p className="text-xs uppercase tracking-[0.15em] text-white/45">
          Current Role
        </p>

        <h2
          className="mt-2 text-2xl font-bold text-white"
          style={{
            fontFamily: FONTS.HEADING,
          }}
        >
          {roleLabel}
        </h2>

        <p className="mt-3 text-sm leading-6 text-white/55">
          Your profile information and account settings
          are managed securely through LuxuryStay.
        </p>
      </div>

      <div
        className="border-t p-5"
        style={{
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        <div className="flex items-center gap-3">
          <CheckCircle2
            size={18}
            color="#9AD1B0"
          />

          <div>
            <p className="text-sm font-semibold text-white">
              Account Active
            </p>

            <p className="text-xs text-white/45">
              You have access to your assigned features.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AccountDetailsCard({ profile }) {
  const details = [
    {
      label: "Account Created",
      value: profile.createdAt
        ? new Date(profile.createdAt).toLocaleDateString()
        : "—",
    },
    {
      label: "Role",
      value: profile.role || "—",
    },
    {
      label: "Account Status",
      value: "Active",
    },
  ];

  return (
    <section
      className="rounded-[18px] border p-5 sm:p-6"
      style={{
        background: COLORS.SURFACE,
        borderColor: COLORS.BORDER,
        boxShadow: SHADOWS.CARD,
      }}
    >
      <h2
        className="mb-5 text-lg font-bold"
        style={{
          color: COLORS.TEXT_PRIMARY,
          fontFamily: FONTS.HEADING,
        }}
      >
        Account Details
      </h2>

      <div className="grid gap-4">
        {details.map((detail) => (
          <div
            key={detail.label}
            className="flex items-center justify-between gap-4 border-b pb-4 last:border-b-0 last:pb-0"
            style={{
              borderColor: COLORS.BORDER,
            }}
          >
            <span
              className="text-sm"
              style={{
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              {detail.label}
            </span>

            <span
              className="text-right text-sm font-semibold"
              style={{
                color: COLORS.TEXT_PRIMARY,
              }}
            >
              {detail.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SecurityContent({
  password,
  setPassword,
  showPassword,
  setShowPassword,
  onChangePassword,
}) {
  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]">
      <ProfileSection
        title="Change Password"
        icon={LockKeyhole}
      >
        <div className="grid max-w-xl gap-5">
          <PasswordField
            label="Current Password"
            value={password.currentPassword}
            visible={showPassword.currentPassword}
            onChange={(e) =>
              setPassword({
                ...password,
                currentPassword: e.target.value,
              })
            }
            onToggle={() =>
              setShowPassword({
                ...showPassword,
                currentPassword:
                  !showPassword.currentPassword,
              })
            }
          />

          <PasswordField
            label="New Password"
            value={password.newPassword}
            visible={showPassword.newPassword}
            onChange={(e) =>
              setPassword({
                ...password,
                newPassword: e.target.value,
              })
            }
            onToggle={() =>
              setShowPassword({
                ...showPassword,
                newPassword:
                  !showPassword.newPassword,
              })
            }
          />

          <PasswordField
            label="Confirm New Password"
            value={password.confirmPassword}
            visible={showPassword.confirmPassword}
            onChange={(e) =>
              setPassword({
                ...password,
                confirmPassword: e.target.value,
              })
            }
            onToggle={() =>
              setShowPassword({
                ...showPassword,
                confirmPassword:
                  !showPassword.confirmPassword,
              })
            }
          />

          <button
            type="button"
            onClick={onChangePassword}
            className="mt-2 flex w-fit items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5"
            style={{
              background: COLORS.PRIMARY,
              color: COLORS.CREAM,
            }}
          >
            <KeyRound size={16} />
            Change Password
          </button>
        </div>
      </ProfileSection>

      <section
        className="h-fit rounded-[18px] border p-6"
        style={{
          background: COLORS.PRIMARY,
          borderColor: COLORS.PRIMARY,
          boxShadow: SHADOWS.CARD,
        }}
      >
        <ShieldCheck
          size={27}
          color={COLORS.ACCENT}
        />

        <h2
          className="mt-5 text-xl font-bold text-white"
          style={{
            fontFamily: FONTS.HEADING,
          }}
        >
          Keep your account secure
        </h2>

        <p className="mt-3 text-sm leading-6 text-white/55">
          Use a strong password that you do not reuse on
          other websites or accounts.
        </p>
      </section>
    </div>
  );
}

function GuestServicesContent() {
  const navigate = useNavigate();
  const services = [
    {
      icon: Coffee,
      name: "Breakfast",
      subtitle: "$12",
    },
    {
      icon: ConciergeBell,
      name: "Room Service",
      subtitle: "24 hours",
    },
    {
      icon: Sparkle,
      name: "Laundry",
      subtitle: "Same-day",
    },
    {
      icon: Flower2,
      name: "Spa",
      subtitle: "From $45",
    },
  ];

  return (
    <section
      className="mt-6 rounded-[18px] border p-5 sm:p-6"
      style={{
        background: COLORS.SURFACE,
        borderColor: COLORS.BORDER,
        boxShadow: SHADOWS.CARD,
      }}
    >
      <div className="mb-6">
        <h2
          className="text-xl font-bold"
          style={{
            color: COLORS.TEXT_PRIMARY,
            fontFamily: FONTS.HEADING,
          }}
        >
          Enhance Your Stay
        </h2>

        <p
          className="mt-1 text-sm"
          style={{
            color: COLORS.TEXT_SECONDARY,
          }}
        >
          Discover services designed to make your stay
          more comfortable.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <ServiceCard
            key={service.name}
            {...service}
          />
        ))}
      </div>
      <div className="mt-8">
        <button
          type="button"
          onClick={() => navigate("/guest/services")}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold transition-transform hover:-translate-y-0.5"
          style={{
            background: COLORS.PRIMARY,
            color: COLORS.CREAM,
            boxShadow: SHADOWS.CARD,
          }}
        >
          <ConciergeBell size={18} />
          Request a Service
        </button>
      </div>
    </section>
  );
}

function FieldInput({
  icon: Icon,
  label,
  ...props
}) {
  return (
    <div>
      <label
        className="mb-2 flex items-center gap-2 text-xs font-semibold"
        style={{
          color: COLORS.TEXT_SECONDARY,
        }}
      >
        {Icon && (
          <Icon
            size={14}
            color={COLORS.ACCENT}
          />
        )}

        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-shadow focus:ring-2"
        style={{
          background: COLORS.CREAM,
          borderColor: COLORS.BORDER,
          color: COLORS.TEXT_PRIMARY,
          fontFamily: FONTS.BODY,
          "--tw-ring-color": "rgba(200,169,106,0.25)",
        }}
      />
    </div>
  );
}

function PasswordField({
  label,
  value,
  visible,
  onChange,
  onToggle,
}) {
  return (
    <div>
      <label
        className="mb-2 block text-xs font-semibold"
        style={{
          color: COLORS.TEXT_SECONDARY,
        }}
      >
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete="new-password"
          className="w-full rounded-xl border bg-transparent px-4 py-3 pr-12 text-sm outline-none focus:ring-2"
          style={{
            background: COLORS.CREAM,
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_PRIMARY,
            "--tw-ring-color": "rgba(200,169,106,0.25)",
          }}
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          style={{
            color: COLORS.TEXT_SECONDARY,
          }}
        >
          {visible ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>
      </div>
    </div>
  );
}

export default GuestProfilePage;