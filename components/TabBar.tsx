// "use client";
// // components/TabBar.tsx
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { signOut } from "next-auth/react";

// const tabs = [
//   {
//     href: "/dashboard",
//     label: "Issue",
//     icon: (
//       <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//         <rect
//           x="4"
//           y="2"
//           width="12"
//           height="16"
//           rx="2.5"
//           stroke="currentColor"
//           strokeWidth="1.5"
//         />
//         <path
//           d="M7 7h6M7 10.5h4M7 14h3"
//           stroke="currentColor"
//           strokeWidth="1.4"
//           strokeLinecap="round"
//         />
//       </svg>
//     ),
//   },
//   {
//     href: "/dashboard/receipts",
//     label: "Receipts",
//     icon: (
//       <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//         <path
//           d="M4 5h12M4 10h12M4 15h7"
//           stroke="currentColor"
//           strokeWidth="1.5"
//           strokeLinecap="round"
//         />
//       </svg>
//     ),
//   },
//   {
//     href: "/verify",
//     label: "Verify",
//     icon: (
//       <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//         <path
//           d="M10 2l8 3.5v5.5c0 4.5-3.5 7.5-8 9-4.5-1.5-8-4.5-8-9V5.5L10 2Z"
//           stroke="currentColor"
//           strokeWidth="1.5"
//           strokeLinejoin="round"
//         />
//         <path
//           d="M7 10l2.5 2.5L14 7"
//           stroke="currentColor"
//           strokeWidth="1.5"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       </svg>
//     ),
//   },
// ];

// export function TabBar() {
//   const pathname = usePathname();

//   return (
//     <nav style={s.bar}>
//       {tabs.map((tab) => {
//         const active = pathname === tab.href;
//         return (
//           <Link
//             key={tab.href}
//             href={tab.href}
//             style={{
//               ...s.tab,
//               color: active ? "var(--teal)" : "#bab7af",
//               textDecoration: "none",
//             }}
//           >
//             {tab.icon}
//             <span style={s.label}>{tab.label}</span>
//           </Link>
//         );
//       })}

//       <button
//         style={{
//           ...s.tab,
//           color: "#bab7af",
//           border: "none",
//           background: "none",
//           cursor: "pointer",
//         }}
//         onClick={() => signOut({ callbackUrl: `${window.location.origin}` })}
//       >
//         <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//           <path
//             d="M13 14l4-4-4-4M17 10H7"
//             stroke="currentColor"
//             strokeWidth="1.5"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           />
//           <path
//             d="M7 3H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h3"
//             stroke="currentColor"
//             strokeWidth="1.5"
//             strokeLinecap="round"
//           />
//         </svg>
//         <span style={s.label}>Sign out</span>
//       </button>
//     </nav>
//   );
// }

