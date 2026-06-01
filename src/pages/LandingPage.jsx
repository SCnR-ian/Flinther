import { useState, useEffect, useRef } from "react";
import FeedbackButton from "@/components/common/FeedbackButton";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

const C = {
  en: {
    nav: { features: "Features", pricing: "Pricing", login: "Log in", cta: "Get started", dashboard: "Dashboard", logout: "Log out" },
    hero: {
      pre: "Table tennis club management",
      title: "Run your club,\nnot spreadsheets.",
      sub: "Court bookings, coaching schedules, and social sessions — managed from one place by your admin and coaches.",
      cta: "Get started",
      hint: "Built for table tennis clubs",
    },
    feat: {
      title: "Everything your team needs.",
      sub: "One tool for admins and coaches. No spreadsheets.",
      items: [
        { title: "Court bookings",      sub: "View and manage all court bookings in a daily calendar. See exactly what's booked and what's free at a glance.", emoji: "🏓" },
        { title: "Coaching",            sub: "Schedule 1-on-1 and group coaching sessions. Coaches log in to see their own timetable.", emoji: "🎯" },
        { title: "Social play",         sub: "Create social play sessions and manage participants. Perfect for open group sessions.", emoji: "🤝" },
        { title: "Member management",   sub: "Add and manage your members. Keep track of who's coaching with who.", emoji: "👥" },
        { title: "Shared schedule",     sub: "Share a live daily schedule link with your whole team — no login needed, always up to date.", emoji: "📅" },
        { title: "Conflict detection",  sub: "Change opening hours or court count with confidence — flags affected sessions before you save.", emoji: "⚡" },
      ],
    },
    how: {
      title: "From signup to live\nin minutes.",
      steps: [
        { n: "01", title: "Create an account", sub: "Sign up with your email. No credit card needed." },
        { n: "02", title: "Set up your club",  sub: "Add your club name, courts, and opening hours." },
        { n: "03", title: "Go live",           sub: "Get yourclub.flinther.com. Share it and start taking bookings." },
      ],
    },
    pricing: {
      title: "Simple pricing.",
      sub: "Free while we're in early access.",
      plans: [
        {
          name: "Free Trial",
          price: "$0",
          period: "/mo",
          desc: "Full access. No credit card required.",
          dark: true,
          badge: "Available now",
          features: ["Unlimited members", "Unlimited courts", "Court booking", "Coaching system", "Online payments", "Analytics"],
          cta: "Start free trial",
          href: "/register",
        },
        {
          name: "Pro",
          price: "TBA",
          period: "",
          desc: "For growing clubs.",
          dark: false,
          badge: "Coming soon",
          comingSoon: true,
          features: ["Everything in Free", "Priority support", "Custom domain", "Advanced analytics"],
          cta: "Coming soon",
        },
        {
          name: "Enterprise",
          price: "Custom",
          period: "",
          desc: "For multi-venue operators.",
          dark: false,
          badge: "Coming soon",
          comingSoon: true,
          features: ["Multiple venues", "API access", "Dedicated support", "Custom integrations"],
          cta: "Coming soon",
        },
      ],
    },
    cta2: {
      title: "Simple. Focused. Built for table tennis.",
      sub: "Everything your admin and coaches need — nothing they don't.",
      btn: "Get started",
    },
    footer: { tag: "Club management for table tennis.", copy: "© 2026 Flinther" },
  },
  zh: {
    nav: { features: "功能", pricing: "定價", login: "登入", cta: "免費開始", dashboard: "後台", logout: "登出" },
    hero: {
      pre: "桌球館管理系統",
      title: "管好球館，\n不再靠試算表。",
      sub: "場地預訂、教練排課、社交活動——管理員和教練在同一個地方搞定所有事。",
      cta: "開始使用",
      hint: "專為桌球館打造",
    },
    feat: {
      title: "你的團隊需要的一切。",
      sub: "一個工具給管理員和教練用。不再用試算表。",
      items: [
        { title: "場地預訂",    sub: "用日曆檢視所有場地預訂狀況，一目了然知道哪些時段有空。", emoji: "🏓" },
        { title: "教練排課",    sub: "安排一對一和團體課。教練登入後看到自己的專屬課表。", emoji: "🎯" },
        { title: "社交活動",    sub: "建立社交場次、管理參與者。適合開放式團體練習。", emoji: "🤝" },
        { title: "會員管理",    sub: "新增和管理會員資料，追蹤誰在跟哪位教練上課。", emoji: "👥" },
        { title: "共享班表",    sub: "把即時班表連結分享給全體教練——不用登入，隨時是最新狀態。", emoji: "📅" },
        { title: "衝突偵測",    sub: "修改開放時間或球桌數量前，系統自動找出受影響的課程。", emoji: "⚡" },
      ],
    },
    how: {
      title: "從申請到上線，\n只需幾分鐘。",
      steps: [
        { n: "01", title: "建立帳號",  sub: "用 Email 註冊，不需要信用卡。" },
        { n: "02", title: "設定球館",  sub: "填入名稱、球桌數量與營業時間。" },
        { n: "03", title: "正式上線",  sub: "獲得 yourclub.flinther.com，分享出去，開始接受預訂。" },
      ],
    },
    pricing: {
      title: "簡單的定價。",
      sub: "搶先體驗期間完全免費。",
      plans: [
        {
          name: "免費試用",
          price: "$0",
          period: "/月",
          desc: "全功能開放，無需信用卡。",
          dark: true,
          badge: "現在可用",
          features: ["無限會員", "無限球桌", "球桌預訂", "教練系統", "線上付款", "數據分析"],
          cta: "開始免費試用",
          href: "/register",
        },
        {
          name: "Pro",
          price: "即將推出",
          period: "",
          desc: "適合成長中的球館。",
          dark: false,
          badge: "即將推出",
          comingSoon: true,
          features: ["包含免費版全部功能", "優先支援", "自訂網域", "進階數據分析"],
          cta: "即將推出",
        },
        {
          name: "企業版",
          price: "自訂報價",
          period: "",
          desc: "適合多場館經營者。",
          dark: false,
          badge: "即將推出",
          comingSoon: true,
          features: ["多場館管理", "API 存取", "專屬支援", "客製整合"],
          cta: "即將推出",
        },
      ],
    },
    cta2: {
      title: "簡單。專注。專為桌球打造。",
      sub: "管理員和教練需要的都在這，不需要的一概沒有。",
      btn: "開始使用",
    },
    footer: { tag: "桌球館管理系統", copy: "© 2026 Flinther" },
  },
};

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

