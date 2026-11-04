import { useState } from "react";
import "./NextStepFieldGuideRefined.css";

const steps = [
  { label: "Education", heading: "Your learning so far", note: "Start with your foundation." },
  { label: "Interests", heading: "What draws your attention", note: "Follow the energy." },
  { label: "Skills", heading: "Skills in progress", note: "Notice what you already bring." },
  { label: "Experience", heading: "Things you have tried", note: "Experience counts in many forms." },
  { label: "Work style", heading: "How you like to work", note: "A little about your preferences." },
];

const interests = [
  "Understanding people", "Finding patterns", "Building useful things",
  "Making information clearer", "Helping a community", "Learning how products work",
  "Communicating ideas", "Design & visual storytelling",
];
const skills = ["Writing", "Research", "Presentation", "Project coordination", "Data analysis", "Listening", "Planning", "Problem-solving"];
const styles = [
  ["People", "Listening, supporting, bringing people together"],
  ["Problem-solving", "Untangling questions, finding a way forward"],
  ["Creating", "Making, shaping, communicating something new"],
  ["Analyzing", "Looking closely at evidence and patterns"],
];
const roles = [
  ["UX Research Assistant", "Make sense of how people use a product or service, then turn what you learn into useful recommendations.", "People · Research · Design"],
  ["Program Coordinator", "Bring people, schedules, and resources together so a useful program can move forward.", "Planning · Community · Follow-through"],
  ["Content & Communications Associate", "Make complex ideas easier to understand through thoughtful writing, editing, and communication.", "Writing · Clarity · Storytelling"],
];

function Arrow({ back = false }: { back?: boolean }) {
  return <span className={`nfr-arrow ${back ? "nfr-arrow-back" : ""}`} aria-hidden="true">→</span>;
}

