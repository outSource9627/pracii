import { Reveal } from "@/components/ui/reveal";
import { SplitWords } from "@/components/ui/split-words";
import { cn } from "@/lib/motion";

/** Section opener: small mono label, a calm two-tone headline, optional lead paragraph. */
export function Intro({
  eyebrow,
  title,
  muted,
  children,
  align = "left",
  dark = false,
  size = "md",
  className,
}: {
  eyebrow: string;
  title: string;
  muted?: string;
  children?: React.ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-3xl", className)}>
      <Reveal>
        <p className={cn("eyebrow", dark ? "text-white/55" : "text-body")}>{eyebrow}</p>
      </Reveal>
      <h2
        className={cn(
          "font-display mt-6 leading-[1.04]",
          size === "lg" ? "text-[clamp(2.6rem,5.2vw,5.2rem)]" : "text-[clamp(2.2rem,3.8vw,3.8rem)]",
          dark && "text-white",
        )}
      >
        <SplitWords text={title} stagger={0.04} />
        {muted && (
          <>
            {" "}
            <span className={dark ? "text-white/40" : "text-[#b3ada0]"}>
              <SplitWords text={muted} stagger={0.04} delay={0.2} />
            </span>
          </>
        )}
      </h2>
      {children && (
        <Reveal delay={0.1}>
          <div
            className={cn(
              "mt-6 text-[1.08rem] leading-[1.65]",
              dark ? "text-white/60" : "text-body",
              align === "center" && "mx-auto max-w-[36rem]",
            )}
          >
            {children}
          </div>
        </Reveal>
      )}
    </div>
  );
}

/** Big two-tone statement line. */
export function Statement({
  text,
  muted,
  className,
  dark = false,
}: {
  text: string;
  muted?: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <p className={cn("font-display text-[clamp(2.2rem,4.2vw,4.2rem)] leading-[1.05]", dark ? "text-white" : "text-ink", className)}>
      <SplitWords text={text} stagger={0.04} />
      {muted && (
        <>
          {" "}
          <span className={dark ? "text-white/40" : "text-[#b3ada0]"}>
            <SplitWords text={muted} stagger={0.04} delay={0.2} />
          </span>
        </>
      )}
    </p>
  );
}

/** Small honest label for what an image is: CAD, real photo, visualization, concept. */
export function Tag({ children, tone = "light", className }: { children: React.ReactNode; tone?: "light" | "dark"; className?: string }) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[0.56rem] backdrop-blur-md",
        tone === "light" ? "bg-white/85 text-ink ring-1 ring-ink/[0.07]" : "bg-black/35 text-white ring-1 ring-white/15",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-sky" />
      {children}
    </span>
  );
}
