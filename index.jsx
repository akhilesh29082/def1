import { useEffect, useRef, useState } from "react";

/**
 * WITHX Innovations Private Limited — Homepage
 * React port of the original static index.html.
 *
 * Notes on the conversion:
 * - All vanilla JS (cookie banner, mobile nav drawer, mega-menu product list,
 *   systems popup, animated counters, custom drone cursor) is reimplemented
 *   with React state + useEffect instead of direct DOM manipulation.
 * - CSS is unchanged from the original file and lives in the <style> tag
 *   below, scoped with the same class names.
 * - Local image paths (images/withx defence logo.png, images/withx-logo.png)
 *   are kept as-is — place those files in your /public/images folder, or
 *   swap in your own asset URLs / imports.
 */

function AnimatedCounter({ target, suffix }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            let current = 0;
            const step = () => {
              current++;
              setCount(current);
              if (current < target) requestAnimationFrame(step);
            };
            step();
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div className="mission-num">
      <span className="counter" ref={ref}>
        {count}
      </span>
      <span className="suffix">{suffix}</span>
    </div>
  );
}

export default function WithxHomepage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mnavSystemsOpen, setMnavSystemsOpen] = useState(false);
  const [productListOpen, setProductListOpen] = useState(false);
  const [systemsPopupOpen, setSystemsPopupOpen] = useState(false);
  const [cookieVisible, setCookieVisible] = useState(false);

  const systemsWrapperRef = useRef(null);
  const cursorRef = useRef(null);

  // Cookie banner: show after a short delay, like the original setTimeout
  useEffect(() => {
    const t = setTimeout(() => setCookieVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  // Close the "Our Systems" popup on outside click
  useEffect(() => {
    function handleClick(e) {
      if (
        systemsWrapperRef.current &&
        !systemsWrapperRef.current.contains(e.target)
      ) {
        setSystemsPopupOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.classList.toggle("nav-open", mobileNavOpen);
  }, [mobileNavOpen]);

  // Custom drone cursor (desktop only), matches original behavior
  useEffect(() => {
    if (!window.matchMedia("(min-width: 901px)").matches) return;

    const cursor = document.createElement("div");
    cursor.id = "drone-cursor";
    document.body.appendChild(cursor);
    cursorRef.current = cursor;

    const droneUrl =
      "https://static.vecteezy.com/system/resources/thumbnails/049/514/995/small/drone-hovering-in-mid-air-above-a-landscape-during-daylight-cut-out-transparent-png.png";
    cursor.style.backgroundImage = `url('${droneUrl}')`;

    let mx = 0,
      my = 0,
      cx = 0,
      cy = 0;
    const speed = 0.1;
    let rafId;

    function handleMove(e) {
      mx = e.clientX;
      my = e.clientY;
    }
    document.addEventListener("mousemove", handleMove);

    function animate() {
      cx += (mx - cx) * speed;
      cy += (my - cy) * speed;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      rafId = requestAnimationFrame(animate);
    }
    animate();

    const hoverTargets = document.querySelectorAll(
      "a, button, .domain, .news-card, .tech-row"
    );
    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.style.backgroundImage = `url('${droneUrl}')`;
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", handleMove);
      cursor.remove();
    };
  }, []);

  function closeMobileNav() {
    setMobileNavOpen(false);
  }

  return (
    <>
      <style>{`
        :root{
          --bg:#FFFFFF;
          --panel:#F8FAFC;
          --ink:#111827;
          --muted:#4B5563;
          --line:#E5E7EB;
          --accent:#8A6D1E;
          --overlay:rgba(17,24,39,0.55);
          --card-shadow:0 8px 30px rgba(0,0,0,0.08);
        }
        *{margin:0;padding:0;box-sizing:border-box;}
        .withx-root, .withx-root body { background: var(--bg); }
        .withx-root{
          background: var(--bg);
          color: var(--ink);
          font-family: "Times New Roman", Times, serif;
          overflow-x: hidden;
        }
        .withx-root a{color:inherit; text-decoration:none;}
        .withx-root img{display:block; width:100%; height:100%; object-fit:cover;}
        .withx-root .wrap{padding-left:clamp(20px,5vw,64px); padding-right:clamp(20px,5vw,64px);}

        .withx-root .eyebrow{
          display:flex; align-items:center; gap:14px;
          font-size:11px; letter-spacing:3px; color:var(--muted); text-transform:uppercase;
          margin-bottom:26px;
        }
        .withx-root .eyebrow .rule{width:34px; height:1px; background:var(--muted); display:inline-block;}

        /* ---------- NAV ---------- */
        .withx-root header{
          position:fixed; top:0; left:0; width:100%; z-index:70;
          display:flex; align-items:center; justify-content:space-between; gap:24px;
          padding:22px clamp(20px,5vw,64px);
          font-family: "Times New Roman", Times, serif; font-weight:600;
          background:rgba(255,255,255,0.92); backdrop-filter:blur(8px);
          border-bottom:1px solid var(--line); box-shadow:0 2px 12px rgba(17,24,39,0.05);
        }
        .withx-root .brand{display:flex; align-items:center; gap:14px;}
        .withx-root .brand-logo{height:56px; width:auto; flex-shrink:0;}
        .withx-root .brand-logo img{display:block;width:auto;max-width:100%;height:100%;object-fit:contain;opacity:1;visibility:visible;}
        .withx-root .footer-brand-logo{height:60px; width:auto; flex-shrink:0;}
        .withx-root .footer-brand-logo img{display:block;width:auto;max-width:100%;height:100%;object-fit:contain;opacity:1;visibility:visible;}
        @media (max-width:480px){ .withx-root .brand-logo{height:42px;} }
        .withx-root .menu-btn{display:flex; flex-direction:column; gap:6px; cursor:pointer; padding:8px; z-index:110;}
        .withx-root .menu-btn span{width:26px; height:1.5px; background:var(--ink); display:block; transition:transform .3s ease, opacity .3s ease;}
        .withx-root .menu-btn span:last-child{width:16px;}
        .withx-root .menu-btn.open span:first-child{transform:translateY(3.5px) rotate(45deg); width:24px;}
        .withx-root .menu-btn.open span:last-child{transform:translateY(-3.5px) rotate(-45deg); width:24px;}

        /* ---------- NAV LINKS + MEGA MENU (desktop) ---------- */
        .withx-root .nav-links{display:flex; align-items:center; gap:36px;}
        .withx-root .nav-link{font-size:12px; font-weight:700;  letter-spacing:2px; text-transform:uppercase; color:var(--ink); opacity:.85; transition:opacity .2s;}
        .withx-root .nav-link:hover{opacity:1;}
        .withx-root .mega-item{position:relative;}
        .withx-root .mega-item > a{font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; cursor:pointer; color:var(--ink); opacity:.85;}
        .withx-root .mega-item:hover > a{opacity:1;}
        .withx-root .mega-menu{
          position:fixed; top:96px; left:0; width:100%; background:#FFFFFF; color:var(--ink);
          padding:50px clamp(20px,5vw,64px); display:grid; grid-template-columns:1.2fr 1fr; gap:80px;
          opacity:0; visibility:hidden; transform:translateY(-14px);
          transition:opacity .3s ease, transform .3s ease, visibility .3s ease;
          z-index:60; border-top:1px solid var(--line); border-bottom:1px solid var(--line);
          box-shadow:0 20px 45px rgba(17,24,39,0.10);
        }
        .withx-root .mega-item:hover .mega-menu, .withx-root .mega-item.active .mega-menu{opacity:1; visibility:visible; transform:translateY(0);}
        .withx-root .mega-col h4{font-size:11px; letter-spacing:2px; color:var(--muted); margin-bottom:20px; text-transform:uppercase;}
        .withx-root .mega-col p{font-size:16px; line-height:1.6; max-width:420px; color:var(--muted);}
        .withx-root .product-toggle{background:transparent; border:none; color:var(--ink); font-family: "Times New Roman", Times, serif; font-size:16px; font-weight:600; cursor:pointer; padding:0; transition:all .3s ease;}
        .withx-root .product-toggle:hover, .withx-root .product-toggle.active{color:var(--accent); transform:translateX(6px);}
        .withx-root .product-list{display:none; margin-top:12px; padding-left:20px; border-left:1px solid var(--line);}
        .withx-root .product-list.show{display:block;}
        .withx-root .product-list a{display:block; font-size:14px; margin-bottom:10px; color:var(--muted); transition:all .3s ease;}
        .withx-root .product-list a:hover{color:var(--ink); transform:translateX(6px);}
        .withx-root .nav-touch{padding:11px 24px; font-size:11px; letter-spacing:2px; border:1px solid var(--ink); flex-shrink:0;}
        .withx-root .nav-touch a{text-decoration:none;}
        @media (max-width:1000px){ .withx-root .nav-links, .withx-root .nav-touch{display:none;} }
        @media (min-width:1001px){ .withx-root .menu-btn{display:none;} }

        /* ---------- MOBILE NAV DRAWER ---------- */
        .withx-root .mobile-nav{
          position:fixed; inset:0; z-index:95; background:#FFFFFF;
          display:flex; flex-direction:column; justify-content:center;
          padding:110px clamp(24px,8vw,64px) 60px;
          transform:translateX(100%);
          transition:transform .45s cubic-bezier(.16,1,.3,1);
          overflow-y:auto;
        }
        .withx-root .mobile-nav.open{transform:translateX(0);}
        .withx-root .mobile-nav-links a{
          display:block; font-family: "Times New Roman", Times, serif; font-weight:700;
          font-size:clamp(26px,8vw,38px); text-transform:uppercase; letter-spacing:0.5px;
          padding:16px 0; border-bottom:1px solid var(--line); color:var(--ink);
        }
        .withx-root .mnav-systems{border-bottom:1px solid var(--line);}
        .withx-root .mnav-systems-toggle{
          display:flex; align-items:center; justify-content:space-between;
          font-family: "Times New Roman", Times, serif; font-weight:700; width:100%;
          font-size:clamp(26px,8vw,38px); text-transform:uppercase; letter-spacing:0.5px;
          padding:16px 0; color:var(--ink); background:none; border:none; cursor:pointer;
        }
        .withx-root .mnav-systems-toggle i{font-size:16px; color:var(--muted); transition:transform .3s ease;}
        .withx-root .mnav-systems-toggle.open i{transform:rotate(180deg);}
        .withx-root .mnav-sub{max-height:0; overflow:hidden; transition:max-height .35s ease;}
        .withx-root .mnav-sub.show{max-height:220px;}
        .withx-root .mnav-sub a{
          display:block; font-size:14px; letter-spacing:1px; color:var(--muted);
          padding:12px 0 12px 4px; border-top:1px solid var(--line);
        }
        .withx-root .mnav-cta{margin-top:32px; display:inline-block; padding:16px 30px; border:1px solid var(--ink); font-size:12px; letter-spacing:2px; color:var(--ink);}
        @media (min-width:1001px){ .withx-root .mobile-nav{display:none;} }

        body.nav-open{overflow:hidden;}

        /* ---------- TECHNOLOGY ---------- */
        .withx-root .tech-wrap{display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:center;}
        .withx-root .tech-list{border-top:1px solid var(--line);}
        .withx-root .tech-row{display:flex; gap:22px; padding:26px 4px; border-bottom:1px solid var(--line); cursor:default;}
        .withx-root .tech-row .tech-num{font-size:12px; letter-spacing:2px; color:var(--muted); min-width:38px; padding-top:4px;}
        .withx-root .tech-row h3{font-size:19px; text-transform:uppercase; font-weight:700; margin-bottom:8px;}
        .withx-root .tech-row p{font-size:14px; line-height:1.65; color:var(--muted); max-width:420px;}
        .withx-root .tech-visual{position:relative; aspect-ratio:1/1; border:1px solid var(--line); display:flex; align-items:center; justify-content:center; background:radial-gradient(circle at 50% 45%, rgba(138,109,30,0.08) 0%, transparent 60%); box-shadow:var(--card-shadow); overflow:hidden;}
        .withx-root .tech-visual img{width:100%; height:100%; object-fit:cover;}
        @media (max-width:900px){ .withx-root .tech-wrap{grid-template-columns:1fr;} .withx-root .tech-visual{max-width:320px; margin:0 auto;} }

        /* ---------- DRONE CURSOR ---------- */
        #drone-cursor{
          position:fixed; top:-25px; left:-25px; width:50px; height:50px;
          background-size:contain; background-repeat:no-repeat; background-position:center;
          pointer-events:none; z-index:9999; transition:background-image .2s ease-in-out; will-change:transform, background-image;
        }
        @media (max-width:900px){ #drone-cursor{display:none;} }

        /* ---------- SYSTEMS POPUP ---------- */
        .withx-root .section-tag-wrapper{position:relative; display:inline-block; margin-bottom:14px;}
        .withx-root .section-tag-wrapper .eyebrow{margin-bottom:0; cursor:pointer;}
        .withx-root .systems-popup{
          position:absolute; top:30px; left:0; width:300px; max-width:calc(100vw - 40px); padding:20px;
          background:#FFFFFF; color:var(--ink); border:1px solid var(--line); border-radius:4px;
          box-shadow:0 20px 45px rgba(17,24,39,.14);
          opacity:0; visibility:hidden; transform:translateY(10px); transition:.25s ease;
          pointer-events:none; z-index:80;
        }
        .withx-root .systems-popup.show{opacity:1; visibility:visible; transform:translateY(0); pointer-events:auto;}
        .withx-root .systems-popup h4{font-size:12px; letter-spacing:2px; text-transform:uppercase; margin-bottom:10px; color:var(--muted);}
        .withx-root .systems-popup p{font-size:14px; line-height:1.6; color:var(--muted);}

        /* ---------- HERO ---------- */
        .withx-root .hero {
          position:relative; width:100%;
          padding-bottom:60px; overflow:hidden;
          padding-top: 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: linear-gradient(
                      rgba(10, 25, 47, 0.65),
                      rgba(10, 25, 47, 0.65)
                    ),
                    url("https://images.unsplash.com/photo-1520870121499-7dddb6ccbcde?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJvbmUlMjBkZWZlbmNlJTIwaW1hZ2V8ZW58MHx8MHx8fDA%3D");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .withx-root .hero-inner{padding-top:180px; width:100%;}
        .withx-root .coords{
          display:flex; align-items:center; justify-content:space-between;
          padding-bottom:28px; font-size:11px; letter-spacing:3px; color:var(--muted);
          border-bottom:1px solid var(--line); margin-bottom:36px;
        }
        .withx-root .coords .rule{width:34px; height:1px; background:var(--muted); display:inline-block; margin-right:14px; vertical-align:middle;}
        .withx-root .coords-right{text-align:right; color:var(--ink);}

        .withx-root h1.headline{
          font-weight:400; text-transform:uppercase; line-height:0.96; letter-spacing:-0.5px;
          font-size:clamp(38px, 8.4vw, 104px); max-width:1050px;
          color: #fff;
        }
        .withx-root h1.headline .accent{font-style:italic; font-weight:500; text-transform:none; display:block;}

        .withx-root .hero-text{display:flex; justify-content:space-between; align-items:flex-end; gap:40px; margin-top:38px; flex-wrap:wrap;}
        .withx-root .hero-copy{max-width:440px; font-size:16px; line-height:1.75; color: #fff;}
        .withx-root .hero-actions{display:flex; gap:14px; flex-wrap:wrap;}
        .withx-root .btn{padding:16px 30px; font-size:13px; letter-spacing:2px; border:1px solid var(--ink); transition:all .25s ease; white-space:nowrap; display:inline-block;}
        .withx-root .btn.primary{background:var(--ink); color:#FFFFFF;}
        .withx-root .btn.primary:hover{background:var(--accent); border-color:var(--accent); color:#FFFFFF;}
        .withx-root .btn.ghost{background:transparent; color:var(--ink);}
        .withx-root .btn.ghost:hover{background:rgba(17,24,39,0.05);}

        /* ---------- TICKER ---------- */
        .withx-root .ticker{
          border-top:1px solid var(--line); border-bottom:1px solid var(--line);
          padding:18px clamp(20px,5vw,64px);
          display:flex; gap:40px; align-items:center; flex-wrap:wrap;
          font-size:12px; letter-spacing:2px; color:var(--muted);
        }
        .withx-root .ticker span.dot{color:var(--accent);}

        /* ---------- DOCTRINE ---------- */
        .withx-root section{padding:120px 0 0;}
        .withx-root .doctrine{display:grid; grid-template-columns:1.3fr 1fr; gap:60px; align-items:start;}
        .withx-root .doctrine h2{ font-family: "Times New Roman", Times, serif; font-weight:700; font-size:clamp(30px,4.4vw,52px); line-height:1.12; text-transform:uppercase;}
        .withx-root .doctrine h2 .fade{color:var(--muted);}
        .withx-root .doctrine-copy{font-size:16px; line-height:1.8; color:var(--muted); margin-top:26px; max-width:480px;}
        .withx-root .link-arrow{display:inline-block; margin-top:28px; font-size:13px; letter-spacing:2px; border-bottom:1px solid var(--ink); padding-bottom:4px;}

        /* ---------- STATS ---------- */
        .withx-root .stats{
          margin-top:110px; border-top:1px solid var(--line);
          display:grid; grid-template-columns:repeat(4,1fr);
        }
        .withx-root .stat{padding:46px clamp(16px,3vw,36px); border-right:1px solid var(--line); border-bottom:1px solid var(--line);}
        .withx-root .stat:last-child{border-right:none;}
        .withx-root .stat .num{ font-family: "Times New Roman", Times, serif; font-weight:700; font-size:clamp(32px,4vw,48px); letter-spacing:-1px;}
        .withx-root .stat .label{margin-top:10px; font-size:11px; letter-spacing:2px; color:var(--muted); text-transform:uppercase;}
        @media (max-width:900px){
          .withx-root section{padding-top:80px;}
          .withx-root .hero-inner{padding-top:130px;}
          .withx-root .coords{flex-direction:column; align-items:flex-start; gap:10px; padding-bottom:20px; margin-bottom:26px;}
          .withx-root .coords-right{text-align:left;}
          .withx-root .hero-text{flex-direction:column; align-items:flex-start; gap:26px;}
          .withx-root .hero-copy{max-width:100%;}
          .withx-root .btn{padding:14px 24px; font-size:12px;}
          .withx-root .cap-head{align-items:flex-start; flex-direction:column;}
          .withx-root .doctrine{grid-template-columns:1fr; gap:30px;}
          .withx-root .foot-brand p{max-width:100%;}
        }
        @media (max-width:768px){ .withx-root .stats{grid-template-columns:repeat(2,1fr);} .withx-root .stat:nth-child(2){border-right:none;} }

        /* ---------- CAPABILITIES ---------- */
        .withx-root .cap-head{display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:20px; margin-bottom:56px;}
        .withx-root .cap-head h2{ font-family: "Times New Roman", Times, serif; font-weight:700; font-size:clamp(30px,4.4vw,52px); line-height:1.1; text-transform:uppercase;}
        .withx-root .cap-head h2 .fade{color:var(--muted);}
        .withx-root .domains{display:grid; grid-template-columns:repeat(4,1fr); border-top:1px solid var(--line);}
        .withx-root .domains-two{grid-template-columns:1fr 1fr;}
        .withx-root .domains-two .domain{min-height:auto; padding:44px;}
        .withx-root .chip-row{display:flex; flex-wrap:wrap; gap:8px; margin:18px 0;}
        .withx-root .chip{font-size:11px; letter-spacing:1px; text-transform:uppercase; color:var(--muted); border:1px solid var(--line); padding:6px 12px;}
        .withx-root .status-tag{display:inline-flex; align-items:center; gap:8px; font-size:11px; letter-spacing:1px; text-transform:uppercase; color:var(--accent); margin-top:6px;}
        .withx-root .dot-status{width:6px; height:6px; border-radius:50%; background:var(--accent); display:inline-block;}
        @media (max-width:700px){ .withx-root .domains-two{grid-template-columns:1fr;} .withx-root .domains-two .domain{border-right:none;} }
        .withx-root .domain{
          padding:44px 30px; border-right:1px solid var(--line); border-bottom:1px solid var(--line);
          min-height:340px; display:flex; flex-direction:column; justify-content:space-between;
          transition:background .3s ease;
        }
        .withx-root .domain:hover{background:rgba(17,24,39,0.02);}
        .withx-root .domain:last-child{border-right:none;}
        .withx-root .domain-tag{font-size:11px; letter-spacing:2px; color:var(--muted); display:flex; justify-content:space-between;}
        .withx-root .product-name{font-size:12px; letter-spacing:1px; color:var(--accent); margin-bottom:12px; text-transform:uppercase;}

        /* ---------- MISSION IMPACT ---------- */
        .withx-root .mission-grid{margin-top:60px; border-top:1px solid var(--line); display:grid; grid-template-columns:repeat(4,1fr);}
        .withx-root .mission-card{padding:46px clamp(16px,3vw,36px); border-right:1px solid var(--line); border-bottom:1px solid var(--line);}
        .withx-root .mission-card:last-child{border-right:none;}
        .withx-root .mission-num{display:flex; align-items:baseline; gap:4px;}
        .withx-root .mission-num .counter{ font-family: "Times New Roman", Times, serif; font-weight:700; font-size:clamp(32px,4vw,48px); letter-spacing:-1px;}
        .withx-root .mission-num .suffix{font-size:20px; color:var(--muted);}
        .withx-root .mission-card h4{font-size:14px; text-transform:uppercase; letter-spacing:1px; margin:14px 0 8px;}
        .withx-root .mission-card p{font-size:13px; line-height:1.6; color:var(--muted);}
        @media (max-width:768px){ .withx-root .mission-grid{grid-template-columns:repeat(2,1fr);} .withx-root .mission-card:nth-child(2){border-right:none;} }
        .withx-root .domain h3{font-family: "Times New Roman", Times, serif; font-weight:700; font-size:24px; margin:30px 0 16px; text-transform:uppercase;}
        .withx-root .domain p{font-size:14px; line-height:1.7; color:var(--muted);}
        .withx-root .domain .learn{margin-top:24px; font-size:12px; letter-spacing:2px;}
        @media (max-width:900px){ .withx-root .domains{grid-template-columns:1fr 1fr;} }
        @media (max-width:560px){ .withx-root .domains{grid-template-columns:1fr;} .withx-root .domain{border-right:none;} }

        /* ---------- SITUATION REPORT ---------- */
        .withx-root .news-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:2px; margin-top:10px;}
        .withx-root .news-card{position:relative; height:460px; overflow:hidden; background:linear-gradient(155deg,#F8FAFC 0%,#EEF1F5 65%); border:1px solid var(--line); box-shadow:var(--card-shadow);}
        .withx-root .news-card .card-art{position:absolute; inset:0; opacity:.7; transition:opacity .35s ease, transform .5s ease;}
        .withx-root .news-card:hover .card-art{opacity:1; transform:scale(1.04);}
        .withx-root .news-overlay{position:absolute; inset:0; background:linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.94) 68%); display:flex; flex-direction:column; justify-content:flex-end; padding:30px;}
        .withx-root .news-meta{font-size:11px; letter-spacing:2px; color:var(--muted); margin-bottom:14px;}
        .withx-root .news-card h3{font-family: "Times New Roman", Times, serif; font-weight:700; font-size:19px; line-height:1.35; text-transform:uppercase; margin-bottom:12px;}
        .withx-root .news-card p{font-size:13px; line-height:1.6; color:var(--muted); margin-bottom:16px;}
        .withx-root .news-card .read{font-size:12px; letter-spacing:2px;}
        @media (max-width:900px){ .withx-root .news-grid{grid-template-columns:1fr;} }

        /* ---------- CTA ---------- */
        .withx-root .cta{
          margin-top:130px; padding:110px clamp(20px,5vw,64px);
          border-top:1px solid var(--line); border-bottom:1px solid var(--line);
          text-align:center;
        }
        .withx-root .cta h2{font-family: "Times New Roman", Times, serif; font-weight:700; font-size:clamp(34px,6vw,64px); text-transform:uppercase; line-height:1.08;}
        .withx-root .cta h2 .fade{color:var(--muted);}
        .withx-root .cta .hero-actions{justify-content:center; margin-top:40px;}

        /* ---------- FOOTER ---------- */
        .withx-root footer{padding:90px clamp(20px,5vw,64px) 40px;}
        .withx-root .foot-top{display:grid; grid-template-columns:1.5fr 1fr 1fr 1fr; gap:50px; padding-bottom:70px; border-bottom:1px solid var(--line);}
        .withx-root .foot-brand .brand{margin-bottom:22px;}
        .withx-root .foot-brand p{font-size:14px; line-height:1.7; color:var(--muted); max-width:340px; margin-bottom:26px;}
        .withx-root .foot-contact{display:flex; flex-direction:column; gap:16px;}
        .withx-root .foot-contact a{display:flex; align-items:center; gap:12px; font-size:14px; color:var(--muted); transition:all .3s ease;}
        .withx-root .foot-contact a:hover{color:var(--ink); transform:translateX(6px);}
        .withx-root .foot-contact i{width:20px; font-size:16px; text-align:center;}
        .withx-root .foot-contact .phone{color:var(--accent);}
        .withx-root .foot-legal{font-size:12px; line-height:1.8; color:var(--muted); margin-top:10px;}
        .withx-root .foot-legal strong{color:var(--ink);}
        .withx-root .foot-col h4{font-size:11px; letter-spacing:2px; color:var(--muted); margin-bottom:22px; text-transform:uppercase;}
        .withx-root .foot-col a{display:block; font-size:14px; margin-bottom:14px; color:var(--ink);}
        .withx-root .foot-col a:hover{color:var(--accent);}
        .withx-root .foot-bottom{display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; padding-top:34px; font-size:11px; letter-spacing:1.5px; color:var(--muted);}
        @media (max-width:900px){ .withx-root .foot-top{grid-template-columns:1fr 1fr; row-gap:50px;} }
        @media (max-width:560px){ .withx-root .foot-top{grid-template-columns:1fr;} .withx-root .foot-bottom{flex-direction:column; align-items:flex-start;} }
        @media (max-width:480px){
          .withx-root header{padding:18px 20px;}
          .withx-root h1.headline{font-size:clamp(34px,11vw,52px);}
          .withx-root .cta{padding:70px 20px;}
          .withx-root .news-card{height:360px;}
        }

        /* ---------- BADGES ---------- */
        .withx-root .badge-row{display:flex; flex-wrap:wrap; gap:10px; margin-top:18px;}
        .withx-root .badge{font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:var(--ink); border:1px solid var(--accent); padding:8px 14px; display:inline-flex; align-items:center; gap:8px;}
        .withx-root .badge i{color:var(--accent);}

        /* ---------- COOKIE BANNER ---------- */
        .withx-root .cookie-banner{
          position:fixed; left:20px; right:20px; bottom:20px; z-index:100;
          max-width:520px; margin:0 auto; background:#FFFFFF; border:1px solid var(--line);
          padding:26px 26px 22px; transform:translateY(140%); transition:transform .5s ease .4s;
          box-shadow:var(--card-shadow);
        }
        .withx-root .cookie-banner.show{transform:translateY(0);}
        .withx-root .cookie-banner p{font-size:14px; line-height:1.7; color:var(--muted); margin-bottom:18px;}
        .withx-root .cookie-banner a{text-decoration:underline;}
        .withx-root .cookie-actions{display:flex; flex-direction:column; gap:10px;}
        .withx-root .cookie-actions button{font-family:inherit; font-size:12px; letter-spacing:2px; padding:14px; border:1px solid var(--ink); cursor:pointer; background:transparent; color:var(--ink);}
        .withx-root .cookie-actions button.accept{background:var(--ink); color:var(--bg);}
        .withx-root .cookie-actions button.manage{border-color:transparent; color:var(--muted); padding:6px;}
      `}</style>

      <div className="withx-root">
        <header>
          <div className="brand">
            <div className="brand-logo">
              <img
                src="images/withx defence logo.png"
                alt="WITHX Innovations Private Limited Logo"
              />
            </div>
          </div>

          <nav className="nav-links">
            <a href="index.html" className="nav-link">Home</a>
            <a href="about.html" className="nav-link">About</a>
            <a href="technology.html" className="nav-link">Technology</a>

            <div className="mega-item">
              <a className="nav-link">SYSTEMS</a>
              <div className="mega-menu">
                <div className="mega-col">
                  <h4>What We Build</h4>
                  <p>
                    WITHX Innovations Private Limited engineers focused
                    unmanned hardware — starting with aerial surveillance and
                    drone survivability — solving real operational problems.
                  </p>
                </div>
                <div className="mega-col">
                  <h4>Products</h4>
                  <button
                    className={`product-toggle${productListOpen ? " active" : ""}`}
                    type="button"
                    onClick={() => setProductListOpen((v) => !v)}
                  >
                    + Our Systems
                  </button>
                  <div className={`product-list${productListOpen ? " show" : ""}`}>
                    <a href="Drone Survillence system .html">
                      WITHX Smart Deployable Surveillance System (SDSS)
                    </a>
                    <a href="Drone recovery bag .html">
                      Passive Autonomous Water Recovery System (PAWRS)
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <a href="contact.html" className="nav-link">Contact</a>
          </nav>

          <div className="nav-touch">
            <a href="contact.html">Get in Touch</a>
          </div>

          <div
            className={`menu-btn${mobileNavOpen ? " open" : ""}`}
            aria-label="Open menu"
            role="button"
            tabIndex={0}
            onClick={() => setMobileNavOpen((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setMobileNavOpen((v) => !v);
              }
            }}
          >
            <span></span>
            <span></span>
          </div>
        </header>

        {/* ===== MOBILE NAV DRAWER ===== */}
        <nav className={`mobile-nav${mobileNavOpen ? " open" : ""}`}>
          <div className="mobile-nav-links">
            <a href="index.html" onClick={closeMobileNav}>Home</a>
            <a href="about.html" onClick={closeMobileNav}>About</a>
            <a href="technology.html" onClick={closeMobileNav}>Technology</a>
            <div className="mnav-systems">
              <button
                className={`mnav-systems-toggle${mnavSystemsOpen ? " open" : ""}`}
                type="button"
                onClick={() => setMnavSystemsOpen((v) => !v)}
              >
                Systems <i className="fa-solid fa-chevron-down"></i>
              </button>
              <div className={`mnav-sub${mnavSystemsOpen ? " show" : ""}`}>
                <a href="Drone Survillence system .html" onClick={closeMobileNav}>
                  WITHX Smart Deployable Surveillance System (SDSS)
                </a>
                <a href="Drone recovery bag .html" onClick={closeMobileNav}>
                  Passive Autonomous Water Recovery System (PAWRS)
                </a>
              </div>
            </div>
            <a href="contact.html" onClick={closeMobileNav}>Contact</a>
          </div>
          <a href="contact.html" className="mnav-cta" onClick={closeMobileNav}>
            Get in Touch
          </a>
        </nav>

        {/* ===== HERO ===== */}
        <section className="hero" style={{ paddingTop: 0 }}>
          <div className="wrap hero-inner">
            <h1 className="headline">
              EDGE OF THE
              unmanned
              BATTLESPACE
            </h1>

            <div className="hero-text">
              <p className="hero-copy">
                WITHX Innovations Private Limited builds mission-critical
                unmanned platforms and command software for allied forces
                operating across air, land, sea, and cyber domains.
              </p>
              <div className="hero-actions">
                <a href="#" className="btn primary">Explore Platforms</a>
                <a href="contact.html" className="btn ghost">Request Brief</a>
              </div>
            </div>
          </div>
        </section>

        <div className="ticker">
          <span><span className="dot">●</span> DPIIT-RECOGNISED STARTUP</span>
          <span><span className="dot">●</span> MADE IN INDIA</span>
          <span><span className="dot">●</span> PATENT DRAFTING IN PROGRESS</span>
        </div>

        {/* ===== DOCTRINE ===== */}
        <section className="wrap">
          <div className="doctrine">
            <h2>
              WE BUILD THE SYSTEMS THAT SEE, DECIDE AND ACT{" "}
              <span className="fade">BEFORE THE ADVERSARY DOES.</span>
            </h2>
            <div>
              <p className="doctrine-copy">
                Founded in 2026 by Sharad Ashruba Waybase, WITHX Innovations
                Private Limited takes a problem-first approach to unmanned
                systems — identifying real operational gaps in surveillance
                and drone survivability, then engineering focused,
                field-ready hardware to solve them.
              </p>
              <a href="about.html" className="link-arrow">OUR STORY →</a>
            </div>
          </div>

          <div className="stats">
            <div className="stat"><div className="num">2026</div><div className="label">Founded</div></div>
            <div className="stat"><div className="num">2</div><div className="label">Core Systems</div></div>
            <div className="stat"><div className="num">1</div><div className="label">Founder-Led Team</div></div>
            <div className="stat"><div className="num">100%</div><div className="label">Problem-First Design</div></div>
          </div>
        </section>

        {/* ===== CAPABILITIES ===== */}
        <section className="wrap">
          <div className="section-tag-wrapper" ref={systemsWrapperRef}>
            <div
              className="eyebrow"
              onClick={(e) => {
                e.preventDefault();
                setSystemsPopupOpen((v) => !v);
              }}
            >
              <span className="rule"></span>
            </div>
            <div className={`systems-popup${systemsPopupOpen ? " show" : ""}`}>
              <h4>Our Systems</h4>
              <p>
                WITHX Innovations Private Limited builds focused unmanned
                hardware — aerial surveillance and drone survivability —
                engineered around real operational problems.
              </p>
            </div>
          </div>
          <div className="cap-head">
            <h2>TWO SYSTEMS.<br /><span className="fade">ONE MISSION.</span></h2>
            <a href="#" className="link-arrow">VIEW ALL SYSTEMS →</a>
          </div>

          <div className="domains domains-two">
            <div className="domain">
              <div className="domain-tag"><span>SYSTEM 01/02</span><span>AIR</span></div>
              <div>
                <h3>WITHX Smart Deployable Surveillance System (SDSS)</h3>
                <div className="product-name">Autonomous UAV-Deployed Surveillance Node</div>
                <p>
                  An indigenous UAV that autonomously transports and deploys
                  a compact surveillance node onto trees, poles, or
                  structures, then returns to base — enabling persistent,
                  real-time monitoring, AI-based motion detection, and
                  encrypted video/alerts to a Command &amp; Control
                  application, without keeping the aircraft airborne.
                </p>
                <div className="chip-row">
                  <span className="chip">Autonomous Deployment</span>
                  <span className="chip">AI Motion Detection</span>
                  <span className="chip">Encrypted C2 Link</span>
                </div>
                <div className="status-tag"><span className="dot-status"></span> Working Prototype</div>
              </div>
              <a href="Drone Survillence system .html" className="learn">LEARN MORE →</a>
            </div>

            <div className="domain">
              <div className="domain-tag"><span>SYSTEM 02/02</span><span>RECOVERY</span></div>
              <div>
                <h3>Passive Autonomous Water Recovery System (PAWRS)</h3>
                <div className="product-name">Water-Activated, Fully Passive Recovery Technology</div>
                <p>
                  Protects UAVs during accidental water landings — a
                  water-activated dissolvable trigger releases a CO₂
                  cartridge that inflates a buoyant airbag, with zero
                  electronics, sensors, or software required.
                </p>
                <div className="chip-row">
                  <span className="chip">Water-Activated</span>
                  <span className="chip">Zero Electronics</span>
                  <span className="chip">Modular Fit</span>
                </div>
                <div className="status-tag"><span className="dot-status"></span> Working Prototype</div>
              </div>
              <a href="Drone recovery bag .html" className="learn">LEARN MORE →</a>
            </div>
          </div>
        </section>

        {/* ===== TECHNOLOGY ===== */}
        <section className="wrap">
          <div className="eyebrow"><span className="rule"></span></div>
          <div className="cap-head">
            <h2>INTELLIGENCE BEHIND<br /><span className="fade">EVERY MISSION.</span></h2>
          </div>

          <div className="tech-wrap">
            <div className="tech-list">
              <div className="tech-row">
                <div className="tech-num">01</div>
                <div>
                  <h3>AI Tracking</h3>
                  <p>Real-time object detection and autonomous target tracking powered by advanced machine learning.</p>
                </div>
              </div>
              <div className="tech-row">
                <div className="tech-num">02</div>
                <div>
                  <h3>Computer Vision</h3>
                  <p>Intelligent image analysis for enhanced situational awareness and threat identification.</p>
                </div>
              </div>
              <div className="tech-row">
                <div className="tech-num">03</div>
                <div>
                  <h3>Swarm Intelligence</h3>
                  <p>Coordinated multi-drone operations enabling efficient area coverage and mission execution.</p>
                </div>
              </div>
              <div className="tech-row">
                <div className="tech-num">04</div>
                <div>
                  <h3>Airbag Recovery System</h3>
                  <p>Innovative recovery technology designed to improve landing safety and protect critical equipment.</p>
                </div>
              </div>
            </div>

            <div className="tech-visual">
              <img
                src="https://images.unsplash.com/photo-1664431398786-aaffcf1c0cee?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Onboard intelligence systems"
              />
            </div>
          </div>
        </section>

        {/* ===== MISSION IMPACT ===== */}
        <section className="wrap">
          <div className="eyebrow"><span className="rule"></span></div>
          <div className="cap-head">
            <h2>BUILT FOR<br /><span className="fade">MISSION SUCCESS.</span></h2>
          </div>
          <p className="doctrine-copy" style={{ marginTop: -30, marginBottom: 0, maxWidth: 560 }}>
            Our intelligent systems are designed to maximize operational
            effectiveness, reliability, and situational awareness.
          </p>

          <div className="mission-grid">
            <div className="mission-card">
              <AnimatedCounter target={95} suffix="%" />
              <h4>Mission Reliability</h4>
              <p>Engineered for dependable performance during critical operations.</p>
            </div>
            <div className="mission-card">
              <AnimatedCounter target={100} suffix="%" />
              <h4>AI Tracking Accuracy</h4>
              <p>Advanced algorithms delivering precise target monitoring.</p>
            </div>
            <div className="mission-card">
              <AnimatedCounter target={24} suffix="/7" />
              <h4>Operational Monitoring</h4>
              <p>Continuous surveillance capabilities for enhanced security.</p>
            </div>
            <div className="mission-card">
              <AnimatedCounter target={50} suffix="+" />
              <h4>Test Flight Hours</h4>
              <p>Extensive testing ensuring mission readiness and safety.</p>
            </div>
          </div>
        </section>

        {/* ===== SITUATION REPORT ===== */}
        <section className="wrap">
          <div className="eyebrow"><span className="rule"></span></div>
          <div className="cap-head">
            <h2>SITUATION REPORT.</h2>
            <a href="#" className="link-arrow">ALL DISPATCHES →</a>
          </div>

          <div className="news-grid">
            <div className="news-card">
              <div className="card-art">
                <img
                  src="https://images.unsplash.com/photo-1583872341575-610c859c7a57?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1pbGl0YXJ5fGVufDB8fDB8fHww"
                  alt="WITHX Sentinel MK-IV"
                />
              </div>
            </div>
            <div className="news-card">
              <div className="card-art">
                <img
                  src="https://images.unsplash.com/photo-1508530786855-dfea35260b8d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1pbGl0YXJ5fGVufDB8fDB8fHww"
                  alt="AEGIS C2 Achieves NATO STANAG 4586 Level 5 Interoperability"
                />
              </div>
            </div>
            <div className="news-card">
              <div className="card-art">
                <img
                  src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fG1pbGl0YXJ5fGVufDB8fDB8fHww"
                  alt="Marlin USV Completes 90-Day Autonomous Ocean Patrol"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="cta">
          <h2>SOVEREIGN FORCE. <span className="fade">DELIVERED.</span></h2>
          <div className="hero-actions">
            <a href="#" className="btn primary">Schedule a Briefing</a>
            <a href="#" className="btn ghost">Join the Mission</a>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer>
          <div className="foot-top">
            <div className="foot-brand">
              <div className="brand">
                <div className="footer-brand-logo">
                  <img src="images/withx-logo.png" alt="WITHX Innovations Private Limited Logo" />
                </div>
              </div>
              <p>Developing next-generation surveillance and recovery technologies for unmanned systems.</p>
              <div className="foot-legal">
                <strong>WITHX Innovations Private Limited</strong><br />
                CIN: U71100PN2026PTC252377<br />
                Dehu Phata, Alandi (D), Taluka-Khed,<br />
                District-Pune, Maharashtra, India, 412105
              </div>
              <div className="badge-row">
                <span className="badge"><i className="fa-solid fa-circle-check"></i> DPIIT Recognised Startup</span>
              </div>
            </div>

            <div className="foot-col">
              <h4>Navigate</h4>
              <a href="index.html">Home</a>
              <a href="about.html">About</a>
              <a href="technologies.html">Technology</a>
              <a href="systems.html">Systems</a>
              <a href="contact.html">Contact</a>
            </div>

            <div className="foot-col">
              <h4>Systems</h4>
              <a href="Drone Survillence system .html">WITHX SDSS</a>
              <a href="Drone recovery bag .html">PAWRS</a>
            </div>

            <div className="foot-col">
              <h4>Contact</h4>
              <div className="foot-contact">
                <a href="mailto:sharadwaybase2@gmail.com">
                  <i className="fa-solid fa-envelope"></i> sharadwaybase2@gmail.com
                </a>
                <a href="tel:+917666936323">
                  <i className="fa-solid fa-phone phone"></i> +91 76669 36323
                </a>
              </div>
            </div>
          </div>

          <div className="foot-bottom">
            <div>© 2026 WITHX INNOVATIONS PRIVATE LIMITED. ALL RIGHTS RESERVED. CIN: U71100PN2026PTC252377</div>
          </div>
        </footer>

        <div className={`cookie-banner${cookieVisible ? " show" : ""}`}>
          <p>
            We use cookies to enhance your development experience and keep
            your data secure. <a href="privacy-policy.html">Privacy Policy</a>{" "}
            · <a href="cookie-policy.html">Cookie Policy</a>
          </p>
          <div className="cookie-actions">
            <button className="accept" onClick={() => setCookieVisible(false)}>
              OK
            </button>
            <button className="manage">Manage preferences</button>
          </div>
        </div>
      </div>
    </>
  );
}