export default function NextStepFieldGuideRefined() {
  const [step, setStep] = useState(0);
  const [degree, setDegree] = useState("");
  const [field, setField] = useState("");
  const [courses, setCourses] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [selectedInterests, setSelectedInterests] = useState(["Understanding people", "Making information clearer"]);
  const [selectedSkills, setSelectedSkills] = useState(["Research", "Writing"]);
  const [selectedStyles, setSelectedStyles] = useState(["Analyzing"]);
  const [showResults, setShowResults] = useState(false);

  const toggle = (value: string, values: string[], setValues: (next: string[]) => void) => {
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };
  const progress = Math.round(((step + 1) / steps.length) * 100);

  function loadSample() {
    setDegree("Bachelor’s degree");
    setField("Psychology");
    setCourses("Research methods, statistics, organizational behavior");
    setSelectedInterests(["Understanding people", "Making information clearer", "Learning how products work"]);
    setSelectedSkills(["Research", "Writing", "Presentation"]);
    setSelectedStyles(["Analyzing", "Creating"]);
  }

  return (
    <div className="nfr-app">
      <div className="nfr-gridwash" aria-hidden="true" />
      <header className="nfr-header">
        <div className="nfr-brand">
          <span className="nfr-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M5 25h7v-7h7v-7h7V5" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              <path d="M20 5h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
            </svg>
          </span>
          <span>nextstep<span className="nfr-period">.</span></span>
        </div>
        <div className="nfr-header-meta"><span className="nfr-live-dot" /> FIELD GUIDE <i /> TAKE YOUR TIME</div>
      </header>

      <main className="nfr-main">
        <section className="nfr-intro">
          <div className="nfr-intro-main">
            <div className="nfr-eyebrow"><span>01</span> A PRACTICAL EXPLORATION</div>
            <h1>Your next move.<br /><em>Keep it open.</em></h1>
            <p>Bring what you know, what you enjoy, and what you’re curious to try. We’ll find the overlaps worth exploring.</p>
          </div>
          <aside className="nfr-note">
            <div className="nfr-note-top"><span>BEFORE WE BEGIN</span><span className="nfr-note-arrow">↗</span></div>
            <strong>No perfect-path promises.</strong>
            <p>A clear map of possibilities, grounded in your answers—not a personality type.</p>
            <div className="nfr-note-rule"><span /></div>
          </aside>
        </section>

        {showResults ? (
          <section className="nfr-results">
            <div className="nfr-results-heading">
              <div>
                <div className="nfr-eyebrow"><span>FIELD NOTES</span> / YOUR FIRST DIRECTIONS</div>
                <h2>Possibilities,<br /><em>not predictions.</em></h2>
                <p>Three paths to investigate. Start with curiosity, then check what the day-to-day really looks like.</p>
              </div>
              <button className="nfr-secondary" onClick={() => setShowResults(false)}><Arrow back /> Edit answers</button>
            </div>
            <div className="nfr-role-list">
              {roles.map(([title, description, tags], index) => (
                <article className="nfr-role" key={title}>
                  <span className="nfr-role-index">0{index + 1}</span>
                  <div className="nfr-role-copy"><h3>{title}</h3><p>{description}</p><div className="nfr-role-tags">{tags.split(" · ").map((tag) => <span key={tag}>{tag}</span>)}</div></div>
                  <span className="nfr-fit-label">A STARTING POINT</span>
                </article>
              ))}
            </div>
            <div className="nfr-results-foot">
              <span>These are leads to explore, not a verdict on what you should do.</span>
              <button className="nfr-text-button" onClick={() => { setShowResults(false); setStep(0); }}>← Back to my guide</button>
            </div>
          </section>
        ) : (
          <section className="nfr-workspace">
            <aside className="nfr-rail">
              <div className="nfr-rail-label">YOUR EXPLORATION <span>0{step + 1} / 05</span></div>
              <nav className="nfr-step-list" aria-label="Profile steps">
                {steps.map((item, index) => (
                  <button key={item.label} className={`nfr-step ${step === index ? "is-active" : ""} ${step > index ? "is-done" : ""}`} onClick={() => setStep(index)} aria-current={step === index ? "step" : undefined}>
                    <span className="nfr-step-number">{step > index ? "✓" : `0${index + 1}`}</span>
                    <span>{item.label}</span>
                    {step === index && <span className="nfr-step-arrow">↗</span>}
                  </button>
                ))}
              </nav>
              <div className="nfr-progress">
                <div className="nfr-progress-head"><span>ROUTE PROGRESS</span><b>{progress}%</b></div>
                <div className="nfr-progress-track"><span style={{ width: `${progress}%` }} /></div>
                <p>A few minutes · Saved as you go</p>
              </div>
              <div className="nfr-rail-note"><span className="nfr-compass">✳</span><span>There isn’t one<br />right direction.</span></div>
            </aside>

            <section className="nfr-form-card">
              <div className="nfr-form-heading">
                <div>
                  <div className="nfr-eyebrow"><span>STEP 0{step + 1}</span> / {steps[step].note.toUpperCase()}</div>
                  <h2>{steps[step].heading}</h2>
                  <p>Share only what feels useful. Skip anything or come back later.</p>
                </div>
                <span className="nfr-form-count">0{step + 1}<i />05</span>
              </div>

              {step === 0 && (
                <div className="nfr-fields">
                  <label className="nfr-field"><span>Degree or program <small>OPTIONAL</small></span><input value={degree} onChange={(event) => setDegree(event.target.value)} placeholder="For example, bachelor’s degree" /></label>
                  <label className="nfr-field"><span>Field of study <small>OPTIONAL</small></span><input value={field} onChange={(event) => setField(event.target.value)} placeholder="For example, environmental science" /></label>
                  <label className="nfr-field nfr-wide"><span>Courses, certificates, or training <small>OPTIONAL</small></span><textarea value={courses} onChange={(event) => setCourses(event.target.value)} placeholder="Classes, workshops, or things you learned on your own" /></label>
                  <div className="nfr-helper nfr-wide"><span>i</span> A degree isn’t a requirement. Formal and informal learning both count.</div>
                </div>
              )}
              {step === 1 && (
                <div className="nfr-fields nfr-single">
                  <div className="nfr-field nfr-wide"><span>Pick any that sound like you <small>CHOOSE A FEW, OR SKIP THEM ALL</small></span>
                    <div className="nfr-chips">{interests.map((item) => <button type="button" key={item} className={`nfr-chip ${selectedInterests.includes(item) ? "is-selected" : ""}`} onClick={() => toggle(item, selectedInterests, setSelectedInterests)} aria-pressed={selectedInterests.includes(item)}>{selectedInterests.includes(item) && <span>✓</span>}{item}</button>)}</div>
                  </div>
                  <label className="nfr-field nfr-wide"><span>Anything else you enjoy? <small>OPTIONAL</small></span><textarea placeholder="A subject, activity, or question you like spending time on" /></label>
                </div>
              )}
              {step === 2 && (
                <div className="nfr-fields nfr-single">
                  <div className="nfr-field nfr-wide"><span>Things you can do, even if you’re still learning <small>SELECT ALL THAT FIT</small></span>
                    <div className="nfr-chips">{skills.map((item) => <button type="button" key={item} className={`nfr-chip ${selectedSkills.includes(item) ? "is-selected" : ""}`} onClick={() => toggle(item, selectedSkills, setSelectedSkills)} aria-pressed={selectedSkills.includes(item)}>{selectedSkills.includes(item) && <span>✓</span>}{item}</button>)}</div>
                  </div>
                  <label className="nfr-field nfr-wide"><span>What would you like to get better at? <small>OPTIONAL</small></span><input placeholder="Tools, subjects, or skills you’re curious about" /></label>
                </div>
              )}
              {step === 3 && (
                <div className="nfr-fields nfr-single">
                  <label className="nfr-field nfr-wide"><span>Work, school, volunteering, or projects <small>OPTIONAL</small></span><textarea value={experience} onChange={(event) => setExperience(event.target.value)} placeholder="What did you do? What did you learn, organize, make, or help with?" /></label>
                  <div className="nfr-callout nfr-wide"><strong>Small counts, too.</strong><span>A class project, helping at home, or a student group can all reveal useful skills. No résumé required.</span></div>
                </div>
              )}
              {step === 4 && (
                <div className="nfr-fields nfr-single">
                  <div className="nfr-field nfr-wide"><span>What kinds of work do you tend to enjoy? <small>CHOOSE MORE THAN ONE</small></span>
                    <div className="nfr-style-grid">{styles.map(([title, description], index) => <button type="button" key={title} className={`nfr-style ${selectedStyles.includes(title) ? "is-selected" : ""}`} onClick={() => toggle(title, selectedStyles, setSelectedStyles)} aria-pressed={selectedStyles.includes(title)}><small>0{index + 1}</small><b>{title}</b><span>{description}</span></button>)}</div>
                  </div>
                  <label className="nfr-field"><span>Location <small>OPTIONAL</small></span><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="City or region" /></label>
                  <label className="nfr-field"><span>Work location preference <small>OPTIONAL</small></span><select defaultValue=""><option value="">No preference</option><option>On-site</option><option>Hybrid</option><option>Remote</option><option>Flexible</option></select></label>
                </div>
              )}

              <div className="nfr-actions">
                {step > 0 ? <button className="nfr-text-button" onClick={() => setStep((value) => value - 1)}><Arrow back /> Back</button> : <button className="nfr-sample" onClick={loadSample}>↗ <span>Try a sample profile</span></button>}
                <div className="nfr-actions-right">
                  <span className="nfr-saved"><i /> Saved on this device</span>
                  {step < steps.length - 1
                    ? <button className="nfr-primary" onClick={() => setStep((value) => value + 1)}>Continue <Arrow /></button>
                    : <button className="nfr-primary" onClick={() => setShowResults(true)}>Explore my paths <Arrow /></button>}
                </div>
              </div>
              <div className="nfr-privacy"><span>▣</span> No account needed. Your answers stay in this browser and can be cleared whenever you like.</div>
            </section>
          </section>
        )}
      </main>
    </div>
  );
}
