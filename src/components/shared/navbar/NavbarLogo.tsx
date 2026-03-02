import Image from "next/image";
import Link from "next/link";
import logo from "../../../../public/win-you.me-logo.jpg";

const NavbarLogo = () => {
  return (
    <Link href="/" className="flex items-center">
      <div className="md:w-20 md:h-20 h-16 w-16">
        <Image
          src={logo}
          alt="WinYou Me Logo"
          width={100}
          height={100}
          className="rounded-xl object-contain"
          priority
        />
      </div>
    </Link>
  );
};

export default NavbarLogo;
