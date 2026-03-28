// src/middleware/requireAuth.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withAuth } from "next-auth/middleware";

export type AuthContext = {
  userId: string;
  vendorId: string;
  shopName: string;
};

/**
 * Use inside any API route that requires a logged-in vendor.
 * Returns the auth context or throws a NextResponse error.
 *
 * Usage:
 *   const auth = await requireAuth();
 *   if (auth instanceof NextResponse) return auth;
 *   const { vendorId } = auth;
 */
export async function requireAuth(): Promise<AuthContext | NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be logged in to do this" },
      { status: 401 },
    );
  }

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.user.id },
    select: { id: true, shopName: true },
  });

  if (!vendor) {
    return NextResponse.json(
      { error: "Vendor profile not found. Please complete your setup." },
      { status: 403 },
    );
  }

  return {
    userId: session.user.id,
    vendorId: vendor.id,
    shopName: vendor.shopName,
  };
}
export default withAuth({
  pages: {
    signIn: "/auth/login",
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
