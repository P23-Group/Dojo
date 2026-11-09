import { Card } from '../../components';
import './AuthLayout.css';

export default function AuthLayout({
  title,
  subtitle,
  headline,
  description,
  character,
  children,
}) {
  return (
    <main className="auth">
      <section className="auth__visual">
        <div className="auth__brand">DOJO</div>
        <p className="auth__headline">{headline}</p>
        <p className="auth__lead">{description}</p>

        <div className="auth__scene">
          <div className="auth__moon" />
          <img className="auth__character" src={character} alt="DOJO mascot" />
        </div>
      </section>

      <section className="auth__panel">
        <Card className="auth__card">
          <h1 className="auth__title">{title}</h1>
          <p className="auth__subtitle">{subtitle}</p>
          {children}
        </Card>
      </section>
    </main>
  );
}
