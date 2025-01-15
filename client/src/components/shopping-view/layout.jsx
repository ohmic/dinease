import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import FooterNew from "./footerNew";

function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full">
        <Outlet />
      </main>
      <FooterNew />
    </div>
  );
}

export default ShoppingLayout;
