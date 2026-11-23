export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="text-lg font-bold">Vydio</div>
      <ul className="flex space-x-4 text-sm font-medium">
        <li>
          <a href="/" className="hover:underline">
            Home
          </a>
        </li>
        <li>
          <a href="/watch" className="hover:underline">
            Watch
          </a>
        </li>
      </ul>
    </nav>
  );
}