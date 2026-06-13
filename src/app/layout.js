import "./globals.css";

export const metadata = {
  title: "Quest Tracker | Daily 5 Quests",
  description: "Gamified 5-Daily-Quests Habit Tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-rajdhani min-h-screen bg-gradient-to-br from-[#0a0014] via-[#150025] to-[#000814]">
        {children}
      </body>
    </html>
  );
}
