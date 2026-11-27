import { useRouteError } from 'react-router-dom';
import { useSettings } from '../state/settings';
import { Mewy } from './Mewy';

/** Shown instead of a blank screen when a page crashes (or an old page file is gone after a deploy). */
export function ErrorPage() {
  const { tr } = useSettings();
  const error = useRouteError();
  console.error(error);
  return (
    <section className="error-page" role="alert">
      <Mewy size={96} mood="sad" />
      <h1>{tr('errorTitle')}</h1>
      <p className="error-page__text">{tr('errorText')}</p>
      <div className="error-page__actions">
        <button type="button" className="btn" onClick={() => window.location.reload()}>
          🔄 {tr('errorReload')}
        </button>
        <a href="#/" className="btn btn--ghost" onClick={() => window.setTimeout(() => window.location.reload(), 0)}>
          🏠 {tr('errorHome')}
        </a>
      </div>
    </section>
  );
}
