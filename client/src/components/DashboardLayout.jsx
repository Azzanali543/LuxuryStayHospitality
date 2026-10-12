import AsideBar from "./AsideBar";
import { COLORS, FONTS } from "../constants/theme";

const DashboardLayout = ({ children }) => {
  return (
    <div
      className="dashboard-shell flex min-h-screen w-full"
      style={{
        background: COLORS.BACKGROUND,
        fontFamily: FONTS.BODY,
      }}
    >
      <AsideBar />

      <main className="dashboard-main min-w-0 flex-1 overflow-x-hidden p-3 pt-16 sm:p-5 lg:p-8 lg:pt-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
