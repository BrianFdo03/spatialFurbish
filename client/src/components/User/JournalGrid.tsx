import { useState } from "react";

export function JournalGrid() {
  const [active, setActive] = useState<number | null>(null);

  const journals = [
    {
      id: 1,
      image: "/journal/j1.png",
      category: "Skincare Rituals",
      title: "A considered approach to daily care",
      content:
        "Daily skincare rituals should be calm, intentional, and grounded in consistency. Taking time to care for skin supports balance and wellbeing.",
    },
    {
      id: 2,
      image: "/journal/j2.png",
      category: "Skincare Rituals",
      title: "Balancing skin through simple routines",
      content:
        "Simple routines reduce stress on the skin barrier and allow active ingredients to work more effectively over time.",
    },
    {
      id: 3,
      image: "/journal/j3.png",
      category: "Skincare Rituals",
      title: "Thoughtful formulations for every day",
      content:
        "Formulations designed for daily use should respect skin physiology while delivering lasting hydration.",
    },
  ];

  return (
    <section className="bg-[#fcfaf8] py-28 border-t">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-serif text-3xl mb-16">Our Journal</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
          {journals.map((item) => (
            <div
              key={item.id}
              className="relative"
              onMouseLeave={() => setActive(null)}
            >
              {/* JOURNAL CARD */}
              <div className="aspect-[4/3] bg-[#eae8e2] overflow-hidden mb-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              <p className="text-xs uppercase tracking-wide text-stone-500 mb-2">
                {item.category}
              </p>
              <h3 className="font-serif text-lg mb-2">
                {item.title}
              </h3>

              <button
                className="text-sm underline"
                onMouseEnter={() => setActive(item.id)}
                onClick={() => setActive(item.id)} // mobile
              >
                Read more
              </button>

              {/* POPUP — OUTSIDE CARD */}
              {active === item.id && (
                <div className="
                  absolute
                  left-0
                  -top-6
                  translate-y-[-100%]
                  z-30
                  w-[340px]
                  bg-white
                  rounded-2xl
                  shadow-[0_30px_60px_rgba(0,0,0,0.18)]
                  p-6
                  animate-popup
                ">
                  <p className="text-xs uppercase tracking-wide text-stone-500 mb-2">
                    {item.category}
                  </p>

                  <h4 className="font-serif text-lg mb-3">
                    {item.title}
                  </h4>

                  <p className="text-sm leading-relaxed text-stone-700">
                    {item.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ANIMATION */}
      <style>{`
        @keyframes popup {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-popup {
          animation: popup 0.25s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
