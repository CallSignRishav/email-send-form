import Link from "next/link";
import ModeToggle from "./ModeToggle";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b bg-background">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          EmailSend
        </Link>
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
