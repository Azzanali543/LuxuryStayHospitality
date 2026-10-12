import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllRooms,
  deleteRoom,
} from "../api/roomApi";

import {
  BedDouble,
  Search,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";

import {
  COLORS,
  FONTS,
  SHADOWS,
  BORDER_RADIUS,
} from "../constants/theme";
import AsideBar from "../components/AsideBar";

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [deletingId, setDeletingId] = useState(null);

  // =========================
  // LOAD ROOMS
  // =========================
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await getAllRooms();

        const roomData = Array.isArray(data)
          ? data
          : data?.rooms || [];

        setRooms(roomData);
      } catch (error) {
        console.error("Failed to load rooms:", error);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  // =========================
  // DELETE ROOM
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this room?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await deleteRoom(id);

      setRooms((previousRooms) =>
        previousRooms.filter(
          (room) => room._id !== id
        )
      );

      alert("Room deleted successfully");
    } catch (error) {
      console.error("Delete room error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete room"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // FILTER ROOMS
  // =========================
  const filteredRooms = rooms.filter((room) => {
    const searchText = search.toLowerCase();

    const matchSearch =
      String(room.roomNumber || "")
        .toLowerCase()
        .includes(searchText) ||
      String(room.type || "")
        .toLowerCase()
        .includes(searchText);

    const matchFilter =
      filter === "All" ||
      String(room.status || "").toLowerCase() === filter;

    return matchSearch && matchFilter;
  });

  // =========================
  // STATUS STYLE
  // =========================
  const getStatusStyle = (status) => {
    const normalizedStatus = String(
      status || ""
    ).toLowerCase();

    if (normalizedStatus === "available") {
      return {
        background: "#EAF7F0",
        color: COLORS.SUCCESS,
      };
    }

    if (normalizedStatus === "occupied") {
      return {
        background: "#FDECEC",
        color: COLORS.ERROR,
      };
    }

    if (normalizedStatus === "reserved") {
      return {
        background: "#FFF7E6",
        color: COLORS.WARNING,
      };
    }

    if (normalizedStatus === "cleaning") {
      return {
        background: "#E8F1FD",
        color: COLORS.INFO,
      };
    }

    if (normalizedStatus === "maintenance") {
      return {
        background: "#FDECEC",
        color: COLORS.ERROR,
      };
    }

    return {
      background: "#E8F1FD",
      color: COLORS.INFO,
    };
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          background: COLORS.BACKGROUND,
          fontFamily: FONTS.BODY,
        }}
      >
        <AsideBar />

        <main className="flex-1 min-w-0 overflow-hidden p-4 md:p-5 lg:p-6">
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center">
              <div
                className="w-14 h-14 border-4 rounded-full animate-spin mx-auto"
                style={{
                  borderColor: COLORS.ACCENT,
                  borderTopColor: "transparent",
                }}
              />

              <p
                className="text-lg mt-4"
                style={{
                  color: COLORS.TEXT_SECONDARY,
                }}
              >
                Loading rooms...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: COLORS.BACKGROUND,
        fontFamily: FONTS.BODY,
      }}
    >
      <AsideBar />

      <main className="flex-1 min-w-0 overflow-hidden p-4 md:p-5 lg:p-6">
        {/* =========================
            HEADER
        ========================= */}
        <div
          className="p-5 md:p-6 mb-6"
          style={{
            background: `linear-gradient(135deg, ${COLORS.PRIMARY}, #3B2D25)`,
            borderRadius: BORDER_RADIUS.LARGE,
            boxShadow: SHADOWS.CARD,
          }}
        >
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="p-3 flex-shrink-0"
                style={{
                  background: COLORS.ACCENT,
                  borderRadius: BORDER_RADIUS.LARGE,
                }}
              >
                <BedDouble
                  size={30}
                  style={{
                    color: COLORS.PRIMARY,
                  }}
                />
              </div>

              <div className="min-w-0">
                <h1
                  className="text-2xl md:text-3xl font-bold text-white"
                  style={{
                    fontFamily: FONTS.HEADING,
                  }}
                >
                  Rooms Management
                </h1>

                <p
                  className="mt-1 text-sm md:text-base"
                  style={{
                    color: COLORS.ACCENT,
                  }}
                >
                  Manage hotel rooms, pricing, availability and room status.
                </p>
              </div>
            </div>

            <Link
              to="/admin/rooms/newroom"
              className="flex items-center gap-2 flex-shrink-0"
              style={{
                background: COLORS.ACCENT,
                color: COLORS.PRIMARY,
                fontWeight: 600,
                padding: "10px 16px",
                borderRadius: BORDER_RADIUS.MEDIUM,
                textDecoration: "none",
                boxShadow: SHADOWS.DROPDOWN,
              }}
            >
              <Plus size={18} />
              Add Room
            </Link>
          </div>
        </div>

        {/* =========================
            SEARCH AND FILTER
        ========================= */}
        <div
          className="p-4 md:p-5 mb-6 flex flex-col sm:flex-row justify-between gap-3"
          style={{
            background: COLORS.SURFACE,
            borderRadius: BORDER_RADIUS.LARGE,
            boxShadow: SHADOWS.CARD,
            border: `1px solid ${COLORS.BORDER}`,
          }}
        >
          <div className="relative w-full sm:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{
                color: COLORS.TEXT_SECONDARY,
              }}
            />

            <input
              type="text"
              placeholder="Search Room Number or Type..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2.5 outline-none text-sm"
              style={{
                border: `1px solid ${COLORS.BORDER}`,
                borderRadius: BORDER_RADIUS.MEDIUM,
                background: COLORS.BACKGROUND,
                color: COLORS.TEXT_PRIMARY,
                fontFamily: FONTS.BODY,
              }}
            />
          </div>

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="w-full sm:w-48 px-4 py-2.5 outline-none text-sm"
            style={{
              border: `1px solid ${COLORS.BORDER}`,
              borderRadius: BORDER_RADIUS.MEDIUM,
              background: COLORS.BACKGROUND,
              color: COLORS.TEXT_PRIMARY,
              cursor: "pointer",
              fontFamily: FONTS.BODY,
            }}
          >
            <option value="All">All</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
            <option value="cleaning">Cleaning</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        {/* =========================
            STATISTICS
        ========================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          {[
            {
              label: "Total Rooms",
              value: rooms.length,
              color: COLORS.INFO,
            },
            {
              label: "Available",
              value: rooms.filter(
                (room) =>
                  String(room.status || "").toLowerCase() ===
                  "available"
              ).length,
              color: COLORS.SUCCESS,
            },
            {
              label: "Occupied",
              value: rooms.filter(
                (room) =>
                  String(room.status || "").toLowerCase() ===
                  "occupied"
              ).length,
              color: COLORS.ERROR,
            },
            {
              label: "Reserved",
              value: rooms.filter(
                (room) =>
                  String(room.status || "").toLowerCase() ===
                  "reserved"
              ).length,
              color: COLORS.WARNING,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 md:p-5"
              style={{
                background: `${item.color}22`,
                border: `1px solid ${item.color}55`,
                borderRadius: BORDER_RADIUS.LARGE,
                textAlign: "center",
                boxShadow: SHADOWS.CARD,
              }}
            >
              <h1
                className="text-2xl md:text-3xl"
                style={{
                  color: item.color,
                  fontWeight: 700,
                  fontFamily: FONTS.HEADING,
                }}
              >
                {item.value}
              </h1>

              <p
                className="mt-1 text-sm"
                style={{
                  color: COLORS.TEXT_SECONDARY,
                  fontWeight: 500,
                }}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* =========================
            ROOMS TABLE
        ========================= */}
        <div
          className="w-full overflow-hidden"
          style={{
            background: COLORS.SURFACE,
            borderRadius: BORDER_RADIUS.LARGE,
            boxShadow: SHADOWS.CARD,
            border: `1px solid ${COLORS.BORDER}`,
          }}
        >
          {/* Only the table can scroll horizontally if the
              available screen width is genuinely too small */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse">
              <thead
                style={{
                  background: `linear-gradient(135deg, ${COLORS.PRIMARY}, #3B2D25)`,
                }}
              >
                <tr>
                  {[
                    "Room",
                    "Type",
                    "Image",
                    "Floor",
                    "Area",
                    "Persons",
                    "Price / Night",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="text-center py-3 px-3 whitespace-nowrap"
                      style={{
                        color: COLORS.ACCENT,
                        fontFamily: FONTS.HEADING,
                        fontSize: "14px",
                        fontWeight: 700,
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredRooms.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center py-10"
                      style={{
                        color: COLORS.TEXT_SECONDARY,
                      }}
                    >
                      No rooms found.
                    </td>
                  </tr>
                ) : (
                  filteredRooms.map((room, index) => {
                    const statusStyle =
                      getStatusStyle(room.status);

                    return (
                      <tr
                        key={room._id}
                        className="transition-all duration-200 hover:bg-amber-50"
                        style={{
                          background:
                            index % 2 === 0
                              ? "#FFFFFF"
                              : "#FCFAF7",
                          borderBottom:
                            `1px solid ${COLORS.BORDER}`,
                        }}
                      >
                        <td
                          className="py-4 px-3 text-center font-semibold whitespace-nowrap"
                          style={{
                            color: COLORS.TEXT_PRIMARY,
                          }}
                        >
                          #{room.roomNumber}
                        </td>

                        <td
                          className="py-4 px-3 text-center whitespace-nowrap"
                          style={{
                            color: COLORS.TEXT_SECONDARY,
                          }}
                        >
                          {room.type || "-"}
                        </td>

                        <td className="py-4 px-3 text-center">
                          <img
                            src={
                              room.image ||
                              "/rooms/default-room.jpg"
                            }
                            alt={
                              room.type ||
                              "Hotel room"
                            }
                            style={{
                              width: "65px",
                              height: "48px",
                              objectFit: "cover",
                              borderRadius:
                                BORDER_RADIUS.MEDIUM,
                              border:
                                `2px solid ${COLORS.BORDER}`,
                              boxShadow:
                                SHADOWS.CARD,
                              margin: "auto",
                            }}
                          />
                        </td>

                        <td
                          className="py-4 px-3 text-center whitespace-nowrap"
                          style={{
                            color: COLORS.TEXT_SECONDARY,
                          }}
                        >
                          {room.floor || "-"}
                        </td>

                        <td
                          className="py-4 px-3 text-center whitespace-nowrap"
                          style={{
                            color: COLORS.TEXT_SECONDARY,
                          }}
                        >
                          {room.area || "-"}
                        </td>

                        <td
                          className="py-4 px-3 text-center whitespace-nowrap"
                          style={{
                            color: COLORS.TEXT_SECONDARY,
                          }}
                        >
                          {room.guests || "-"}
                        </td>

                        <td
                          className="py-4 px-3 text-center font-semibold whitespace-nowrap"
                          style={{
                            color: COLORS.TEXT_PRIMARY,
                          }}
                        >
                          PKR {room.price || "-"}
                        </td>

                        <td className="py-4 px-3 text-center">
                          <span
                            className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap"
                            style={{
                              background:
                                statusStyle.background,
                              color:
                                statusStyle.color,
                            }}
                          >
                            {room.status || "Unknown"}
                          </span>
                        </td>

                        <td className="py-4 px-3">
                          <div className="flex justify-center gap-2">
                            {/* EDIT */}
                            <Link
                              to={`/admin/rooms/edit/${room._id}`}
                              className="flex items-center gap-1.5 text-white px-3 py-2 text-sm transition-all duration-200 hover:scale-105 whitespace-nowrap"
                              style={{
                                background:
                                  COLORS.PRIMARY,
                                borderRadius:
                                  BORDER_RADIUS.MEDIUM,
                                textDecoration: "none",
                              }}
                            >
                              <Edit size={15} />
                              Edit
                            </Link>

                            {/* DELETE */}
                            <button
                              onClick={() =>
                                handleDelete(room._id)
                              }
                              disabled={
                                deletingId === room._id
                              }
                              className="flex items-center gap-1.5 text-white px-3 py-2 text-sm transition-all duration-200 hover:scale-105 disabled:opacity-50 whitespace-nowrap"
                              style={{
                                background:
                                  COLORS.ERROR,
                                borderRadius:
                                  BORDER_RADIUS.MEDIUM,
                              }}
                            >
                              <Trash2 size={15} />

                              {deletingId === room._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* =========================
              FOOTER
          ========================= */}
          {rooms.length > 0 && (
            <div
              className="flex flex-col sm:flex-row sm:justify-between gap-2 px-4 py-3"
              style={{
                borderTop:
                  `1px solid ${COLORS.BORDER}`,
                fontSize: "12px",
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              <span>
                Showing {filteredRooms.length} of{" "}
                {rooms.length} rooms
              </span>

              <span>
                Total {rooms.length} rooms in inventory
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default RoomsPage;