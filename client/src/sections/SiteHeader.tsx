export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="MDRMX Design Studio home">
        MDRMX
      </a>
      <nav aria-label="Primary navigation" className="site-nav">
        <a href="#work">Work</a>
        <a href="#studio">About</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}
