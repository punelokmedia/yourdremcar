const HERO_VIDEO =
  "https://videos.pexels.com/video-files/7154208/7154208-hd_1920_1080_25fps.mp4";

export default function PageHero({
  eyebrow,
  title,
  description,
  videoSrc = HERO_VIDEO,
  imageSrc,
  actions,
  stats,
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-950/60 to-slate-950/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/20" />
      </div>

      <div className="relative z-[1] mx-auto flex min-h-[220px] max-w-6xl flex-col justify-end px-4 py-10 sm:min-h-[280px] sm:py-12 md:min-h-[400px] md:py-16">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-300 sm:text-[11px] sm:tracking-[0.24em]">
          {eyebrow}
        </p>
        <h1 className="mt-2 max-w-3xl text-[1.7rem] font-semibold leading-[1.15] tracking-tight text-blue-100 sm:mt-3 sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 md:text-[15px]">
            {description}
          </p>
        ) : null}
        {actions ? (
          <div className="mt-5 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 [&>a]:inline-flex [&>a]:w-full [&>a]:items-center [&>a]:justify-center sm:[&>a]:w-auto">
            {actions}
          </div>
        ) : null}
        {stats?.length ? (
          <div className="mt-6 flex flex-col gap-1.5 text-[12px] font-medium text-white/75 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-2">
            {stats.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
