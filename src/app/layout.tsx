import React, { ReactNode } from 'react';
import AppWrappers from './AppWrappers';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body id="root">
        <AppWrappers>{children}</AppWrappers>
        <div id="portal"></div>
      </body>
    </html>
  );
}