import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { COLORS, FONTS } from "../constants/theme";
import { ROLES } from "../constants/roles";
import { SIDEBAR_WIDTH } from "../constants/layout";
import Logo from "../assets/Logo.png";

import {
  CircleUserRound,
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  UserCog,
  CreditCard,
  BarChart2,
  ClipboardList,
  ClipboardCheck,
  Wrench,
  LogOut,
  ConciergeBell,
  Menu,
  X,
} from "lucide-react";

const SIDEBAR_LINKS = {
  [ROLES.ADMIN]: [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      name: "Staff",
      icon: UserCog,
      path: "/admin/staff-management",
    },
    {
      name: "Maintenance",
      icon: Wrench,
      path: "/housekeeping/maintenance",
    },
    {
      name: "HouseKeeping",
      icon: ClipboardList,
      path: "/housekeeping/dashboard",
    },
    {
      name: "Rooms",
      icon: BedDouble,
      path: "/admin/rooms",
    },
    {
      name: "RequestService",
      icon: ConciergeBell,
      path: "/admin/services",
    },
    {
      name: "Services",
      icon: CircleUserRound,
      path: "/admin/services/catalog",
    },
    {
      name: "Bookings",
      icon: CalendarCheck,
      path: "/admin/bookings",
    },
    {
      name: "Billing",
      icon: CreditCard,
      path: "/admin/billing",
    },
    {
      name: "Reports",
      icon: BarChart2,
      path: "/admin/reports",
    },
    {
      name: "Profile",
      icon: CircleUserRound,
      path: "/profile",
    },
  ],

  [ROLES.MANAGER]: [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/manager/dashboard",
    },
    {
      name: "Staff",
      icon: UserCog,
      path: "/admin/staff-management",
    },
    {
      name: "Maintenance",
      icon: Wrench,
      path: "/housekeeping/maintenance",
    },
    {
      name: "Requests",
      icon: ClipboardList,
      path: "/housekeeping/dashboard",
    },
    {
      name: "Bookings",
      icon: CalendarCheck,
      path: "/admin/bookings",
    },
    {
      name: "Billing",
      icon: CreditCard,
      path: "/admin/billing",
    },
    {
      name: "Profile",
      icon: CircleUserRound,
      path: "/profile",
    },
  ],

  [ROLES.RECEPTIONIST]: [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/receptionist/dashboard",
    },
    {
      name: "Rooms",
      icon: BedDouble,
      path: "/admin/rooms",
    },
    {
      name: "Bookings",
      icon: CalendarCheck,
      path: "/receptionist/bookings",
    },
    {
      name: "Check In/Out",
      icon: ClipboardCheck,
      path: "/receptionist/checkinout",
    },
    {
      name: "Billing",
      icon: CreditCard,
      path: "/receptionist/billing",
    },
  ],

  [ROLES.HOUSEKEEPING]: [
    {
      name: "My Tasks",
      icon: ClipboardList,
      path: "/housekeeping/dashboard",
    },
    {
      name: "Maintenance",
      icon: Wrench,
      path: "/housekeeping/maintenance",
    },
  ],
};

function AsideBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const menuItems = SIDEBAR_LINKS[user?.role] || [];

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* =====================================================
          MOBILE MENU BUTTON
      ====================================================== */}
      <button
        type="button"
        className="
          lg:hidden
          fixed
          top-3
          left-3
          z-50
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-lg
          shadow-lg
        "
        style={{
          background: COLORS.PRIMARY,
          color: COLORS.CREAM,
        }}
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}
      {open && (
        <div
          className="
            lg:hidden
            fixed
            inset-0
            z-40
            bg-black/40
          "
          onClick={() => setOpen(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <aside
        className={`
          flex
          flex-col
          fixed
          lg:sticky
          top-0
          z-50
          lg:z-auto
          h-screen
          transition-transform
          duration-200
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0
        `}
        style={{
          width: SIDEBAR_WIDTH,
          background: COLORS.PRIMARY,
          color: COLORS.CREAM,

          /* NO INTERNAL SCROLLBAR */
          overflow: "hidden",

          flexShrink: 0,
        }}
      >
        {/* =================================================
            LOGO / HEADER
        ================================================== */}
        <div
          className="
            flex-shrink-0
            px-4
            py-3
          "
          style={{
            borderBottom:
              "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <img
              src={Logo}
              alt="LuxuryStay Logo"
              className="
                w-9
                h-9
                object-contain
              "
            />

            <div>
              <h1
                className="
                  text-[17px]
                  font-semibold
                  leading-none
                "
                style={{
                  fontFamily: FONTS.HEADING,
                }}
              >
                LuxuryStay
              </h1>

              <p
                className="
                  text-[9px]
                  mt-1
                "
                style={{
                  color: COLORS.ACCENT,
                  fontFamily: FONTS.BODY,
                }}
              >
                Hotel Management
              </p>
            </div>

            {/* Mobile Close */}
            <button
              type="button"
              className="
                ml-auto
                lg:hidden
                p-1
              "
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              style={{
                color: COLORS.CREAM,
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* =================================================
            MENU
        ================================================== */}
        <div
          className="
            flex-1
            px-2.5
            py-3
            min-h-0
          "
        >
          {/* FIRST TAB / SECTION */}
          <p
            className="
              text-[8px]
              uppercase
              tracking-[0.18em]
              mb-2
              px-2.5
            "
            style={{
              color: "rgba(243,229,216,0.55)",
              fontFamily: FONTS.BODY,
            }}
          >
            Main Menu
          </p>

          {/* MENU ITEMS */}
          <ul className="space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `
                        flex
                        items-center
                        gap-2.5
                        px-3
                        py-2
                        rounded-lg
                        transition-all
                        duration-200
                        ${
                          isActive
                            ? ""
                            : "hover:bg-white/10 hover:translate-x-1"
                        }
                      `
                    }
                    style={({ isActive }) => ({
                      background: isActive
                        ? COLORS.ACCENT
                        : "transparent",

                      color: isActive
                        ? COLORS.PRIMARY
                        : COLORS.CREAM,

                      fontFamily: FONTS.BODY,

                      fontSize: "12px",
                    })}
                  >
                    <Icon size={17} />

                    <span className="font-medium">
                      {item.name}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        {/* =================================================
            LOGOUT
        ================================================== */}
        <div
          className="
            flex-shrink-0
            px-2.5
            pb-3
            pt-2
          "
          style={{
            borderTop:
              "1px solid rgba(255,255,255,0.1)",
            background: COLORS.PRIMARY,
          }}
        >
          <button
            onClick={handleLogout}
            className="
              w-full
              flex
              items-center
              justify-center
              gap-2
              py-2
              rounded-lg
              font-semibold
              transition-all
              duration-200
              hover:brightness-110
              hover:scale-[1.02]
            "
            style={{
              background: COLORS.ACCENT,
              color: COLORS.PRIMARY,
              fontFamily: FONTS.BODY,
              fontSize: "12px",
            }}
          >
            <LogOut size={17} />

            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default AsideBar;