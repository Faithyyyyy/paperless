// // app/dashboard/layout.tsx
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { redirect } from "next/navigation";
// import { TabBar } from "@/components/TabBar";

// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.id) redirect("/auth/login");

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "var(--bg)",
//         paddingBottom: "80px",
//       }}
//     >
//       {children}
//       <TabBar />
//     </div>
//   );
// }
// app/dashboard/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TabBar } from "@/components/TabBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/login");

  return (
    <>
      <TabBar />
      <div className="dashboard-content">{children}</div>

      <style>{`
        /* Mobile — content above bottom tab bar */
        .dashboard-content {
          min-height: 100vh;
          background: var(--bg, #f0ede6);
          padding-bottom: 80px;
        }

        /* Desktop — content pushed right of sidebar */
        @media (min-width: 900px) {
          .dashboard-content {
            margin-left: 220px;
            padding-bottom: 0;
            min-height: 100vh;
          }
        }
      `}</style>
    </>
  );
}
