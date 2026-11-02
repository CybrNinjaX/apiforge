import { useEffect, useState } from "react";
import { Clock3, RefreshCw } from "lucide-react";
import { fetchHistory } from "../api/dataApi.js";

const dateTime = (value) => new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export default function HistoryPage({ accessToken }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function refresh() {
    setLoading(true); setError("");
    try { setItems(await fetchHistory(accessToken)); }
    catch (loadError) { setError(loadError.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, [accessToken]);

  return <section className="data-page"><div className="workspace-page-heading"><div><p className="page-eyebrow">RECENT ACTIVITY</p><h1>History</h1><p>Review requests sent from this workspace.</p></div><button className="data-secondary-button" type="button" onClick={refresh} disabled={loading}><RefreshCw size={14} /> Refresh</button></div>
    {error && <p className="data-error" role="alert">{error}</p>}
    <div className="data-card history-card">{loading ? <p className="data-muted">Loading request history…</p> : items.length ? <div className="history-list">{items.map((item) => <details className="history-item" key={item.id}><summary><span className={`history-method method-${item.method.toLowerCase()}`}>{item.method}</span><span className="history-url">{item.url}</span><span className={`history-status ${item.response_status >= 400 ? "failed" : ""}`}>{item.response_status || "Failed"}</span><span className="history-duration">{item.duration_ms == null ? "—" : `${Number(item.duration_ms).toFixed(0)} ms`}</span><time>{dateTime(item.executed_at)}</time></summary><div className="history-details"><span>Response</span><pre>{item.response_body || "No response body"}</pre></div></details>)}</div> : <div className="data-empty"><span><Clock3 size={19} /></span><h2>No requests yet</h2><p>Requests you send from Collections will appear here.</p></div>}</div>
  </section>;
}
