"use client";
import { useMemo, useState } from "react";
import AuthPanel from "@/components/auth-panel";

type Session = {
  id: string;
  formatted_transcript: string | null;
  created_at: string;
};

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [formatted, setFormatted] = useState("");
  const [status, setStatus] = useState("Ready");
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<Session[]>([]);
  const words = useMemo(() => transcript.trim() ? transcript.trim().split(/\s+/).length : 0, [transcript]);

  async function checkApi() {
    setBusy(true);
    try {
      const response = await fetch("/api/health");
      if (!response.ok) throw new Error();
      const data = await response.json();
      setStatus(`API connected · ${data.status}`);
    } catch {
      setStatus("API unavailable · check the deployment logs");
    } finally {
      setBusy(false);
    }
  }

  async function format() {
    setBusy(true);
    try {
      const response = await fetch("/api/v1/format", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, style: "natural" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail ?? "Formatting failed");
      setFormatted(data.text);
      setStatus("Formatted preview ready · review before use");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Formatting failed · check the API connection");
    } finally {
      setBusy(false);
    }
  }

  async function saveSession() {
    setBusy(true);
    try {
      const response = await fetch("/api/v1/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw_transcript: transcript,
          formatted_transcript: formatted,
          target_app_category: "other",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail ?? "Could not save session");
      setHistory((current) => [data.session, ...current.filter((item) => item.id !== data.session.id)].slice(0, 50));
      setStatus("Session saved to your private history");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save session");
    } finally {
      setBusy(false);
    }
  }

  async function loadHistory() {
    setBusy(true);
    try {
      const response = await fetch("/api/v1/sessions");
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail ?? "Could not load history");
      setHistory(data.sessions);
      setStatus(`Loaded ${data.sessions.length} saved sessions`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not load history");
    } finally {
      setBusy(false);
    }
  }

  return <main className="shell">
    <aside className="sidebar"><div className="brand"><span className="mark">f</span> flow<span className="slash">/</span></div><p className="sideLabel">WORKSPACE</p><a className="nav active" href="#lab">◉ &nbsp; Dictation lab</a><a className="nav" href="#personalization">✳ &nbsp; Personalization</a><a className="nav" href="#privacy">◇ &nbsp; Privacy controls</a><div className="sideBottom">● Local development<br/><small>Scaffold · not production</small></div></aside>
    <section className="content"><header className="top"><div><span className="eyebrow">VOICE WORKSPACE</span><h1>Say it. Shape it. Send it.</h1><p>A focused workspace for the next generation of voice-first writing.</p></div><button className="secondary" onClick={checkApi} disabled={busy}>Check API ↗</button></header>
      <div className="status">● {status}<span>LOCAL PROTOTYPE</span></div>
      <AuthPanel />
      <div className="grid" id="lab"><section className="panel editor"><div className="panelTitle"><div><span className="eyebrow">01 / TRANSCRIPT</span><h2>Dictation lab</h2></div><label className="pill">Manual input</label></div><p className="muted">Paste or type a transcript to test formatting. Microphone capture and speech recognition are not connected yet.</p><label className="fieldLabel" htmlFor="raw">Raw transcript</label><textarea id="raw" value={transcript} onChange={event => setTranscript(event.target.value)} placeholder="Example: hey team comma can we move the launch review to friday question mark thanks"/><div className="editorFoot"><small>{words} words · raw text retained in this tab</small><button className="primary" onClick={format} disabled={busy || !transcript.trim()}>{busy ? "Working…" : "Format transcript ↗"}</button></div>
      {formatted && <div className="result"><div className="panelTitle"><strong>Formatted preview</strong><span className="pill">Review required</span></div><p>{formatted}</p><div className="editorFoot"><button className="linkButton" onClick={() => navigator.clipboard.writeText(formatted)}>Copy preview</button><button className="secondary" onClick={saveSession} disabled={busy}>Save to private history</button></div></div>}
      <div className="result"><div className="panelTitle"><strong>Saved sessions</strong><button className="linkButton" onClick={loadHistory} disabled={busy}>Load history</button></div>{history.length ? history.map((item) => <div className="milestone" key={item.id}><span>↳</span><div><strong>{new Date(item.created_at).toLocaleString()}</strong><p>{item.formatted_transcript}</p></div></div>) : <p className="muted">Sign in to save and load your own session history.</p>}</div>
      </section>
      <div className="right"><section className="panel"><div className="iconBox">◌</div><span className="eyebrow">CORE LOOP</span><h3>From voice to finished text</h3><p className="muted">Capture, transcribe, preserve intent, format, then insert with a recovery path.</p><div className="steps"><div><b>1</b>Capture audio <em>Planned</em></div><div><b>2</b>Transcribe <em>Provider pending</em></div><div><b>3</b>Format safely <em>Prototype</em></div><div><b>4</b>Insert text <em>Native client pending</em></div></div></section><section className="panel privacy" id="privacy"><span className="eyebrow">PRIVACY BY DESIGN</span><h3>Controls before convenience</h3><p>Context capture, cloud sync, and model-training consent must be separate, explicit choices.</p><span className="pill">This page does not capture audio</span></section></div></div>
      <section className="panel roadmap" id="personalization"><div className="panelTitle"><div><span className="eyebrow">BUILD PLAN</span><h2>Milestones</h2></div><span className="pill">Evidence-led</span></div>{[["01","Core dictation","Audio capture, ASR, insertion and recovery.","NEXT"],["02","Context & formatting","App-aware styles with meaning-preservation checks.","PLANNED"],["03","Personalization","Vocabulary, replacements, snippets and styles.","PLANNED"],["04","Reliability & release","Privacy tests, performance budgets and platform QA.","PLANNED"]].map(([number,title,description,state])=><div className="milestone" key={number}><span>{number}</span><div><strong>{title}</strong><p>{description}</p></div><em>{state}</em></div>)}</section><footer>FLOW REMAKE <span>Independent implementation · no proprietary source copied</span></footer>
    </section>
  </main>;
}
