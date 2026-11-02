import { useEffect, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { createEnvironment, deleteEnvironment, fetchEnvironments, updateEnvironment } from "../api/dataApi.js";

export default function EnvironmentsPage({ accessToken }) {
  const [environments, setEnvironments] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [name, setName] = useState("");
  const [variables, setVariables] = useState([{ key: "", value: "" }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function loadEnvironments(selectDefault = false) {
    setLoading(true);
    try {
      const result = await fetchEnvironments(accessToken);
      setEnvironments(result);
      const active = result.find((item) => item.is_active) || result[0];
      if (selectDefault && active) selectEnvironment(active);
    } catch (loadError) { setError(loadError.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadEnvironments(true); }, [accessToken]);

  function selectEnvironment(environment) {
    setSelectedId(environment.id);
    setName(environment.name);
    const entries = Object.entries(environment.variables || {}).map(([key, value]) => ({ key, value: String(value) }));
    setVariables([...entries, { key: "", value: "" }]);
    setNotice("");
  }

  function newEnvironment() {
    setSelectedId(null);
    setName("");
    setVariables([{ key: "", value: "" }]);
    setNotice("");
    setError("");
  }

  async function save(event) {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    const values = Object.fromEntries(variables.filter((row) => row.key.trim()).map(({ key, value }) => [key.trim(), value]));
    try {
      const result = selectedId
        ? await updateEnvironment(accessToken, selectedId, { name: name.trim(), variables: values })
        : await createEnvironment(accessToken, { name: name.trim(), variables: values });
      setSelectedId(result.id); setNotice("Environment saved."); await loadEnvironments();
    } catch (saveError) { setError(saveError.message); }
    finally { setSaving(false); }
  }

  async function activate(environment) {
    setError("");
    try {
      await updateEnvironment(accessToken, environment.id, { is_active: true });
      await loadEnvironments(); selectEnvironment({ ...environment, is_active: true });
      setNotice(`${environment.name} is now active.`);
    } catch (activateError) { setError(activateError.message); }
  }

  async function remove() {
    if (!selectedId) return;
    try { await deleteEnvironment(accessToken, selectedId); newEnvironment(); await loadEnvironments(); setNotice("Environment deleted."); }
    catch (removeError) { setError(removeError.message); }
  }

  return <section className="data-page">
    <div className="workspace-page-heading"><div><p className="page-eyebrow">REQUEST CONFIGURATION</p><h1>Environments</h1><p>Keep base URLs and variables for each API setup.</p></div><button className="data-primary-button" type="button" onClick={newEnvironment}><Plus size={15} /> New environment</button></div>
    {error && <p className="data-error" role="alert">{error}</p>}{notice && <p className="data-notice" role="status">{notice}</p>}
    <div className="environment-layout"><aside className="data-card environment-list"><h2>Your environments</h2>{loading ? <p className="data-muted">Loading…</p> : environments.length ? environments.map((item) => <button type="button" key={item.id} className={`environment-choice ${selectedId === item.id ? "selected" : ""}`} onClick={() => selectEnvironment(item)}><span>{item.name}<small>{Object.keys(item.variables || {}).length} variables</small></span>{item.is_active && <span className="active-badge">Active</span>}</button>) : <p className="data-muted">No environments yet.</p>}</aside>
    <form className="data-card environment-editor" onSubmit={save}><div className="data-card-heading"><div><p className="page-eyebrow">{selectedId ? "EDIT ENVIRONMENT" : "NEW ENVIRONMENT"}</p><h2>{selectedId ? name || "Environment" : "Create an environment"}</h2></div>{selectedId && <button className="data-icon-button danger" type="button" aria-label="Delete environment" onClick={remove}><Trash2 size={16} /></button>}</div>
      <label className="data-field">Environment name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Development" required maxLength={120} /></label>
      <div className="variable-heading"><strong>Variables</strong><span>Values are stored privately in your workspace.</span></div>
      <div className="environment-variable-list">{variables.map((row, index) => <div className="environment-variable-row" key={index}><input aria-label={`Variable name ${index + 1}`} placeholder="Key (e.g. base_url)" value={row.key} onChange={(event) => setVariables((current) => current.map((item, i) => i === index ? { ...item, key: event.target.value } : item))} /><input aria-label={`Variable value ${index + 1}`} placeholder="Value" value={row.value} onChange={(event) => setVariables((current) => current.map((item, i) => i === index ? { ...item, value: event.target.value } : item))} /></div>)}</div>
      <button className="data-link-button" type="button" onClick={() => setVariables((current) => [...current, { key: "", value: "" }])}><Plus size={14} /> Add variable</button>
      <div className="environment-actions"><button className="data-primary-button" type="submit" disabled={saving}>{saving ? "Saving…" : "Save environment"}</button>{selectedId && !environments.find((item) => item.id === selectedId)?.is_active && <button className="data-secondary-button" type="button" onClick={() => activate(environments.find((item) => item.id === selectedId))}><Check size={14} /> Set active</button>}</div>
    </form></div>
  </section>;
}
