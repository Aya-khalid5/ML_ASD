export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <a href="#top" className="brand">
          <span className="brand-logo">🧩</span>
          ASD Screening
        </a>
        <nav className="nav">
          <a href="#about">About</a>
          <a href="#how-it-works">How it works</a>
          <a href="#screening">Take the screening</a>
          <span className="nav-badge">AI-powered</span>
        </nav>
      </div>
    </header>
  );
}

