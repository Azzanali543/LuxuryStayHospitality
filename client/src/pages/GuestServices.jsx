import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Search,
  BedDouble,
  Users,
  Maximize,
  Mountain,
  Filter,
  Star,
  ArrowRight,
  ChevronDown,
  HeartIcon,
  Utensils,
  Sparkles,
  PlayIcon,
} from "lucide-react";

import {
  COLORS,
  FONTS,
  SHADOWS,
  BORDER_RADIUS,
} from "../constants/theme";

import { getAllRooms } from "../api/roomApi";

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.4 },
};

export default function Accommodations() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredRoom, setHoveredRoom] = useState(null);

  // LOAD ROOMS
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await getAllRooms();

        const roomData = Array.isArray(data)
          ? data
          : data?.rooms || data?.data || [];

        const roomsWithRating = roomData.map((room) => ({
          ...room,
          rating: room.rating || 4.5,
        }));

        setRooms(roomsWithRating);
      } catch (error) {
        console.error("Failed to load rooms:", error);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  // ROOM TYPES
  const roomTypes = useMemo(() => {
    const types = rooms
      .map((room) => room.type)
      .filter(Boolean);

    return ["All", ...new Set(types)];
  }, [rooms]);

  // FILTER AND SEARCH
  const filteredRooms = useMemo(() => {
    let data = [...rooms];

    if (selectedType !== "All") {
      data = data.filter(
        (room) => room.type === selectedType
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      data = data.filter((room) => {
        const roomNumber = String(
          room.roomNumber || ""
        ).toLowerCase();

        const type = String(
          room.type || ""
        ).toLowerCase();

        const bar = String(
          room.bar || ""
        ).toLowerCase();

        return (
          roomNumber.includes(query) ||
          type.includes(query) ||
          bar.includes(query)
        );
      });
    }

    switch (sortBy) {
      case "price-low":
        data.sort(
          (a, b) =>
            Number(a.price || 0) -
            Number(b.price || 0)
        );
        break;

      case "price-high":
        data.sort(
          (a, b) =>
            Number(b.price || 0) -
            Number(a.price || 0)
        );
        break;

      case "rating":
        data.sort(
          (a, b) =>
            Number(b.rating || 0) -
            Number(a.rating || 0)
        );
        break;

      default:
        break;
    }

    return data;
  }, [
    rooms,
    selectedType,
    search,
    sortBy,
  ]);

  // STATISTICS
  const availableRooms = rooms.filter(
    (room) =>
      String(room.status || "").toLowerCase() ===
      "available"
  ).length;

  const averageRating =
    rooms.length > 0
      ? rooms.reduce(
          (total, room) =>
            total + Number(room.rating || 0),
          0
        ) / rooms.length
      : 0;

  return (
    <main
      style={{
        background: COLORS.BACKGROUND,
        minHeight: "100vh",
        fontFamily: FONTS.BODY,
      }}
    >
      {/* =====================================================
          HERO SECTION
      ====================================================== */}
      <section className="relative min-h-[58vh] md:min-h-[68vh] flex items-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=2000&q=85')",
          }}
        />

        {/* Main Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                90deg,
                rgba(31,26,23,0.88) 0%,
                rgba(31,26,23,0.66) 32%,
                rgba(31,26,23,0.30) 68%,
                rgba(31,26,23,0.12) 100%
              ),
              linear-gradient(
                to bottom,
                rgba(31,26,23,0.18) 0%,
                transparent 42%,
                rgba(31,26,23,0.55) 100%
              )
            `,
          }}
        />

        {/* Soft Glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 70% 45%, rgba(255,255,255,0.07), transparent 35%)",
          }}
        />

        {/* Decorative Top Line */}
        <div
          className="absolute top-0 left-0 w-1/3 h-px"
          style={{
            background: `linear-gradient(to right, ${COLORS.ACCENT}, transparent)`,
          }}
        />

        {/* Decorative Bottom Line */}
        <div
          className="absolute bottom-0 right-0 w-1/3 h-px"
          style={{
            background: `linear-gradient(to left, ${COLORS.ACCENT}, transparent)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 w-full">
          <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
            <div className="max-w-2xl py-10 md:py-12">

              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p
                  className="inline-flex items-center gap-3 px-4 py-2 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] rounded-full"
                  style={{
                    color: COLORS.ACCENT,
                    background: "rgba(212,168,130,0.13)",
                    border:
                      "1px solid rgba(212,168,130,0.22)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <span
                    className="h-px w-4"
                    style={{
                      background: COLORS.ACCENT,
                    }}
                  />

                  Luxury Collection

                  <span
                    className="h-px w-4"
                    style={{
                      background: COLORS.ACCENT,
                    }}
                  />
                </p>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.1,
                }}
                className="
                  mt-5
                  text-[42px]
                  sm:text-5xl
                  md:text-6xl
                  lg:text-7xl
                  font-light
                  leading-[1.08]
                "
                style={{
                  fontFamily: FONTS.HEADING,
                  color: COLORS.CREAM,
                  letterSpacing: "-0.035em",
                  textShadow:
                    "0 3px 25px rgba(0,0,0,0.25)",
                }}
              >
                Find Your
                <br />
                <span
                  style={{
                    color: COLORS.ACCENT,
                  }}
                >
                  Perfect Stay.
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                }}
                className="
                  mt-5
                  max-w-xl
                  text-sm
                  sm:text-base
                  md:text-lg
                  font-light
                  leading-[1.7]
                "
                style={{
                  color:
                    "rgba(248,246,243,0.84)",
                }}
              >
                Discover elegant rooms and luxury
                suites designed to provide exceptional
                comfort, unforgettable experiences,
                and premium hospitality.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                }}
                className="mt-7 flex items-center gap-5 sm:gap-7"
              >
                {/* Rooms */}
                <div>
                  <p
                    className="text-2xl sm:text-3xl font-light"
                    style={{
                      color: COLORS.CREAM,
                    }}
                  >
                    {rooms.length}
                  </p>

                  <p
                    className="mt-1 text-[9px] sm:text-[10px] uppercase tracking-[0.18em]"
                    style={{
                      color:
                        "rgba(248,246,243,0.48)",
                    }}
                  >
                    Rooms
                  </p>
                </div>

                <div
                  className="h-10 w-px"
                  style={{
                    background:
                      "rgba(248,246,243,0.18)",
                  }}
                />

                {/* Available */}
                <div>
                  <p
                    className="text-2xl sm:text-3xl font-light"
                    style={{
                      color: COLORS.CREAM,
                    }}
                  >
                    {availableRooms}
                  </p>

                  <p
                    className="mt-1 text-[9px] sm:text-[10px] uppercase tracking-[0.18em]"
                    style={{
                      color:
                        "rgba(248,246,243,0.48)",
                    }}
                  >
                    Available
                  </p>
                </div>

                <div
                  className="h-10 w-px"
                  style={{
                    background:
                      "rgba(248,246,243,0.18)",
                  }}
                />

                {/* Rating */}
                <div>
                  <p
                    className="text-2xl sm:text-3xl font-light"
                    style={{
                      color: COLORS.ACCENT,
                    }}
                  >
                    {averageRating.toFixed(1)}
                  </p>

                  <p
                    className="mt-1 text-[9px] sm:text-[10px] uppercase tracking-[0.18em]"
                    style={{
                      color:
                        "rgba(248,246,243,0.48)",
                    }}
                  >
                    Rating
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="
            absolute
            bottom-5
            left-1/2
            -translate-x-1/2
            hidden
            md:flex
            flex-col
            items-center
            gap-2
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{
              color:
                "rgba(248,246,243,0.32)",
            }}
          >
            Scroll
          </span>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-px h-7"
            style={{
              background: `linear-gradient(
                to bottom,
                ${COLORS.ACCENT},
                transparent
              )`,
            }}
          />
        </motion.div>
      </section>

      {/* =====================================================
          SEARCH AND FILTER
      ====================================================== */}
      <section className="relative z-20 max-w-[1200px] mx-auto px-6 py-12">
        <motion.div
          {...fadeUp}
          className="p-6 md:p-8"
          style={{
            background: COLORS.SURFACE,
            borderRadius: BORDER_RADIUS.LARGE,
            boxShadow: SHADOWS.CARD,
            border:
              `1px solid ${COLORS.BORDER}`,
          }}
        >
          <div className="flex flex-wrap gap-4 items-center">

            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                "
                style={{
                  color:
                    COLORS.TEXT_SECONDARY,
                }}
              />

              <input
                type="text"
                placeholder="Search rooms by number, type, or view..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full pl-12 pr-4 py-3.5 outline-none"
                style={{
                  borderRadius:
                    BORDER_RADIUS.MEDIUM,
                  border:
                    `2px solid ${COLORS.BORDER}`,
                  background:
                    COLORS.BACKGROUND,
                  color:
                    COLORS.TEXT_PRIMARY,
                }}
              />
            </div>

            {/* Room Type */}
            <select
              value={selectedType}
              onChange={(e) =>
                setSelectedType(e.target.value)
              }
              className="
                px-4
                py-3.5
                min-w-[160px]
                outline-none
              "
              style={{
                borderRadius:
                  BORDER_RADIUS.MEDIUM,
                border:
                  `2px solid ${COLORS.BORDER}`,
                background:
                  COLORS.BACKGROUND,
                color:
                  COLORS.TEXT_PRIMARY,
              }}
            >
              {roomTypes.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
              className="
                px-4
                py-3.5
                min-w-[150px]
                outline-none
              "
              style={{
                borderRadius:
                  BORDER_RADIUS.MEDIUM,
                border:
                  `2px solid ${COLORS.BORDER}`,
                background:
                  COLORS.BACKGROUND,
                color:
                  COLORS.TEXT_PRIMARY,
              }}
            >
              <option value="default">
                Sort by
              </option>

              <option value="price-low">
                Lowest Price
              </option>

              <option value="price-high">
                Highest Price
              </option>

              <option value="rating">
                Highest Rating
              </option>
            </select>

            {/* Filters Button */}
            <button
              onClick={() =>
                setShowFilters(!showFilters)
              }
              className="
                flex
                items-center
                gap-2
                px-6
                py-3.5
                font-semibold
              "
              style={{
                background: COLORS.PRIMARY,
                color: COLORS.CREAM,
                borderRadius:
                  BORDER_RADIUS.MEDIUM,
              }}
            >
              <Filter size={18} />

              Filters

              <ChevronDown
                size={16}
                style={{
                  transform: showFilters
                    ? "rotate(180deg)"
                    : "rotate(0)",
                  transition:
                    "transform 0.3s ease",
                }}
              />
            </button>
          </div>

          {/* Additional Filters */}
          {showFilters && (
            <div
              className="
                mt-6
                pt-6
                flex
                flex-wrap
                gap-4
              "
              style={{
                borderTop:
                  `1px solid ${COLORS.BORDER}`,
              }}
            >
              {[
                "All Amenities",
                "WiFi",
                "TV",
                "Kitchen",
                "Jacuzzi",
                "Pool Access",
                "Butler Service",
              ].map((amenity) => (
                <label
                  key={amenity}
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                  "
                  style={{
                    color:
                      COLORS.TEXT_SECONDARY,
                  }}
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    style={{
                      accentColor:
                        COLORS.ACCENT,
                    }}
                  />

                  {amenity}
                </label>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* =====================================================
          ROOM GRID
      ====================================================== */}
      <section className="max-w-[1200px] mx-auto px-6 pb-20">

        {/* Section Heading */}
        <motion.div
          {...fadeUp}
          className="mb-8"
        >
          <h2
            className="
              text-3xl
              md:text-4xl
              font-light
            "
            style={{
              fontFamily: FONTS.HEADING,
              color: COLORS.PRIMARY,
            }}
          >
            Luxury Rooms & Suites
          </h2>

          <p
            className="mt-2 text-sm"
            style={{
              color:
                COLORS.TEXT_SECONDARY,
            }}
          >
            <span
              style={{
                color: COLORS.ACCENT,
                fontWeight: 600,
              }}
            >
              {filteredRooms.length}
            </span>{" "}
            Premium Rooms Available
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-3
              gap-6
            "
          >
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="
                    h-[460px]
                    animate-pulse
                  "
                  style={{
                    borderRadius:
                      BORDER_RADIUS.LARGE,
                    background:
                      COLORS.SURFACE,
                  }}
                />
              )
            )}
          </div>
        )}

        {/* No Rooms */}
        {!loading &&
          filteredRooms.length === 0 && (
            <motion.div
              {...fadeIn}
              className="text-center py-20"
            >
              <Search
                size={40}
                className="mx-auto mb-5"
                style={{
                  color: COLORS.ACCENT,
                }}
              />

              <h3
                className="
                  text-2xl
                  font-light
                "
                style={{
                  fontFamily:
                    FONTS.HEADING,
                  color:
                    COLORS.PRIMARY,
                }}
              >
                No Rooms Found
              </h3>

              <p
                className="mt-2 text-sm"
                style={{
                  color:
                    COLORS.TEXT_SECONDARY,
                }}
              >
                Try adjusting your search
                or filters.
              </p>
            </motion.div>
          )}

        {/* Rooms */}
        {!loading &&
          filteredRooms.length > 0 && (
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                gap-6
                items-stretch
              "
            >
              {filteredRooms.map(
                (room, index) => {
                  const amenities =
                    Array.isArray(
                      room.amenities
                    )
                      ? room.amenities
                      : [];

                  const isAvailable =
                    String(
                      room.status || ""
                    ).toLowerCase() ===
                    "available";

                  const roomArea =
                    room.area ||
                    room.size ||
                    "-";

                  const rating =
                    Number(
                      room.rating || 4.5
                    );

                  return (
                    <motion.div
                      key={room._id}
                      {...fadeUp}
                      transition={{
                        duration: 0.4,
                        delay:
                          (index % 6) *
                          0.05,
                      }}
                      className="
                        group
                        h-full
                        min-h-0
                        flex
                        flex-col
                        overflow-hidden
                        transition-all
                        duration-500
                      "
                      style={{
                        background:
                          COLORS.SURFACE,
                        borderRadius:
                          BORDER_RADIUS.LARGE,
                        border:
                          `1px solid ${COLORS.BORDER}`,
                        boxShadow:
                          SHADOWS.CARD,
                        transform:
                          hoveredRoom ===
                          room._id
                            ? "translateY(-8px)"
                            : "translateY(0)",
                      }}
                      onMouseEnter={() =>
                        setHoveredRoom(
                          room._id
                        )
                      }
                      onMouseLeave={() =>
                        setHoveredRoom(null)
                      }
                    >
                      {/* Image */}
                      <div
                        className="
                          relative
                          overflow-hidden
                          h-56
                          min-h-[224px]
                          max-h-[224px]
                          flex-shrink-0
                        "
                      >
                        <img
                          src={
                            room.image ||
                            "/rooms/default-room.jpg"
                          }
                          alt={
                            room.type ||
                            "Hotel room"
                          }
                          className="
                            w-full
                            h-full
                            object-cover
                            object-center
                            transition-transform
                            duration-700
                            group-hover:scale-110
                          "
                        />

                        {/* Status */}
                        <div
                          className="
                            absolute
                            top-4
                            right-4
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            uppercase
                            rounded-full
                          "
                          style={{
                            background:
                              isAvailable
                                ? COLORS.SUCCESS
                                : COLORS.ERROR,
                            color: "#fff",
                          }}
                        >
                          {room.status ||
                            "Unknown"}
                        </div>

                        {/* Price */}
                        <div
                          className="
                            absolute
                            bottom-4
                            left-4
                            px-4
                            py-2
                            rounded-full
                            font-bold
                            text-sm
                          "
                          style={{
                            background:
                              COLORS.ACCENT,
                            color:
                              COLORS.PRIMARY,
                          }}
                        >
                          PKR{" "}
                          {Number(
                            room.price || 0
                          ).toLocaleString()}
                        </div>

                        {/* Rating */}
                        <div
                          className="
                            absolute
                            bottom-4
                            right-4
                            px-3
                            py-1.5
                            rounded-full
                            flex
                            items-center
                            gap-1.5
                          "
                          style={{
                            background:
                              "rgba(0,0,0,0.6)",
                          }}
                        >
                          <Star
                            size={14}
                            fill={
                              COLORS.WARNING
                            }
                            style={{
                              color:
                                COLORS.WARNING,
                            }}
                          />

                          <span className="
                            text-white
                            text-sm
                            font-semibold
                          ">
                            {rating.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div
                        className="
                          p-6
                          flex
                          flex-col
                          flex-1
                          min-h-0
                        "
                      >
                        {/* Title */}
                        <h3
                          className="
                            text-xl
                            font-semibold
                          "
                          style={{
                            fontFamily:
                              FONTS.HEADING,
                            color:
                              COLORS.PRIMARY,
                          }}
                        >
                          {room.type ||
                            "Luxury Room"}
                        </h3>

                        {/* Room Number */}
                        <p
                          className="
                            text-xs
                            mt-1
                          "
                          style={{
                            color:
                              COLORS.TEXT_SECONDARY,
                          }}
                        >
                          Room{" "}
                          {room.roomNumber ||
                            "-"}
                        </p>

                        {/* Description */}
                        <p
                          className="
                            text-sm
                            mt-3
                            leading-relaxed
                            line-clamp-3
                            min-h-[72px]
                            max-h-[72px]
                            overflow-hidden
                          "
                          style={{
                            color:
                              COLORS.TEXT_SECONDARY,
                          }}
                        >
                          {room.description ||
                            "Experience comfort, elegance and premium hospitality in our beautifully designed accommodation."}
                        </p>

                        {/* Amenities */}
                        <div
                          className="
                            flex
                            flex-wrap
                            gap-2
                            mt-4
                            min-h-[32px]
                            max-h-[64px]
                            overflow-hidden
                          "
                        >
                          {amenities
                            .slice(0, 3)
                            .map(
                              (amenity) => (
                                <span
                                  key={
                                    amenity
                                  }
                                  className="
                                    text-xs
                                    px-3
                                    py-1
                                    rounded-full
                                  "
                                  style={{
                                    background:
                                      "rgba(212,168,130,0.08)",
                                    color:
                                      COLORS.TEXT_SECONDARY,
                                    border:
                                      "1px solid rgba(212,168,130,0.1)",
                                  }}
                                >
                                  {amenity}
                                </span>
                              )
                            )}

                          {amenities.length >
                            3 && (
                            <span
                              className="
                                text-xs
                                px-3
                                py-1
                                rounded-full
                              "
                              style={{
                                background:
                                  COLORS.BACKGROUND,
                                color:
                                  COLORS.TEXT_SECONDARY,
                                border:
                                  `1px solid ${COLORS.BORDER}`,
                              }}
                            >
                              +
                              {amenities.length -
                                3}
                            </span>
                          )}
                        </div>

                        {/* Details */}
                        <div
                          className="
                            grid
                            grid-cols-2
                            gap-3
                            mt-4
                            py-4
                            border-y
                          "
                          style={{
                            borderColor:
                              COLORS.BORDER,
                          }}
                        >
                          {/* Guests */}
                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              text-sm
                            "
                            style={{
                              color:
                                COLORS.TEXT_SECONDARY,
                            }}
                          >
                            <Users
                              size={16}
                              style={{
                                color:
                                  COLORS.ACCENT,
                              }}
                            />

                            {room.guests ||
                              "-"}{" "}
                            Guests
                          </div>

                          {/* Area */}
                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              text-sm
                            "
                            style={{
                              color:
                                COLORS.TEXT_SECONDARY,
                            }}
                          >
                            <Maximize
                              size={16}
                              style={{
                                color:
                                  COLORS.ACCENT,
                              }}
                            />

                            {roomArea}
                          </div>

                          {/* Bed */}
                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              text-sm
                            "
                            style={{
                              color:
                                COLORS.TEXT_SECONDARY,
                            }}
                          >
                            <BedDouble
                              size={16}
                              style={{
                                color:
                                  COLORS.ACCENT,
                              }}
                            />

                            {room.bed ||
                              "-"}
                          </div>

                          {/* View */}
                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              text-sm
                            "
                            style={{
                              color:
                                COLORS.TEXT_SECONDARY,
                            }}
                          >
                            <Mountain
                              size={16}
                              style={{
                                color:
                                  COLORS.ACCENT,
                              }}
                            />

                            {room.bar ||
                              "-"}
                          </div>
                        </div>

                        {/* Button */}
                        <Link
                          to={`/rooms/experience/${room._id}`}
                          className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            w-full
                            mt-auto
                            pt-3
                            pb-3
                            font-semibold
                          "
                          style={{
                            background:
                              COLORS.PRIMARY,
                            color:
                              COLORS.CREAM,
                            borderRadius:
                              BORDER_RADIUS.MEDIUM,
                          }}
                        >
                          View Room

                          <ArrowRight
                            size={18}
                          />
                        </Link>
                      </div>
                    </motion.div>
                  );
                }
              )}
            </div>
          )}
      </section>

      {/* =====================================================
          FEATURES
      ====================================================== */}
      <section className="max-w-[1200px] mx-auto px-6 pb-20">
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-4
            gap-6
          "
        >
          {[
            {
              icon: BedDouble,
              title: "Luxury Rooms",
              desc: "Beautifully designed rooms with modern interiors and premium furnishings.",
            },
            {
              icon: Users,
              title: "24/7 Concierge",
              desc: "Professional concierge service available any time during your stay.",
            },
            {
              icon: Utensils,
              title: "Fine Dining",
              desc: "World-class restaurants serving international cuisine.",
            },
            {
              icon: Sparkles,
              title: "Spa & Wellness",
              desc: "Relax with luxurious spa treatments and wellness experiences.",
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                }}
                className="p-8 text-center"
                style={{
                  background:
                    COLORS.SURFACE,
                  borderRadius:
                    BORDER_RADIUS.LARGE,
                  border:
                    `1px solid ${COLORS.BORDER}`,
                  boxShadow:
                    SHADOWS.CARD,
                }}
              >
                <div
                  className="
                    w-16
                    h-16
                    rounded-full
                    mx-auto
                    mb-4
                    flex
                    items-center
                    justify-center
                  "
                  style={{
                    background:
                      "rgba(212,168,130,0.1)",
                  }}
                >
                  <Icon
                    size={28}
                    style={{
                      color:
                        COLORS.ACCENT,
                    }}
                  />
                </div>

                <h3
                  className="
                    text-lg
                    font-semibold
                  "
                  style={{
                    fontFamily:
                      FONTS.HEADING,
                    color:
                      COLORS.PRIMARY,
                  }}
                >
                  {item.title}
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-relaxed
                  "
                  style={{
                    color:
                      COLORS.TEXT_SECONDARY,
                  }}
                >
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section
        className="
          px-4
          py-20
          md:py-28
          sm:px-8
          md:px-12
          lg:px-[60px]
          relative
          overflow-hidden
        "
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              135deg,
              ${COLORS.PRIMARY} 0%,
              #3B2F28 100%
            )`,
          }}
        />

        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(
              circle at 50% 50%,
              ${COLORS.ACCENT} 2px,
              transparent 2px
            )`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Top Line */}
        <div
          className="
            absolute
            top-0
            left-1/2
            -translate-x-1/2
            w-32
            h-px
          "
          style={{
            background: `linear-gradient(
              to right,
              transparent,
              ${COLORS.ACCENT},
              transparent
            )`,
          }}
        />

        {/* Bottom Line */}
        <div
          className="
            absolute
            bottom-0
            left-1/2
            -translate-x-1/2
            w-32
            h-px
          "
          style={{
            background: `linear-gradient(
              to right,
              transparent,
              ${COLORS.ACCENT},
              transparent
            )`,
          }}
        />

        <motion.div
          {...fadeUp}
          className="
            relative
            mx-auto
            max-w-[800px]
            text-center
          "
        >
          {/* Icon */}
          <div className="relative inline-block mb-8">
            <div
              className="
                absolute
                inset-0
                rounded-full
                animate-ping
              "
              style={{
                background:
                  "rgba(212, 168, 130, 0.2)",
                animationDuration: "2s",
              }}
            />

            <div
              className="
                relative
                inline-flex
                items-center
                justify-center
                w-20
                h-20
                rounded-full
              "
              style={{
                background:
                  "rgba(212, 168, 130, 0.15)",
                border:
                  "2px solid rgba(212, 168, 130, 0.2)",
              }}
            >
              <HeartIcon
                className="w-10 h-10"
                style={{
                  color: COLORS.ACCENT,
                }}
              />
            </div>
          </div>

          {/* Heading */}
          <h2
            className="
              text-3xl
              md:text-5xl
              font-light
            "
            style={{
              fontFamily:
                FONTS.HEADING,
              color:
                COLORS.CREAM,
              letterSpacing:
                "-0.02em",
            }}
          >
            Experience Luxury Like Never Before
          </h2>

          {/* Description */}
          <p
            className="
              max-w-2xl
              mx-auto
              mt-4
              text-base
              leading-relaxed
            "
            style={{
              color:
                "rgba(248,246,243,0.75)",
            }}
          >
            Discover elegant accommodations,
            exceptional hospitality and
            unforgettable moments. Whether
            you're traveling for business or
            leisure, LuxuryStay promises comfort
            beyond expectations.
          </p>

          {/* CTA */}
          <div
            className="
              flex
              flex-col
              sm:flex-row
              items-center
              justify-center
              gap-4
              mt-8
            "
          >
            <Link
              to="/homeservice"
              className="
                inline-flex
                items-center
                gap-3
                px-8
                py-4
                text-sm
                font-semibold
                rounded-full
                transition-all
                duration-300
                hover:scale-105
                group
              "
              style={{
                background:
                  COLORS.ACCENT,
                color:
                  COLORS.CREAM,
                boxShadow:
                  "0 4px 24px rgba(212, 168, 130, 0.3)",
              }}
            >
              <PlayIcon
                className="w-5 h-5"
              />

              Explore Services
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}