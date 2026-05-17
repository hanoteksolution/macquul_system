import { Html, Head, Main, NextScript } from 'next/document';

const THEME_STORAGE_KEY = 'theme';

const themeInitScript = `
(function () {
  try {
    var key = '${THEME_STORAGE_KEY}';
    var theme = localStorage.getItem(key);
    if (theme !== 'dark' && theme !== 'light') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    var root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
  } catch (e) {}
})();
`;

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head />
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
