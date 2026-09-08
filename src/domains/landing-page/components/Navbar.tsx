const navLinks = ["About", "Services", "Pricing", "Company", "Resources"];

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-14 py-4">
      <div className="flex items-center">
        <img
          src="/src/assets/skybank-logo.png"
          alt="Sky Bank Sierra Leone"
          className="h-14"
        />
      </div>

      <ul className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <li key={link}>
            <a
              href={`#${link.toLowerCase()}`}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        <a
          href="#login"
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Login
        </a>
        <a
          href="#register"
          className="px-5 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-full hover:bg-orange-600 transition-colors"
        >
          Register
        </a>
      </div>
    </nav>
  );
}