const SLIDES = [
  { src: "/ss1.png", alt: "Admin dashboard", url: "flinther.com" },
];

function Screenshots() {
  const [idx, setIdx] = useState(0);
  const slide = SLIDES[idx];
  return (
    <div className="w-full max-w-5xl mx-auto select-none">
      <div className="rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.10)] border border-gray-200">
        <div className="bg-[#f0f0ee] px-5 py-3 flex items-center gap-3 border-b border-gray-200">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 bg-white rounded-md px-4 py-1 text-xs text-gray-400 font-mono max-w-xs mx-auto text-center">
            {slide.url ?? ""}
          </div>
        </div>
        <div className="relative w-full" style={{ paddingBottom: "50%" }}>
          {SLIDES.map((s, i) => (
            <img
              key={s.src} src={s.src} alt={s.alt}
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
              style={{ opacity: i === idx ? 1 : 0, pointerEvents: i === idx ? "auto" : "none" }}
              loading="lazy"
            />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-5 mt-6">
        <button onClick={() => setIdx(i => (i - 1 + SLIDES.length) % SLIDES.length)}
          className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-400 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`rounded-full transition-all ${i === idx ? "w-5 h-2 bg-gray-900" : "w-2 h-2 bg-gray-200 hover:bg-gray-400"}`} />
          ))}
        </div>
        <button onClick={() => setIdx(i => (i + 1) % SLIDES.length)}
          className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-400 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [lang, setLang] = useState("en");
  const [loggedIn, setLoggedIn] = useState(false);
  const [dashboardHref, setDashboardHref] = useState("/dashboard");
  const c = C[lang];

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
    if (token) {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (user?.role === "coach") setDashboardHref("/coach");
        else if (user?.role === "admin" || user?.platform_owner) setDashboardHref("/admin");
        else setDashboardHref("/dashboard");
      } catch { /* ignore */ }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <div className="bg-white text-gray-900 antialiased overflow-x-hidden" style={{ fontFamily: '"DM Sans", sans-serif' }}>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between relative">
          <span className="font-medium text-xl tracking-tight" style={{ fontFamily: '"Kanit", sans-serif' }}>
            Flinther
          </span>
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-sm text-gray-500">
            <a href="#features" className="hover:text-gray-900 transition-colors">{c.nav.features}</a>
            <a href="#pricing"  className="hover:text-gray-900 transition-colors">{c.nav.pricing}</a>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(l => l === "en" ? "zh" : "en")}
              className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {lang === "en" ? "中文" : "EN"}
            </button>
            {loggedIn ? (
              <>
                <a href={dashboardHref} className="text-sm text-gray-500 hover:text-gray-900 px-3 py-1.5 transition-colors">
                  {c.nav.dashboard}
                </a>
                <button
                  onClick={handleLogout}
                  className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  {c.nav.logout}
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="text-sm text-gray-500 hover:text-gray-900 px-3 py-1.5 transition-colors">
                  {c.nav.login}
                </a>
                <a href="/register" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-black transition-colors font-medium">
                  {c.nav.cta}
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-block text-xs font-medium text-gray-500 border border-gray-200 px-3.5 py-1.5 rounded-full mb-8">
          {c.hero.pre}
        </div>
        <h1 className="text-6xl md:text-8xl font-normal leading-[0.95] tracking-[-0.04em] text-gray-900 mb-8 whitespace-pre-line"
          style={{ fontFamily: '"Kanit", sans-serif' }}>
          {c.hero.title}
        </h1>
        <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-lg mx-auto mb-10">
          {c.hero.sub}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="/register" className="bg-gray-900 text-white px-8 py-3.5 rounded-xl font-medium text-sm hover:bg-black transition-colors">
            {c.hero.cta}
          </a>
          <a href="#features" className="text-sm text-gray-500 hover:text-gray-900 px-6 py-3.5 transition-colors">
            {lang === "en" ? "See how it works →" : "了解功能 →"}
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-4">{c.hero.hint}</p>
      </section>

      {/* Screenshots */}
      <section className="pb-28 px-6">
        <Reveal><Screenshots /></Reveal>
      </section>

      {/* Features */}
      <section id="features" className="py-28 px-6 bg-[#fafafa] border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-normal tracking-tight text-gray-900 mb-3"
              style={{ fontFamily: '"Kanit", sans-serif' }}>
              {c.feat.title}
            </h2>
            <p className="text-gray-400 text-sm">{c.feat.sub}</p>
          </Reveal>

          {/* Top 2 — larger */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {c.feat.items.slice(0, 2).map((f, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all h-full">
                  <div className="text-4xl mb-5">{f.emoji}</div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Bottom 4 — smaller */}
          <div className="grid md:grid-cols-4 gap-4">
            {c.feat.items.slice(2).map((f, i) => (
              <Reveal key={i} delay={(i + 2) * 0.07}>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all h-full">
                  <div className="text-2xl mb-4">{f.emoji}</div>
                  <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">{f.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{f.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* Pricing */}
      <section id="pricing" className="py-28 px-6 bg-[#fafafa] border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-normal tracking-tight text-gray-900 mb-3"
              style={{ fontFamily: '"Kanit", sans-serif' }}>
              {c.pricing.title}
            </h2>
            <p className="text-gray-400 text-sm">{c.pricing.sub}</p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4">
            {c.pricing.plans.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className={`rounded-2xl p-7 border relative flex flex-col h-full ${p.dark ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-100"} ${p.comingSoon ? "opacity-60" : ""}`}>
                  {p.badge && (
                    <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-medium px-3 py-1 rounded-full border whitespace-nowrap ${p.dark ? "bg-white text-gray-900 border-white" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                      {p.badge}
                    </span>
                  )}
                  <div className="mb-6">
                    <p className={`text-xs font-medium tracking-widest uppercase mb-3 ${p.dark ? "text-gray-400" : "text-gray-400"}`}>
                      {p.name}
                    </p>
                    <p className={`text-4xl font-normal mb-1 ${p.dark ? "text-white" : "text-gray-900"}`}
                      style={{ fontFamily: '"Kanit", sans-serif' }}>
                      {p.price}
                      <span className={`text-sm font-normal ml-1 ${p.dark ? "text-gray-500" : "text-gray-400"}`}>{p.period}</span>
                    </p>
                    <p className={`text-sm ${p.dark ? "text-gray-400" : "text-gray-500"}`}>{p.desc}</p>
                  </div>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {p.features.map((f, j) => (
                      <li key={j} className={`flex items-center gap-2 text-sm ${p.dark ? "text-gray-300" : "text-gray-600"}`}>
                        <span className={`text-base ${p.dark ? "text-gray-500" : "text-gray-300"}`}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  {p.comingSoon ? (
                    <div className={`block text-center py-3 rounded-xl text-sm font-medium cursor-not-allowed ${p.dark ? "bg-gray-700 text-gray-500" : "bg-gray-100 text-gray-400"}`}>
                      {p.cta}
                    </div>
                  ) : (
                    <a href={p.href || "/register"}
                      className={`block text-center py-3 rounded-xl text-sm font-medium transition-colors ${p.dark ? "bg-white text-gray-900 hover:bg-gray-100" : "bg-gray-900 text-white hover:bg-black"}`}>
                      {p.cta}
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-gray-900">
        <Reveal className="text-center max-w-xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-normal tracking-tight text-white mb-5 whitespace-pre-line"
            style={{ fontFamily: '"Kanit", sans-serif' }}>
            {c.cta2.title}
          </h2>
          <p className="text-gray-400 mb-10">{c.cta2.sub}</p>
          <a href="/register"
            className="inline-block bg-white text-gray-900 px-8 py-4 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors">
            {c.cta2.btn}
          </a>
        </Reveal>
      </section>

      <FeedbackButton page="landing" />

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-900" style={{ fontFamily: '"Kanit", sans-serif' }}>Flinther</span>
            <span className="text-sm text-gray-400">{c.footer.tag}</span>
          </div>
          <p className="text-xs text-gray-400">{c.footer.copy}</p>
        </div>
      </footer>
    </div>
  );
}
