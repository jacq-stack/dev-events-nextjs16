import { getEvent } from "@/lib/api";
import Image from "next/image";

const Event = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  if (!slug) {
    return (
      <div className="min-h-[60vh] grid place-items-center bg-slate-100 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">No slug provided</h1>
          <p className="text-slate-600 mt-2">Please choose an event to open.</p>
        </div>
      </div>
    );
  }

  const event = await getEvent(slug);

  if (!event) {
    return (
      <div className="min-h-[60vh] grid place-items-center bg-slate-100 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Event not found</h1>
          <p className="text-slate-600 mt-2">The event you’re looking for doesn’t exist.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getModeBadgeColor = (mode: string) => {
    switch (mode) {
      case "hybrid":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "in-person":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "virtual":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const normalizeModeLabel = (mode: string) =>
    mode
      ?.split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") ?? "TBA";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Hero */}
      <section className="relative min-h-[420px] md:min-h-[520px] w-full overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-6 pb-10 pt-28 md:pb-14 md:pt-32">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold tracking-wide ${getModeBadgeColor(
                event.mode,
              )} bg-white/90 backdrop-blur`}
            >
              {normalizeModeLabel(event.mode)}
            </span>
            <h1 className="mt-4 max-w-4xl text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-white">
              {event.title}
            </h1>
            <p className="mt-4 max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed text-slate-100/95">
              {event.description}
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:pt-10">
        <section className="relative z-10 -mt-14 grid grid-cols-1 gap-4 sm:-mt-16 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm shadow-slate-900/5">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg">
                🗓
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Date</span>
            </div>
            <p className="text-lg font-semibold text-slate-900">{formatDate(event.date)}</p>
          </article>

          <article className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm shadow-slate-900/5">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg">
                ⏰
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Time</span>
            </div>
            <p className="text-lg font-semibold text-slate-900">{formatTime(event.time)}</p>
          </article>

          <article className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm shadow-slate-900/5">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center text-lg">
                📍
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Venue</span>
            </div>
            <p className="text-lg font-semibold text-slate-900">{event.venue}</p>
          </article>

          <article className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm shadow-slate-900/5">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg">
                🌍
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Location</span>
            </div>
            <p className="text-lg font-semibold text-slate-900">{event.location}</p>
          </article>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-5">
          <article className="lg:col-span-3 rounded-2xl bg-white p-6 md:p-7 border border-slate-200 shadow-sm shadow-slate-900/5">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-lg">👥</div>
              <h2 className="text-xl font-bold text-slate-900">Who Should Attend</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">{event.audience}</p>
          </article>

          <article className="lg:col-span-2 rounded-2xl bg-white p-6 md:p-7 border border-slate-200 shadow-sm shadow-slate-900/5">
            <h2 className="text-xl font-bold text-slate-900 mb-4">About This Event</h2>
            <p className="text-slate-600 leading-relaxed">{event.overview}</p>
          </article>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 md:p-7 border border-slate-200 shadow-sm shadow-slate-900/5">
          <h2 className="text-xl font-bold text-slate-900 mb-5">Event Agenda</h2>
          <div className="space-y-3">
            {event.agenda.map((item: string, index: number) => {
              const [time, ...rest] = item.split(" | ");
              return (
                <article
                  key={index}
                  className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                >
                  <div className="mt-1 h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex-shrink-0 flex items-center justify-center">
                    <span className="font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-slate-900 font-medium">{rest.join(" | ") || item}</p>
                    <p className="mt-1 text-sm font-semibold text-blue-700">{time}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 md:p-7 border border-slate-200 shadow-sm shadow-slate-900/5">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Event Tags</h2>
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 text-sm font-medium text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 md:p-7 border border-slate-200 shadow-sm shadow-slate-900/5">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Organizer</h2>
          <p className="text-slate-600 leading-relaxed">{event.organizer}</p>
        </section>
      </main>
    </div>
  );
};

export default Event;
