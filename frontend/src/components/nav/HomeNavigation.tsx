import { Link } from "react-router-dom";

export default function HomeNavigation() {
  return (
    <>
      <Link to="/auth/login">Iniciar Sesión</Link>
      <Link to="/auth/register">Registrarse</Link>
    </>
  );
}
