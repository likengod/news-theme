import { Sparkles, Calendar, MapPin, Flame } from "lucide-react";

interface EventHeroSectionProps {
  eventTitle: string;
  eventSubtitle: string;
  eventDesc: string;
  eventDate: string;
  eventLocation: string;
  eventImageUrl?: string;
  eventGreeting: string;
  buttonText: string;
  isButtonEnabled: boolean;
  isFormEnabled: boolean;
}

export function EventHeroSection({
  eventTitle,
  eventSubtitle,
  eventDesc,
  eventDate,
  eventLocation,
  eventImageUrl,
  eventGreeting,
  buttonText,
  isButtonEnabled,
  isFormEnabled,
}: EventHeroSectionProps) {
  return (
    <section className="relative text-center py-6 md:py-10">
      {/* Ambient Festive Aura & Warm Golden Glow */}
      <div
        className="pointer-events-none absolute left-1/2 -top-12 -translate-x-1/2 w-full max-w-3xl h-80 bg-gradient-to-b from-amber-400/20 via-red-500/10 to-transparent blur-3xl -z-10 dark:from-amber-600/15 dark:via-red-900/10"
        aria-hidden="true"
      />

      {/* Durga Face Artwork (Natural & Cardless) */}
      {eventImageUrl && (
        <div className="mx-auto mb-4 flex justify-center">
          <img
            src={eventImageUrl}
            alt={eventTitle}
            className="h-28 sm:h-36 md:h-44 w-auto object-contain select-none"
          />
        </div>
      )}

      {/* Festive Sacred Salutation */}
      <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-red-500/15 to-amber-500/10 px-4 py-1.5 text-xs sm:text-sm font-serif font-bold text-amber-900 dark:text-amber-200 mb-4 tracking-wide shadow-xs">
        <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
        <span>{eventGreeting}</span>
        <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
      </div>

      {/* Grand Festive Headline */}
      <h1 className="font-serif text-3xl font-black tracking-tight text-red-800 dark:text-red-400 sm:text-5xl md:text-6xl drop-shadow-xs">
        {eventTitle}
      </h1>

      {/* Festive Subtitle */}
      <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base font-semibold text-amber-900 dark:text-amber-200">
        {eventSubtitle}
      </p>

      {/* Event Narrative */}
      <p className="mx-auto mt-4 max-w-3xl text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-stone-300">
        {eventDesc}
      </p>

      {/* Date & Location Badges */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold">
        <div className="flex items-center gap-2 rounded-full bg-amber-50 border border-amber-300/80 px-4 py-2 text-amber-950 dark:bg-[#20180b] dark:border-amber-700/60 dark:text-amber-200 shadow-xs">
          <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>{eventDate}</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-red-50 border border-red-300/80 px-4 py-2 text-red-950 dark:bg-[#230f0f] dark:border-red-800/60 dark:text-red-200 shadow-xs">
          <MapPin className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
          <span>{eventLocation}</span>
        </div>
      </div>

      {/* Festive CTA Button */}
      {isButtonEnabled && isFormEnabled && (
        <div className="mt-8">
          <a
            href="#register"
            className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-red-700 via-crimson-600 to-amber-600 px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-red-700/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-600/30 border border-amber-300/40"
          >
            <Flame className="h-4 w-4 text-amber-200 transition-transform group-hover:rotate-12" />
            <span>{buttonText}</span>
          </a>
        </div>
      )}
    </section>
  );
}
