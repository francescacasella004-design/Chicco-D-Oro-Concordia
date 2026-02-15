import './globals.css';
import { AuthProvider } from '@/components/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Fantachicco – Il Fantasy Game della Parrocchia',
  description: 'Gioca al Fantachicco! Scegli la tua squadra, segui le esibizioni e scala la classifica. Un gioco ispirato al Fantasanremo per la Parrocchia Santa Maria del Carmelo alla Concordia.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
