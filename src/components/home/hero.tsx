"use client";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Фон */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      >
        {/* затемнение/дымка */}
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />
        <div className="absolute inset-0 hero-vignette" />
      </div>

      {/* Парящие элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-24 left-12 w-14 h-14 rounded-full bg-fuchsia-500/15 animate-float" />
        <div
          className="absolute top-40 right-24 w-9 h-9 rounded-full bg-amber-400/15 animate-float"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute bottom-36 left-1/4 w-7 h-7 rounded-full bg-sky-400/15 animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Контент */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        {/* Подложка под заголовок (как на скрине) */}
        <div className="inline-block rounded-xl border border-white/10 bg-black/40 px-6 py-3 backdrop-blur-md shadow-gaming">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-fuchsia-400 via-amber-300 to-sky-400 bg-clip-text text-transparent animate-pulse-glow">
            Mapplecave
          </h1>
        </div>

        <p className="mt-6 text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12 ">
          Discover the world of board games at our cozy club. Over 500 games,
          friendly community and unforgettable evenings.
        </p>

        {/* Кнопки */}
        {/* <div className="mt-8 mb-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="gaming" size="lg" className="group">
            <Calendar className="mr-2 w-5 h-5 group-hover:animate-bounce" />
            Book a Table
          </Button>
          <Button variant="hero" size="lg" className="group">
            <GamepadIcon className="mr-2 w-5 h-5 group-hover:animate-spin" />
            Learn More
          </Button>
        </div> */}

        {/* Статистика (glassmorphism) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <StatCard
            value="500+"
            label="Настольных игр"
            accent="text-fuchsia-400"
          />
          <StatCard value="6" label="Игровых столов" accent="text-amber-300" />
          <StatCard
            value="1000+"
            label="Довольных игроков"
            accent="text-sky-400"
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-gradient-card/80 bg-black/30 p-6 backdrop-blur-md shadow-gaming hover:shadow-glow transition-all">
      <div className={`text-3xl font-extrabold mb-1 ${accent ?? ""}`}>
        {value}
      </div>
      <div className="text-white/70">{label}</div>
    </div>
  );
}
