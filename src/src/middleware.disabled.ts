import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login",
    },
});

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/groups/:path*",
        "/admin/:path*",
        "/api/groups/:path*",
        "/api/incidents/:path*",
        "/api/admin/:path*",
    ],
};
