// import type { Metadata } from "next";
// import { Poppins } from "next/font/google";
// import "./globals.css";
// import { AuthProvider } from "@/context/AuthContext";
// import { Toaster } from "react-hot-toast";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700"],
//   variable: "--font-poppins",
//   display: "swap",
// });

// export const metadata: Metadata = {
//   title: "Winyou me",
//   description: "A modern dark e-commerce platform.",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" className="dark">
//       <body
//         className={`${poppins.className} bg-gray-950 text-gray-100 antialiased`}
//       >
//         <AuthProvider>
//           {children}
//           <Toaster
//             position="top-center"
//             toastOptions={{
//               style: {
//                 background: "#111827",
//                 color: "#fff",
//                 border: "1px solid #1f2937",
//               },
//             }}
//           />
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import RouteTracker from "@/context/RouteTracker";
import { CartProvider } from "@/context/CartContext ";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Winyou me",
  description: "A modern dark e-commerce platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className="dark">
      <body
        className={`${poppins.className} bg-gray-950 text-gray-100 antialiased`}
      >
        {/* Facebook Pixel */}
        {FB_PIXEL_ID && (
          <>
            <Script id="facebook-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}
                (window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${FB_PIXEL_ID}');
                fbq('track', 'PageView');
              `}
            </Script>

            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
        )}

        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        <CartProvider>
          <AuthProvider>
            <RouteTracker />
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "#111827",
                  color: "#fff",
                  border: "1px solid #1f2937",
                },
              }}
            />
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
