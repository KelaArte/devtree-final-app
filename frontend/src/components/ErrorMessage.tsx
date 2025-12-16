type ErrorMessageProps = {
  children: React.ReactNode;
};

export default function ErrorMessage({ children }: ErrorMessageProps) {
  return (
    // bg-red-900/50: Rojo oscuro semitransparente
    // text-red-200: Texto rojo claro para legibilidad
    // border-l-4: Línea lateral para énfasis
    <p className="bg-red-900/40 border-l-4 border-red-500 text-red-200 p-3 uppercase text-sm font-bold text-center mt-2 rounded-r-lg">
      {children}
    </p>
  );
}
