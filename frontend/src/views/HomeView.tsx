import Header from "../components/Header";
import SearchForm from "./SearchForm";
export default function HomeView() {
  return (
    <>
      <Header />

      <main>
        <div>
          <div>
            <h1 className="text-6xl font-bold">
              Todas tus <span className="text-cyan-400">Redes Sociales</span> en
              un solo enlace
            </h1>
            <p className="text-xl text-slate-300 mt-5">
              Crea un perfil personalizado con tus redes sociales favoritas y
              comparte tu enlace con el mundo.
            </p>
            <SearchForm />
          </div>
        </div>
      </main>
    </>
  );
}
