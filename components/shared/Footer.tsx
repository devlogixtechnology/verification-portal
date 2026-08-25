/**
 * The page footer. Reads the same tokens as everything else, so it changes with
 * the active project theme.
 */
export default function Footer() {
  return (
    <footer className="vf-footer">
      <p style={{ margin: 0 }}>Read-only verification engine.</p>
      <p style={{ margin: 0 }}>© {new Date().getFullYear()} All rights reserved.</p>
    </footer>
  );
}
