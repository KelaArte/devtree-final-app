import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/">
      <img src="/logo.svg" className="w-40 block" alt="Logo" />
    </Link>
  );
}
