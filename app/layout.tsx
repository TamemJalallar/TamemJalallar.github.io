import './globals.css';
import Providers from './providers';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata = {
  title: 'Tamem (Tom) Jalallar | TomFromIT',
  description:
    'Senior IT Systems Administrator & Technical Lead — IAM, endpoint management, automation.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} font-poppins bg-gray-100/50 dark:bg-grey-900 text-black dark:text-white overflow-x-hidden`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
