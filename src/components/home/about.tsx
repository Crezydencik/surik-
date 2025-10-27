"use client";

import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="bg-[#050119] text-white py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative h-[420px] sm:h-[520px]">
          {/* верхнее правое */}
          <div className="absolute right-0 top-0 w-[68%] sm:w-[62%] rotate-[4deg] z-10">
            <div className="relative h-[210px] sm:h-[270px] rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src="/aboutfoto2.png"
                alt="Board games 2"
                fill
                className="object-cover hover:scale-[1.03] transition-transform duration-500"
                sizes="(max-width: 1024px) 68vw, 32vw"
              />
            </div>
          </div>

          {/* верхнее левое */}
          <div className="absolute left-0 top-10 w-[70%] sm:w-[64%] -rotate-[5deg] z-0">
            <div className="relative h-[220px] sm:h-[280px] rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src="/aboutfoto2.png"
                alt="Board games 1"
                fill
                className="object-cover hover:scale-[1.03] transition-transform duration-500"
                sizes="(max-width: 1024px) 70vw, 34vw"
              />
            </div>
          </div>

          {/* нижняя центральная карточка поверх двух */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[78%] sm:w-[70%] -rotate-[1.5deg] z-20">
            <div className="relative h-[240px] sm:h-[320px] rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src="/aboutfoto2.png"
                alt="Board games 3"
                fill
                className="object-cover hover:scale-[1.03] transition-transform duration-500"
                sizes="(max-width: 1024px) 78vw, 36vw"
                priority
              />
            </div>
          </div>
        </div>
        {/* ТЕКСТ */}
        <div className="space-y-10">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-500">
              THE ABOUT
            </h3>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase text-purple-500">
              Cozy Place For Board Games
            </h2>
          </div>

          <p className="text-sm leading-relaxed text-gray-300 uppercase">
            Meeple Cave is a corner for tabletop fun! Here you will find
            everything for a complete board experience: a wide selection of
            games, active discussions, the possibility to organize game meetings
            and even sell your game finds. Trust us with your time and we will
            make it unforgettable!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h4 className="text-3xl font-bold text-purple-500">100+</h4>
              <p className="text-gray-300 text-sm">
                Board Games For Different Ages Are Available In Our Collection
              </p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-purple-500">40+</h4>
              <p className="text-gray-300 text-sm">
                Active Participants Representing Different Age Groups
              </p>
            </div>
          </div>
        </div>

        {/* КОЛЛАЖ ИЗ 3 ФОТО */}
      </div>
    </section>
  );
}
