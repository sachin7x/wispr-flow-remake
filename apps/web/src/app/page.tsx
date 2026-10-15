"use client";
import { useMemo, useState } from "react";
const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [formatted, setFormatted] = useState("");
  const [status, setStatus] = useState("Ready");
  const [busy, setBusy] = useState(false);
  const words = useMemo(() => transcript.trim() ? transcript.trim().split(/\s+/).length : 0, [transcript]);
  async function checkApi() {
    setBusy(true);
    try { const r = await fetch(`${API}/health`); if (!r.ok) throw new Error(); const d = await r.json(); setStatus(`API connected · ${d.status}`); }
    catch { setStatus("API unavailable · start FastAPI on port 8000"); }
    finally { setBusy(false); }
  }
  async function format() {
    setBusy(true);
    try {
      const r = await fetch(`${API}/v1/format`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({transcript,style:"natural"}) });
      const d = await r.json(); if (!r.ok) throw new Error(d.detail ?? "Formatting failed");
      setFormatted(d.text); setStatus("Formatted preview ready · review before use");
    } catch { setStatus("Formatting failed · check API connection"); }
    finally { setBusy(false); }
  }
  return <main className="shell">
    <aside className="sidebar"><div className="brand"><span className="mark">f</span> flow<span className="slash">/</span></div><p className="sideLabel">WORKSPACE</p><a className="nav active" href="#lab">◉ &nbsp; Dictation lab</a><a className="nav" href="#personalization">✳ &nbsp; Personalization</a><a className="nav" href="#privacy">◇ &nbsp; Privacy controls</a><div className="sideBottom">● Local development<br/><small>Scaffold · not production</small></div></aside>
    <section className="content"><header className="top"><div><span className="eyebrow">VOICE WORKSPACE</span><h1>Say it. Shape it. Send it.</h1><p>A focused workspace for the next generation of voice-first writing.</p></div><button className="secondary" onClick={checkApi} disabled={busy}>Check API ↗</button></header>
      <div className="status">● {status}<span>LOCAL PROTOTYPE</span></div>
      <div className="grid" id="lab"><section className="panel editor"><div className="panelTitle"><div><span className="eyebrow">01 / TRANSCRIPT</span><h2>Dictation lab</h2></div><label className="pill">Manual input</label></div><p className="muted">Paste or type a transcript to test formatting. Microphone capture and speech recognition are not connected yet.</p><label className="fieldLabel" htmlFor="raw">Raw transcript</label><textarea id="raw" value={transcript} onChange={e=>setTranscript(e.target.value)} placeholder="Example: hey team comma can we move the launch review to friday question mark thanks"/><div className="editorFoot"><small>{words} words · raw text retained</small><button className="primary" onClick={format} disabled={busy || !transcript.trim()}>{busy ? "Working…" : "Format transcript ↗"}</button></div>
      {formatted && <div className="result"><div className="panelTitle"><strong>Formatted preview</strong><span className="pill">Review required</span></div><p>{formatted}</p><button className="linkButton" onClick={()=>navigator.clipboard.writeText(formatted)}>Copy preview</button></div>}</section>
      <div className="right"><section className="panel"><div className="iconBox">◌</div><span className="eyebrow">CORE LOOP</span><h3>From voice to finished text</h3><p className="muted">Capture, transcribe, preserve intent, format, then insert with a recovery path.</p><div className="steps"><div><b>1</b>Capture audio <em>Planned</em></div><div><b>2</b>Transcribe <em>Provider pending</em></div><div><b>3</b>Format safely <em>Prototype</em></div><div><b>4</b>Insert text <em>Native client pending</em></div></div></section><section className="panel privacy" id="privacy"><span className="eyebrow">PRIVACY BY DESIGN</span><h3>Controls before convenience</h3><p>Context capture, cloud sync, and model-training consent must be separate, explicit choices.</p><span className="pill">This page does not capture audio</span></section></div></div>
      <section className="panel roadmap" id="personalization"><div className="panelTitle"><div><span className="eyebrow">BUILD PLAN</span><h2>Milestones</h2></div><span className="pill">Evidence-led</span></div>{[["01","Core dictation","Audio capture, ASR, insertion and recovery.","NEXT"],["02","Context & formatting","App-aware styles with meaning-preservation checks.","PLANNED"],["03","Personalization","Vocabulary, replacements, snippets and styles.","PLANNED"],["04","Reliability & release","Privacy tests, performance budgets and platform QA.","PLANNED"]].map(([n,t,d,s])=><div className="milestone" key={n}><span>{n}</span><div><strong>{t}</strong><p>{d}</p></div><em>{s}</em></div>)}</section><footer>FLOW REMAKE <span>Independent implementation · no proprietary source copied</span></footer>
    </section>
  </main>;
}
