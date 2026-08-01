export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>
          © {new Date().getFullYear()} <strong>ASD Screening</strong> — A machine
          learning portfolio project.
        </span>
        <span>
          Not a medical diagnosis. For research and educational purposes only.
        </span>
      </div>
    </footer>
  );
}

