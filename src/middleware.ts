import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const authPaths = ["/login", "/sign-up", "/forgotpassword", "/reset-password", "/verify-otp", "/invite-operator", "/invite-operator/:path*"];

    const adminPaths = ["/dashboard", "/agencies", "/agencies/:path*", "/invite", "/invite/:path*", "/support", "/support/:id", "/tags", "/agencies/:AgencyID/Offices/:path*", "/profile", "/create-parcel/:path*", "/parcels/single-parcel/:id"];
    const agencyPaths = ["/dashboard", "/offices", "/offices/:path*", "/parcels", "/support/create-support", "/support", "/tags", "/profile", "/parcels/create-parcel", "/parcels/single-parcel/:id"];
    const operatorPath = ["/dashboard", "/parcels", "/customers", "/support/create-support", "/support", "/tags", "/profile", "/parcels/create-parcel", "/parcels/single-parcel/:id"];

    
    const isPathAllowed = (paths: string[]) => {
        return paths.some((path) => {
            const pattern = new RegExp(
                "^" +
                    path
                        .replace(/\/:path\*/g, "(/.*)?")
                        .replace(/\/:id/g, "/[^/]+")
                        .replace(/\//g, "\\/") +
                    "$"
            );
            return pattern.test(pathname);
        });
    };

    let parseDetail;
    const cookieValue = request.cookies.get("fluxelio")?.value;

    try {
        parseDetail = cookieValue ? JSON.parse(cookieValue) : null;
    } catch (error) {
        console.error("Error parsing fluxelio cookie:", error);
        return NextResponse.redirect(new URL("/login", request.url));
    }
    const isLoggin = !!parseDetail;

    // if (isPathAllowed(authPaths)) {
    //     return NextResponse.next();
    // }

    const userType = parseDetail?.data?.user?.role?.[0];

    if (userType === "Admin" && isLoggin && !isPathAllowed(adminPaths)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    } else if (userType === "Agency" && !isPathAllowed(agencyPaths)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    } else if (userType === "Operator" && !isPathAllowed(operatorPath)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    } else if (!isLoggin && !isPathAllowed(authPaths)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

// export const config = {
//     matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|images|img|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)"],
};
