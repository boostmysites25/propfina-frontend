type MobileHeaderProps = {
  toggleSidebar: () => void;
};

const MobileHeader = ({ toggleSidebar }: MobileHeaderProps) => {
  return (
    <header className="sticky top-0 left-0 w-full z-[100] bg-white shadow-sm p-4 flex justify-between md:justify-end items-center md:hidden">
      <button
        className="text-gray-600 hover:text-gray-800 focus:outline-none p-2 block md:hidden"
        onClick={toggleSidebar}
        aria-label="Open sidebar"
      >
        <i className="fas fa-bars text-xl"></i>
      </button>
      <h1 className="text-xl font-bold text-gray-800 md:hidden block">
        PropInfinia
      </h1>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
          <span className="text-sm">A</span>
        </div>
        <div className="text-start sm:block hidden">
          <div className="text-sm font-medium text-gray-800">admin</div>
          <div className="text-xs text-gray-500">admin@PropInfinia.com</div>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
