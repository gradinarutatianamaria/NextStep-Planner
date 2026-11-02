import { useState } from "react";
import "./NextStepFieldGuide.css";

const steps = [
  { label: "Education", heading: "Your learning so far", note: "Start with your foundation." },
  { label: "Interests", heading: "What draws your attention", note: "Follow the energy." },
  { label: "Skills", heading: "Skills in progress", note: "Notice what you already bring." },
  { label: "Experience", heading: "Things you have tried", note: "Experience counts in many forms." },
  { label: "Work style", heading: "How you like to work", note: "A little about your preferences." },
];

const interestOptions = [
  "Understanding people",
  "Finding patterns",
  "Building useful things",
  "Making information clearer",
  "Helping a community",
  "Learning how products work",
  "Communicating ideas",
  "Design & visual storytelling",
];

const skillOptions = ["Writing", "Research", "Presentation", "Project coordination", "Data analysis", "Listening", "Planning", "Problem-solving"];

function Arrow({ back = false }: { back?: boolean }) {
  return <span className={`nf-arrow ${back ? "is-back" : ""}`} aria-hidden="true">→</span>;
}

export default function NextStepFieldGuide() {
  const [step, setStep] = useState(0);
  const [degree, setDegree] = useState("");
  const [field, setField] = useState("");
  const [courses, setCourses] = useState("");
  const [selected, setSelected] = useState<string[]>(["Understanding people", "Making information clearer"]);
  const [showResults, setShowResults] = useState(false);

  const toggle = (value: string) => {
    setSelected((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  return (
    <div className="nf-app">
      <div className="nf-page-grid" aria-hidden="true" />
      <header className="nf-topbar">
        <div className="nf-brand">
          <span className="nf-mark" aria-hidden="true">
            <svg viewBox="0 0 30 30" fill="none">
              <path d="M5 23h6v-6h6v-6h6V5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" strokeLinejoin="miter" />
              <path d="M18 5h5v5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
            </svg>
          </span>
          <span>nextstep<span className="nf-brand-period">.</span></span>
        </div>
        <div className="nf-topline"><span className="nf-topline-dot" /> CAREER FIELD GUIDE <span className="nf-topline-divider">/</span> TAKE YOUR TIME</div>
      </header>

      <main className="nf-main">
        <section className="nf-intro">
          <div className="nf-intro-copy">
            <div className="nf-kicker"><span>01</span> A PRACTICAL EXPLORATION</div>
            <h1>Your next move.<br /><span>Keep it open.</span></h1>
            <p>Bring what you know, what you enjoy, and what you’re curious to try. We’ll turn the overlaps into a few directions worth exploring.</p>
          </div>
          <aside className="nf-note">
            <span className="nf-note-index">A NOTE BEFORE WE START</span>
            <div className="nf-note-mark">↗</div>
            <strong>No perfect-path promises.</strong>
            <p>Just a clear map of possibilities, grounded in your answers—not a personality type.</p>
          </aside>
        </section>

        {showResults ? (
          <section className="nf-results">
            <div className="nf-result-top">
              <div>
                <div className="nf-kicker"><span>FIELD NOTES</span> / YOUR FIRST DIRECTIONS</div>
                <h2>Possibilities,<br /><i>not predictions.</i></h2>
                <p>Three paths to investigate. Start with curiosity, then check what the day-to-day really looks like.</p>
              </div>
              <button className="nf-outline-button" onClick={() => setShowResults(false)}><Arrow back /> Edit answers</button>
            </div>
            <div className="nf-path-list">
              {["UX Research Assistant", "Program Coordinator", "Content & Communications Associate"].map((title, index) => (
                <article className="nf-path-card" key={title}>
                  <span className="nf-path-no">0{index + 1}</span>
                  <div><h3>{title}</h3><p>{index === 0 ? "Understand how people use products and services; turn what you learn into useful recommendations." : index === 1 ? "Bring people, schedules, and resources together so a useful program can move forward." : "Make complex ideas easier to understand through writing, editing, and thoughtful communication."}</p></div>
                  <span className="nf-fit">A STARTING POINT</span>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <section className="nf-workspace">
            <aside className="nf-rail">
              <div className="nf-rail-label">YOUR EXPLORATION</div>
              <nav className="nf-step-list" aria-label="Profile steps">
                {steps.map((item, index) => (
                  <button key={item.label} className={`nf-step ${step === index ? "active" : ""} ${step > index ? "complete" : ""}`} onClick={() => setStep(index)}>
                    <span className="nf-step-mark">{step > index ? "✓" : `0${index + 1}`}</span>
                    <span>{item.label}</span>
                    {step === index && <span className="nf-step-pointer">↗</span>}
                  </button>
                ))}
              </nav>
              <div className="nf-progress">
                <div className="nf-progress-copy"><span>ROUTE PROGRESS</span><b>{Math.round(((step + 1) / steps.length) * 100)}%</b></div>
                <div className="nf-progress-track"><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
                <div className="nf-progress-foot">A few minutes · Save as you go</div>
              </div>
              <div className="nf-rail-foot"><span className="nf-rail-sun">✳</span><span>There isn’t one<br />right direction.</span></div>
            </aside>

            <section className="nf-form-card">
              <div className="nf-form-top">
                <div>
                  <div className="nf-kicker"><span>STEP 0{step + 1}</span> / {steps[step].note.toUpperCase()}</div>
                  <h2>{steps[step].heading}</h2>
                  <p>Share only what feels useful. You can skip anything or come back to it.</p>
                </div>
                <span className="nf-form-index">0{step + 1}<i>—</i>05</span>
              </div>

              {step === 0 && (
                <div className="nf-fields">
                  <label className="nf-field">
                    <span>Degree or program <small>OPTIONAL</small></span>
                    <input value={degree} onChange={(event) => setDegree(event.target.value)} placeholder="For example, bachelor's degree" />
                  </label>
                  <label className="nf-field">
                    <span>Field of study <small>OPTIONAL</small></span>
                    <input value={field} onChange={(event) => setField(event.target.value)} placeholder="For example, environmental science" />
                  </label>
                  <label className="nf-field nf-field-wide">
                    <span>Courses, certificates, or training <small>OPTIONAL</small></span>
                    <textarea value={courses} onChange={(event) => setCourses(event.target.value)} placeholder="Classes, workshops, or things you learned on your own" />
                  </label>
                  <div className="nf-inline-note"><span>i</span> A degree is not a requirement. Formal or informal learning both count.</div>
                </div>
              )}

              {step === 1 && (
                <div className="nf-fields nf-options-area">
                  <div className="nf-field nf-field-wide"><span>Pick any that sound like you <small>CHOOSE A FEW, OR SKIP THEM ALL</small></span>
                    <div className="nf-chips">{interestOptions.map((option) => <button key={option} className={`nf-chip ${selected.includes(option) ? "chosen" : ""}`} onClick={() => toggle(option)} aria-pressed={selected.includes(option)}>{selected.includes(option) && <span>✓</span>}{option}</button>)}</div>
                  </div>
                  <label className="nf-field nf-field-wide"><span>Anything else you enjoy? <small>OPTIONAL</small></span><textarea placeholder="A subject, activity, or question you like spending time on" /></label>
                </div>
              )}

              {step === 2 && (
                <div className="nf-fields nf-options-area">
                  <div className="nf-field nf-field-wide"><span>Things you can do, even if you’re still learning <small>SELECT ALL THAT FIT</small></span>
                    <div className="nf-chips">{skillOptions.map((option) => <button key={option} className={`nf-chip ${selected.includes(option) ? "chosen" : ""}`} onClick={() => toggle(option)} aria-pressed={selected.includes(option)}>{selected.includes(option) && <span>✓</span>}{option}</button>)}</div>
                  </div>
                  <label className="nf-field nf-field-wide"><span>What would you like to get better at? <small>OPTIONAL</small></span><input placeholder="Tools, subjects, or skills you’re curious about" /></label>
                </div>
              )}

              {step === 3 && (
                <div className="nf-fields nf-options-area">
                  <label className="nf-field nf-field-wide"><span>Work, school, volunteering, or projects <small>OPTIONAL</small></span><textarea placeholder="What did you do? What did you learn, organize, make, or help with?" /></label>
                  <div className="nf-side-callout"><b>Small counts, too.</b><span>A class project, helping at home, or a student group can reveal useful skills. No résumé required.</span></div>
                </div>
              )}

              {step === 4 && (
                <div className="nf-fields nf-options-area">
                  <div className="nf-field nf-field-wide"><span>What kinds of work do you tend to enjoy? <small>CHOOSE MORE THAN ONE</small></span>
                    <div className="nf-style-grid">{[["People", "Listening, supporting, bringing people together"], ["Problem-solving", "Untangling questions, finding a way forward"], ["Creating", "Making, shaping, communicating something new"], ["Analyzing", "Looking closely at evidence and patterns"]].map(([title, detail], index) => <button key={title} className={`nf-style ${selected.includes(title) ? "chosen" : ""}`} onClick={() => toggle(title)}><small>0{index + 1}</small><b>{title}</b><span>{detail}</span></button>)}</div>
                  </div>
                  <label className="nf-field"><span>Location <small>OPTIONAL</small></span><input placeholder="City or region" /></label>
                  <label className="nf-field"><span>Work location preference <small>OPTIONAL</small></span><select defaultValue=""><option value="">No preference</option><option>On-site</option><option>Hybrid</option><option>Remote</option><option>Flexible</option></select></label>
                </div>
              )}

              <div className="nf-form-actions">
                {step > 0 ? <button className="nf-back" onClick={() => setStep((current) => current - 1)}><Arrow back /> Back</button> : <button className="nf-sample" onClick={() => { setDegree("Bachelor’s degree"); setField("Psychology"); setCourses("Research methods, statistics, organizational behavior"); }}>↗ <span>Try a sample profile</span></button>}
                <div className="nf-action-right">
                  <span className="nf-saved"><span /> Saved on this device</span>
                  {step < steps.length - 1 ? <button className="nf-continue" onClick={() => setStep((current) => current + 1)}>Continue <Arrow /></button> : <button className="nf-continue" onClick={() => setShowResults(true)}>Explore my paths <Arrow /></button>}
                </div>
              </div>
              <div className="nf-privacy"><span className="nf-lock">▣</span> No account needed. Your answers stay in this browser and can be cleared whenever you like.</div>
            </section>
          </section>
        )}
      </main>
    </div>
  );
}
