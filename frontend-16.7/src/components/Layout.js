import React from "react";

export function Main({ children }) {
  return <main>{children}</main>;
}

function Header() {
  return (
    <header>
      <h1>React Chat Example</h1>
      <div>React {React.version}</div>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <a href="https://github.com/nilshartmann/react-chat-example">https://github.com/nilshartmann/react-chat-example</a>
    </footer>
  );
}

export function Sidebar({ children }) {
  return <aside>{children}</aside>;
}

export function Layout({ children }) {
  return (
    <>
      <Header />
      <div className="PageContainer">{children}</div>
      <Footer />
    </>
  );
}