// const s: Record<string, React.CSSProperties> = {
//   bar: {
//     position: "fixed",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     background: "#fff",
//     borderTop: "1px solid rgba(13,148,136,0.10)",
//     display: "grid",
//     gridTemplateColumns: "repeat(4, 1fr)",
//     zIndex: 60,
//   },
//   tab: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "4px",
//     padding: "11px 0 9px",
//     fontFamily: "inherit",
//     fontSize: "10.5px",
//     fontWeight: 500,
//     transition: "color 0.15s",
//   },
//   label: { fontSize: "10.5px" },
// };
"use client";
// components/TabBar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const tabs = [
  {
    href: "/dashboard",
    label: "Issue",
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect
          x="3"
          y="1"
          width="12"
          height="16"
          rx="2.5"
          stroke="currentColor"
          strokeWidth={active ? "1.8" : "1.5"}
        />
        <path
          d="M6 6h6M6 9.5h4M6 13h3"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/dashboard/receipts",
    label: "Receipts",
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M3 4.5h12M3 9h12M3 13.5h7"
          stroke="currentColor"
          strokeWidth={active ? "1.8" : "1.5"}
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/verify",
    label: "Verify",
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M9 1.5l7 3v5c0 4-3 6.5-7 8-4-1.5-7-4-7-8v-5l7-3Z"
          stroke="currentColor"
          strokeWidth={active ? "1.8" : "1.5"}
          strokeLinejoin="round"
        />
        <path
          d="M6 9l2.5 2.5L13 6.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function TabBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const shopName = session?.user?.shopName ?? "My Shop";
  const initials = shopName.slice(0, 2).toUpperCase();

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="paperless-sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect
                x="2"
                y="1"
                width="9"
                height="12"
                rx="2"
                fill="white"
                opacity="0.25"
              />
              <rect
                x="3.5"
                y="2.5"
                width="9"
                height="12"
                rx="2"
                fill="white"
                opacity="0.4"
              />
              <rect x="5" y="4" width="9" height="12" rx="2" fill="white" />
              <path
                d="M7.5 7.5h4M7.5 10h3M7.5 12.5h3.5"
                stroke="#0d9488"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <circle cx="14.5" cy="14.5" r="3.5" fill="#0d9488" />
              <path
                d="M13 14.5l1.2 1.2L16 12.8"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="sidebar-logo-text">Paperless</span>
        </div>

        {/* Nav items */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">Workspace</div>
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`sidebar-item ${active ? "sidebar-item-active" : ""}`}
              >
                <span className="sidebar-item-icon">{tab.icon(active)}</span>
                <span className="sidebar-item-label">{tab.label}</span>
                {active && <span className="sidebar-active-dot" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom — vendor info + sign out */}
        <div className="sidebar-bottom">
          <div className="sidebar-vendor">
            <div className="sidebar-vendor-avatar">{initials}</div>
            <div className="sidebar-vendor-info">
              <div className="sidebar-vendor-name">{shopName}</div>
              <div className="sidebar-vendor-role">Vendor</div>
            </div>
          </div>
          <button
            className="sidebar-signout"
            onClick={() =>
              signOut({ callbackUrl: `${window.location.origin}/landing` })
            }
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path
                d="M10 10.5l3.5-3L10 4M13.5 7.5H5.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.5 2H3A1.5 1.5 0 0 0 1.5 3.5v8A1.5 1.5 0 0 0 3 13h2.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM TAB BAR ── */}
      <nav className="paperless-tabbar">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`tab-item ${active ? "tab-item-active" : ""}`}
            >
              {tab.icon(active)}
              <span className="tab-label">{tab.label}</span>
            </Link>
          );
        })}
        <button
          className="tab-item"
          onClick={() =>
            signOut({ callbackUrl: `${window.location.origin}/landing` })
          }
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M13 14l4-4-4-4M17 10H7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 3H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="tab-label">Sign out</span>
        </button>
      </nav>

      <style>{`
        /* ── SIDEBAR STYLES ── */
        .paperless-sidebar {
          display: none;
        }

        /* ── BOTTOM TAB ── */
        .paperless-tabbar {
          position: fixed; bottom: 0; left: 0; right: 0;
          background: #fff;
          border-top: 1px solid rgba(13,148,136,0.10);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          z-index: 60;
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
        .tab-item {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 4px; padding: 11px 0 9px;
          color: #bab7af;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 10.5px; font-weight: 500;
          text-decoration: none;
          border: none; background: none; cursor: pointer;
          transition: color 0.15s;
        }
        .tab-item-active { color: #0d9488; }
        .tab-label { font-size: 10.5px; }

        /* ── DESKTOP ── */
        @media (min-width: 900px) {
          .paperless-tabbar { display: none; }

          .paperless-sidebar {
            display: flex;
            flex-direction: column;
            position: fixed;
            left: 0; top: 0; bottom: 0;
            width: 220px;
            background: #0a1f1c;
            border-right: 1px solid rgba(255,255,255,0.05);
            z-index: 60;
            padding: 0;
          }

          .sidebar-logo {
            display: flex; align-items: center; gap: 10px;
            padding: 22px 20px 18px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
          }
          .sidebar-logo-mark {
            width: 32px; height: 32px;
            background: #0d9488; border-radius: 8px;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
          }
          .sidebar-logo-text {
            font-size: 16px; font-weight: 700;
            color: #fff; letter-spacing: -0.3px;
          }

          .sidebar-nav {
            flex: 1; padding: 20px 12px;
            display: flex; flex-direction: column; gap: 16px;
            overflow-y: auto;
          }
          .sidebar-nav-label {
            font-size: 10px; font-weight: 600;
            text-transform: uppercase; letter-spacing: 0.8px;
            color: rgba(255,255,255,0.25);
            padding: 0 8px; margin-bottom: 8px;
          }
          .sidebar-item {
            display: flex; align-items: center; gap: 10px;
            padding: 10px 10px; border-radius: 9px;
            color: rgba(255,255,255,0.5);
            text-decoration: none;
            font-size: 13.5px; font-weight: 500;
            transition: all 0.15s;
            position: relative;
          }
          .sidebar-item:hover {
            background: rgba(255,255,255,0.06);
            color: rgba(255,255,255,0.85);
          }
          .sidebar-item-active {
            background: rgba(13,148,136,0.18) !important;
            color: #4dd9c8 !important;
          }
          .sidebar-item-icon {
            display: flex; align-items: center; justify-content: center;
            width: 28px; height: 28px; border-radius: 7px;
            background: rgba(255,255,255,0.05);
            flex-shrink: 0;
          }
          .sidebar-item-active .sidebar-item-icon {
            background: rgba(13,148,136,0.25);
          }
          .sidebar-item-label { flex: 1; }
          .sidebar-active-dot {
            width: 6px; height: 6px; border-radius: 50%;
            background: #0d9488; flex-shrink: 0;
          }

          .sidebar-bottom {
            padding: 16px 12px;
            border-top: 1px solid rgba(255,255,255,0.06);
            display: flex; flex-direction: column; gap: 8px;
          }
          .sidebar-vendor {
            display: flex; align-items: center; gap: 10px;
            padding: 10px 10px; border-radius: 9px;
            background: rgba(255,255,255,0.04);
          }
          .sidebar-vendor-avatar {
            width: 32px; height: 32px; border-radius: 8px;
            background: linear-gradient(135deg, #0d9488, #065f55);
            display: flex; align-items: center; justify-content: center;
            font-size: 12px; font-weight: 700; color: #fff;
            flex-shrink: 0;
          }
          .sidebar-vendor-name {
            font-size: 12.5px; font-weight: 600; color: #fff;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            max-width: 120px;
          }
          .sidebar-vendor-role {
            font-size: 10.5px; color: rgba(255,255,255,0.3);
            margin-top: 1px;
          }
          .sidebar-signout {
            display: flex; align-items: center; gap: 8px;
            width: 100%; padding: 9px 10px; border-radius: 9px;
            background: none; border: none; cursor: pointer;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 13px; font-weight: 500;
            color: rgba(255,255,255,0.35);
            transition: all 0.15s; text-align: left;
          }
          .sidebar-signout:hover {
            background: rgba(255,255,255,0.05);
            color: rgba(255,255,255,0.6);
          }
        }
      `}</style>
    </>
  );
}
