import "./globals.css";

export const metadata = {
  title: "ASD Screening — Early Screening Aid",
  description:
    "An AI-powered screening tool for Autism Spectrum Disorder traits based on the AQ-10 questionnaire and a trained machine learning model.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

