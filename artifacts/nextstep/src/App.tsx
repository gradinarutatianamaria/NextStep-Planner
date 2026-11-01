import { type ReactNode, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Bookmark, Check, Copy, FileDown, RotateCcw, Sparkles,
} from 'lucide-react';
import { downloadCareerPdf } from '@/lib/career-pdf';
import type { Profile, Recommendation } from '@/lib/career-types';

type StoredState = { profile: Profile; recommendations: Recommendation[] | null; saved: boolean; submitted: boolean };

const STORE_KEY = 'nextstep-browser-demo-v1';
const blankProfile: Profile = {
  education: { degree: '', field: '', courses: '' },
  interests: [], currentSkills: [], desiredSkills: [], experiences: '',
  workStyles: [], location: '', remotePreference: '', industries: [],
};
const sampleProfile: Profile = {
  education: { degree: 'Bachelor’s degree', field: 'Psychology', courses: 'Research methods, statistics, organizational behavior' },
  interests: ['Understanding people', 'Making information clearer', 'Learning how products work'],
  currentSkills: ['Research', 'Writing', 'Presentation', 'Google Sheets'],
  desiredSkills: ['Data visualization', 'Product strategy'],
  experiences: 'Campus research assistant: organized interview notes and shared findings with a faculty team. Volunteer coordinator for a community food program.',
  workStyles: ['Analyzing', 'Creating', 'Problem-solving'],
  location: 'Chicago, IL', remotePreference: 'Hybrid', industries: ['Technology', 'Education', 'Healthcare'],
};
const stepMeta = [
  { title: 'Your learning so far', short: 'Education', kicker: 'Start with your foundation', prompt: 'What have you been learning?' },
  { title: 'What draws your attention', short: 'Interests', kicker: 'Follow the energy', prompt: 'Which topics or activities do you find yourself coming back to?' },
  { title: 'Skills in progress', short: 'Skills', kicker: 'Notice what you already bring', prompt: 'What can you do today, and what would you like to learn next?' },
  { title: 'Things you have tried', short: 'Experience', kicker: 'Experience counts in many forms', prompt: 'Tell us about work, school, volunteering, or personal projects.' },
  { title: 'How you like to work', short: 'Work style', kicker: 'A little about your preferences', prompt: 'Which kinds of work feel most natural to you?' },
];
const interestChoices = [
  'Understanding people', 'Making information clearer', 'Building useful things', 'Finding patterns',
  'Helping a community', 'Learning how products work', 'Communicating ideas', 'Organizing moving parts',
  'Exploring science', 'Improving a process', 'Design and visual storytelling', 'Teaching and learning',
];
const skillChoices = [
  'Writing', 'Research', 'Presentation', 'Project coordination', 'Google Sheets', 'Data analysis',
  'Customer support', 'Design tools', 'Social media', 'Facilitation', 'Coding basics', 'Planning',
  'Listening', 'Problem-solving', 'Content creation', 'Team collaboration',
];
const workStyles: { title: string; detail: string; icon: string }[] = [
  { title: 'People', detail: 'Listening, supporting, or bringing people together', icon: '01' },
  { title: 'Problem-solving', detail: 'Untangling questions and finding a way forward', icon: '02' },
  { title: 'Creating', detail: 'Making, shaping, or communicating something new', icon: '03' },
  { title: 'Analyzing', detail: 'Looking closely at evidence and patterns', icon: '04' },
];
const industriesList = ['Technology', 'Education', 'Healthcare', 'Public service', 'Arts & media', 'Climate & environment', 'Finance', 'Community organizations'];

const paths = [
  {
    title: 'UX Research Assistant',
    description: 'Help teams understand how people use a service or product. Early-career roles often support interviews, usability sessions, and clear summaries of what people need.',
    signals: ['Understanding people', 'Research', 'Analyzing', 'Technology', 'Design and visual storytelling', 'Listening', 'Psychology'],
    strengths: ['Research', 'Listening', 'Writing'],
    build: ['Interview and usability-study practice', 'Research ethics and accessible methods', 'A short case study showing your process'],
    next: ['Try a five-person usability review of a public website and write a one-page findings brief.', 'Explore entry-level research coordinator and UX research assistant job descriptions in an industry you care about.', 'Practice turning one observation into a clear, evidence-based recommendation.'],
  },
  {
    title: 'Program Coordinator',
    description: 'Keep a program moving by coordinating people, schedules, resources, and follow-through. Roles range from campus programs to community and public-service organizations.',
    signals: ['Helping a community', 'Organizing moving parts', 'People', 'Project coordination', 'Education', 'Public service', 'Community organizations'],
    strengths: ['Planning', 'Team collaboration', 'Communication'],
    build: ['Budget and timeline tracking', 'Stakeholder updates', 'Basic evaluation and outcome reporting'],
    next: ['Map a small event or volunteer project from idea to follow-up using a simple timeline.', 'Ask a local nonprofit or campus group about a short-term coordination opportunity.', 'Compare coordinator roles in two sectors to see which day-to-day work appeals.'],
  },
  {
    title: 'Content & Communications Associate',
    description: 'Turn complex ideas into useful, clear messages for a specific audience. Early roles may include writing, editing, newsletters, web updates, or campaign support.',
    signals: ['Making information clearer', 'Communicating ideas', 'Writing', 'Creating', 'Arts & media', 'Content creation', 'Education'],
    strengths: ['Writing', 'Presentation', 'Research'],
    build: ['Editing for different audiences and formats', 'Content planning and basic analytics', 'A small portfolio of published or sample work'],
    next: ['Rewrite a complicated public-facing page so a new reader can understand it quickly.', 'Create two or three samples in different formats, such as a short article and an email.', 'Look for communications assistant roles at organizations whose work you already follow.'],
  },
  {
    title: 'People Operations Coordinator',
    description: 'Support the practical systems that help people join, learn, and do their work. Depending on the organization, this can include onboarding, learning programs, or employee support.',
    signals: ['Understanding people', 'Helping a community', 'People', 'Organizing moving parts', 'Psychology', 'Listening', 'Team collaboration'],
    strengths: ['Listening', 'Organization', 'Communication'],
    build: ['Confidentiality and employment-practice basics', 'People systems and spreadsheet confidence', 'Clear, consistent process documentation'],
    next: ['Draft a thoughtful first-week checklist for someone joining a team.', 'Talk with a people operations professional about the balance of service and process in their work.', 'Search for people coordinator, onboarding coordinator, and learning coordinator roles.'],
  },
  {
    title: 'Junior Data Analyst',
    description: 'Use spreadsheets and other tools to organize information, spot patterns, and answer practical questions. Many junior roles pair analysis with clear communication.',
    signals: ['Finding patterns', 'Analyzing', 'Data analysis', 'Google Sheets', 'Research', 'Improving a process', 'Problem-solving'],
    strengths: ['Research', 'Problem-solving', 'Google Sheets'],
    build: ['SQL fundamentals and data cleaning', 'A visualization tool such as Tableau or Power BI', 'A portfolio project with a written explanation of your findings'],
    next: ['Choose an open dataset connected to a topic you care about and ask one specific question.', 'Practice cleaning, summarizing, and charting the data in a spreadsheet.', 'Read entry-level analyst postings and note which tools appear most often in your target sector.'],
  },
  {
    title: 'Product Operations Associate',
    description: 'Help a product team work smoothly by connecting customer feedback, internal processes, and useful documentation. The role blends organization with curiosity about how products improve.',
    signals: ['Learning how products work', 'Improving a process', 'Organizing moving parts', 'Technology', 'Problem-solving', 'Customer support'],
    strengths: ['Planning', 'Research', 'Team collaboration'],
    build: ['Product lifecycle and roadmap basics', 'Issue tracking and documentation tools', 'Ways to summarize customer feedback'],
    next: ['Choose an app you use and sketch one small improvement, including who it helps and why.', 'Practice writing a concise product feedback brief from several user comments.', 'Explore product operations, product support, and customer experience associate roles.'],
  },
  {
    title: 'Community Engagement Associate',
    description: 'Build relationships between an organization and the people it serves. The work can include outreach, events, listening sessions, and sharing community perspectives.',
    signals: ['Helping a community', 'Teaching and learning', 'People', 'Public service', 'Community organizations', 'Listening'],
    strengths: ['Listening', 'Facilitation', 'Communication'],
    build: ['Inclusive outreach and facilitation', 'Event and contact tracking', 'Community-informed evaluation'],
    next: ['Volunteer for one community event and notice what makes participation welcoming.', 'Practice writing an outreach message that is specific, accessible, and easy to act on.', 'Look at community engagement roles in local government, education, or mission-led organizations.'],
  },
];

function listFrom(value: string) {
  return value.split(/[,\n;]/).map((item) => item.trim()).filter(Boolean);
}
function textFrom(list: string[]) {
  return list.join(', ');
}
function profileFromStored(): StoredState | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) as StoredState : null;
  } catch {
    return null;
  }
}
function buildRecommendations(profile: Profile): Recommendation[] {
  const signals = [
    ...profile.interests, ...profile.currentSkills, ...profile.desiredSkills,
    ...profile.workStyles, ...profile.industries, profile.education.field,
    profile.education.courses, profile.experiences,
  ].join(' ').toLowerCase();
  const ranked = paths.map((path) => {
    const found = path.signals.filter((signal) => signals.includes(signal.toLowerCase()));
    const styleMatches = path.signals.filter((signal) => profile.workStyles.some((style) => signal.toLowerCase().includes(style.toLowerCase())));
    const score = Math.min(94, 54 + found.length * 7 + Math.min(styleMatches.length, 2) * 3);
    const existing = [...profile.currentSkills, ...profile.desiredSkills, ...listFrom(profile.experiences)]
      .filter((item, index, all) => all.findIndex((other) => other.toLowerCase() === item.toLowerCase()) === index)
      .filter((item) => path.signals.some((signal) => signal.toLowerCase().includes(item.toLowerCase()) || item.toLowerCase().includes(signal.toLowerCase())))
      .slice(0, 4);
    const strengths = existing.length ? existing : path.strengths.slice(0, 2);
    const rationale = found.length
      ? `This path connects with ${found.slice(0, 3).join(', ')}${found.length > 3 ? ' and other signals in your answers' : ''}. That is a useful reason to explore it—not a prediction of how you would perform.`
      : `Your answers do not point strongly to one specific role, but this can still be a useful option to compare against your interests and preferred work style.`;
    const searchContext = [
      profile.location ? `near ${profile.location}` : '',
      profile.industries.length ? `in ${profile.industries.slice(0, 2).join(' or ')} settings` : '',
      profile.remotePreference && profile.remotePreference !== 'Flexible'
        ? `with ${profile.remotePreference.toLowerCase()} work options`
        : '',
    ].filter(Boolean);
    const nextSteps = searchContext.length
      ? [
          ...path.next.slice(0, 2),
          `Search for ${path.title.toLowerCase()} roles ${searchContext.join(', ')} and compare current employer requirements.`,
        ]
      : path.next;
    return {
      title: path.title, description: path.description, rationale,
      existingStrengths: strengths, skillsToBuild: path.build, nextSteps, score,
    };
  });
  return ranked.sort((a, b) => b.score - a.score).slice(0, 4);
}

function App() {
  const restored = useMemo(profileFromStored, []);
  const [profile, setProfile] = useState<Profile>(restored?.profile ?? blankProfile);
  const [step, setStep] = useState(0);
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(restored?.recommendations ?? null);
  const [saved, setSaved] = useState(restored?.saved ?? false);
  const [submitted, setSubmitted] = useState(restored?.submitted ?? false);
  const [toast, setToast] = useState('');
  const [working, setWorking] = useState(false);
  const [pdfWorking, setPdfWorking] = useState(false);

  useEffect(() => {
    const data: StoredState = { profile, recommendations, saved, submitted };
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch { /* Storage may be unavailable in private browsing. */ }
  }, [profile, recommendations, saved, submitted]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function updateProfile<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((previous) => ({ ...previous, [key]: value }));
  }
  function updateEducation(key: keyof Profile['education'], value: string) {
    setProfile((previous) => ({ ...previous, education: { ...previous.education, [key]: value } }));
  }
  function toggleList(key: 'interests' | 'currentSkills' | 'desiredSkills' | 'workStyles' | 'industries', value: string) {
    setProfile((previous) => {
      const current = previous[key] as string[];
      return { ...previous, [key]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value] };
    });
  }
  function loadSample() {
    setProfile(sampleProfile);
    setRecommendations(null);
    setSaved(false);
    setSubmitted(false);
    setStep(0);
    setToast('Sample profile loaded. Make it your own as you go.');
  }
  function showResults() {
    setWorking(true);
    window.setTimeout(() => {
      setRecommendations(buildRecommendations(profile));
      setSubmitted(true);
      setSaved(false);
      setWorking(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 450);
  }
  function restart() {
    if (!window.confirm('Start a fresh exploration? Your current profile and saved recommendations will be cleared.')) return;
    setProfile(blankProfile);
    setRecommendations(null);
    setSaved(false);
    setSubmitted(false);
    setStep(0);
    localStorage.removeItem(STORE_KEY);
    setToast('Fresh start. Nothing from the last profile was kept.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  async function copyRecommendations() {
    if (!recommendations) return;
    const content = recommendations.map((item, index) =>
      `${index + 1}. ${item.title}\n${item.description}\nWhy it may fit: ${item.rationale}\nStrengths: ${item.existingStrengths.join(', ')}\nSkills to build: ${item.skillsToBuild.join(', ')}\nNext steps: ${item.nextSteps.join(' ')}`,
    ).join('\n\n');
    try {
      await navigator.clipboard.writeText(`NextStep career exploration\n\n${content}\n\nExploratory starting points only—not guaranteed outcomes or professional advice.`);
      setToast('Recommendations copied to your clipboard.');
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = content;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      setToast('Recommendations copied to your clipboard.');
    }
  }
  async function downloadPdf() {
    if (!recommendations || pdfWorking) return;
    setPdfWorking(true);
    try {
      await downloadCareerPdf(profile, recommendations);
      setToast('Your career plan PDF has been downloaded.');
    } catch (error) {
      console.error('Unable to create the career plan PDF', error);
      setToast('We could not create the PDF. Please try again.');
    } finally {
      setPdfWorking(false);
    }
  }
  function editAnswers() {
    setSubmitted(false);
    setStep(0);
  }

  const stepPercent = Math.round(((step + 1) / stepMeta.length) * 100);
  const current = stepMeta[step];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand" data-testid="text-brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="21" height="21" fill="none">
              <path d="M3.5 20H8v-4h5v-4h5V8h2.5" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12.5" cy="4.8" r="1.45" fill="currentColor" />
              <path d="m12.1 6.5-2 4.2 3.1 1.8 2.3-3.6m-3-2.2-3.2 2.1m.8 2-1.1 4.9m1.1-4.9 4.2 1.2" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          nextstep
        </div>
        <div className="top-meta">A small step toward a clearer direction</div>
      </header>
      <main className="main-wrap">
        <section className="intro-grid">
          <div>
            <div className="eyebrow">A career exploration notebook</div>
            <h1 className="intro-title">Your next move,<br /><em>not your whole life.</em></h1>
            <p className="intro-copy">A thoughtful starting point for figuring out what could fit. Bring what you know, what you enjoy, and what you are curious to try.</p>
          </div>
          <aside className="intro-aside">
            <strong>Built around your answers, not a personality type.</strong>
            No perfect-path promises here. Just a few practical directions and clear ways to explore them.
          </aside>
        </section>

        {recommendations && submitted ? (
          <Results
            recommendations={recommendations}
            saved={saved}
            onSave={() => { setSaved((value) => !value); setToast(saved ? 'Saved recommendations removed.' : 'Recommendations saved on this device.'); }}
            onCopy={copyRecommendations}
            onDownload={downloadPdf}
            pdfWorking={pdfWorking}
            onEdit={editAnswers}
            onRestart={restart}
          />
        ) : (
          <div className="workspace">
            <aside className="rail">
              <p className="rail-label">Your exploration</p>
              <nav className="step-nav" aria-label="Profile steps">
                {stepMeta.map((item, index) => (
                  <button
                    key={item.short}
                    className={`step-link ${step === index ? 'active' : ''} ${step > index ? 'done' : ''}`}
                    onClick={() => setStep(index)}
                    aria-current={step === index ? 'step' : undefined}
                    data-testid={`button-step-${index + 1}`}
                  >
                    <span className="step-num">{step > index ? <Check size={13} /> : String(index + 1).padStart(2, '0')}</span>
                    {item.short}
                  </button>
                ))}
              </nav>
              <div className="rail-progress">
                <div className="progress-caption"><span>YOUR PROGRESS</span><span>{stepPercent}%</span></div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${stepPercent}%` }} /></div>
              </div>
            </aside>

            <section className="form-card fade-in" key={step}>
              <div className="eyebrow">{current.kicker}</div>
              <h2 className="step-heading">{current.title}</h2>
              <p className="step-sub">{current.prompt} Share only what feels useful. You can skip anything or come back to it.</p>
              {step === 0 && <EducationStep profile={profile} onChange={updateEducation} />}
              {step === 1 && <InterestsStep profile={profile} onToggle={toggleList} onChange={(value) => updateProfile('interests', value)} />}
              {step === 2 && <SkillsStep profile={profile} onToggle={toggleList} onChange={updateProfile} />}
              {step === 3 && <ExperienceStep profile={profile} onChange={(value) => updateProfile('experiences', value)} />}
              {step === 4 && <PreferencesStep profile={profile} onToggle={toggleList} onChange={updateProfile} />}

              <div className="form-actions">
                <div>
                  {step > 0 ? <button className="btn btn-quiet" onClick={() => setStep((value) => value - 1)} data-testid="button-back"><ArrowLeft size={15} /> Back</button> : (
                    <button className="sample-button" onClick={loadSample} data-testid="button-load-sample"><Sparkles size={14} /> Try a sample profile</button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="save-note"><Check size={12} /> Saved on this device</span>
                  {step < stepMeta.length - 1 ? (
                    <button className="btn btn-primary" onClick={() => setStep((value) => value + 1)} data-testid="button-continue">Continue <ArrowRight size={15} /></button>
                  ) : (
                    <button className="btn btn-accent" onClick={showResults} disabled={working} data-testid="button-find-paths">
                      {working ? <><span className="loading-dot" /> Finding paths</> : <>Explore my paths <ArrowRight size={15} /></>}
                    </button>
                  )}
                </div>
              </div>
              <p className="privacy-note">No account needed. Your answers stay in this browser and can be cleared whenever you like.</p>
            </section>
          </div>
        )}
      </main>
      {toast && <div className="toast" role="status" data-testid="status-toast">{toast}</div>}
    </div>
  );
}

function TextAreaField({ label, hint, value, placeholder, onChange, testId }: {
  label: string; hint?: string; value: string; placeholder: string; onChange: (value: string) => void; testId: string;
}) {
  return <label className="form-field">
    <span className="field-label">{label}{hint && <span className="field-hint">{hint}</span>}</span>
    <textarea className="textarea" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} data-testid={testId} />
  </label>;
}
function InputField({ label, value, placeholder, onChange, testId }: {
  label: ReactNode; value: string; placeholder: string; onChange: (value: string) => void; testId: string;
}) {
  return <label className="form-field">
    <span className="field-label">{label}</span>
    <input className="input" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} data-testid={testId} />
  </label>;
}
function ChipChoices({ values, selected, onToggle }: { values: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return <div className="chip-grid">
    {values.map((value) => <button type="button" key={value} className={`choice-chip ${selected.includes(value) ? 'selected' : ''}`} onClick={() => onToggle(value)} aria-pressed={selected.includes(value)} data-testid={`button-choice-${value.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>{value}</button>)}
  </div>;
}
function EducationStep({ profile, onChange }: { profile: Profile; onChange: (key: keyof Profile['education'], value: string) => void }) {
  return <>
    <div className="field-row">
      <InputField label="Degree or program" value={profile.education.degree} placeholder="For example, bachelor's degree" onChange={(value) => onChange('degree', value)} testId="input-degree" />
      <InputField label="Field of study" value={profile.education.field} placeholder="For example, environmental science" onChange={(value) => onChange('field', value)} testId="input-field-of-study" />
    </div>
    <TextAreaField label="Courses, certificates, or training" hint="Optional. Separate items with commas." value={profile.education.courses} placeholder="Classes, certificates, workshops, or things you learned on your own" onChange={(value) => onChange('courses', value)} testId="input-courses" />
    <p className="privacy-note">A degree is not a requirement for this exercise. Include formal or informal learning that feels relevant.</p>
  </>;
}
function InterestsStep({ profile, onToggle, onChange }: { profile: Profile; onToggle: (key: 'interests', value: string) => void; onChange: (value: string[]) => void }) {
  return <>
    <div className="form-field">
      <span className="field-label">Pick any that sound like you <span className="field-hint">Choose a few, or skip them all. You can change these later.</span></span>
      <ChipChoices values={interestChoices} selected={profile.interests} onToggle={(value) => onToggle('interests', value)} />
    </div>
    <TextAreaField label="Anything else you enjoy?" hint="Optional. Separate items with commas." value={textFrom(profile.interests.filter((item) => !interestChoices.includes(item)))} placeholder="A subject, activity, or question you like spending time on" onChange={(value) => onChange([...profile.interests.filter((item) => interestChoices.includes(item)), ...listFrom(value)])} testId="input-other-interests" />
    <p className="privacy-note">The interests above are just prompts, not a personality test.</p>
  </>;
}
function SkillsStep({ profile, onToggle, onChange }: {
  profile: Profile;
  onToggle: (key: 'currentSkills' | 'desiredSkills', value: string) => void;
  onChange: <K extends keyof Profile>(key: K, value: Profile[K]) => void;
}) {
  return <>
    <div className="form-field">
      <span className="field-label">Things you can do, even if you are still learning <span className="field-hint">Skills can come from school, life, work, or projects.</span></span>
      <ChipChoices values={skillChoices} selected={profile.currentSkills} onToggle={(value) => onToggle('currentSkills', value)} />
    </div>
    <TextAreaField label="Other current skills" hint="Optional. Separate items with commas." value={textFrom(profile.currentSkills.filter((item) => !skillChoices.includes(item)))} placeholder="Anything you would add to that list" onChange={(value) => onChange('currentSkills', [...profile.currentSkills.filter((item) => skillChoices.includes(item)), ...listFrom(value)])} testId="input-other-skills" />
    <div className="form-field">
      <span className="field-label">What would you like to get better at? <span className="field-hint">Choose as many as you like.</span></span>
      <ChipChoices values={skillChoices} selected={profile.desiredSkills} onToggle={(value) => onToggle('desiredSkills', value)} />
    </div>
    <TextAreaField label="Other skills you are curious about" hint="Optional. Separate items with commas." value={textFrom(profile.desiredSkills.filter((item) => !skillChoices.includes(item)))} placeholder="A tool, subject, or capability you would like to explore" onChange={(value) => onChange('desiredSkills', [...profile.desiredSkills.filter((item) => skillChoices.includes(item)), ...listFrom(value)])} testId="input-other-desired-skills" />
  </>;
}
function ExperienceStep({ profile, onChange }: { profile: Profile; onChange: (value: string) => void }) {
  return <>
    <TextAreaField label="Work, internships, volunteering, or projects" hint="Optional. A few notes are plenty." value={profile.experiences} placeholder="What did you do? What did you learn, organize, make, or help with?" onChange={onChange} testId="input-experiences" />
    <div className="choice-grid">
      <div className="choice-card"><span className="choice-title">Small counts, too</span><span className="choice-description">A class project, helping at home, or a student group can all reveal useful skills.</span></div>
      <div className="choice-card"><span className="choice-title">No résumé required</span><span className="choice-description">Keep it informal. This is a place to notice experience, not prove it.</span></div>
    </div>
  </>;
}
function PreferencesStep({ profile, onToggle, onChange }: {
  profile: Profile;
  onToggle: (key: 'workStyles' | 'industries', value: string) => void;
  onChange: <K extends keyof Profile>(key: K, value: Profile[K]) => void;
}) {
  return <>
    <div className="form-field">
      <span className="field-label">What kinds of work do you tend to enjoy? <span className="field-hint">Choose more than one if it fits.</span></span>
      <div className="choice-grid">
        {workStyles.map((item) => <button type="button" key={item.title} className={`choice-card ${profile.workStyles.includes(item.title) ? 'selected' : ''}`} onClick={() => onToggle('workStyles', item.title)} aria-pressed={profile.workStyles.includes(item.title)} data-testid={`button-style-${item.title.toLowerCase().replace(/[^a-z]+/g, '-')}`}>
          <span className="choice-title"><span className="mono" style={{ color: '#bd654b', marginRight: 9, fontSize: 10 }}>{item.icon}</span>{item.title}</span><span className="choice-description">{item.detail}</span>
        </button>)}
      </div>
    </div>
    <div className="field-row">
      <InputField label={<>Location <span className="optional-tag">OPTIONAL</span></>} value={profile.location} placeholder="City or region" onChange={(value) => onChange('location', value)} testId="input-location" />
      <label className="form-field">
        <span className="field-label">Work location preference <span className="optional-tag">OPTIONAL</span></span>
        <select className="select" value={profile.remotePreference} onChange={(event) => onChange('remotePreference', event.target.value)} data-testid="select-remote-preference">
          <option value="">No preference</option><option value="On-site">Mostly on-site</option><option value="Hybrid">Hybrid</option><option value="Remote">Mostly remote</option><option value="Flexible">Flexible</option>
        </select>
      </label>
    </div>
    <div className="form-field">
      <span className="field-label">Industries or settings you are curious about <span className="optional-tag">OPTIONAL</span></span>
      <ChipChoices values={industriesList} selected={profile.industries} onToggle={(value) => onToggle('industries', value)} />
    </div>
    <p className="privacy-note">Location and industry help with exploration context; they do not filter out the possibilities shown.</p>
  </>;
}

function Results({ recommendations, saved, onSave, onCopy, onDownload, pdfWorking, onEdit, onRestart }: {
  recommendations: Recommendation[]; saved: boolean; onSave: () => void; onCopy: () => void; onDownload: () => void; pdfWorking: boolean; onEdit: () => void; onRestart: () => void;
}) {
  return <div className="fade-in">
    <section className="result-header">
      <div className="eyebrow">A few directions worth a closer look</div>
      <h2 className="result-title">Possibilities, not<br />predictions.</h2>
      <p className="result-intro">We connected patterns across your interests, skills, experience, and work preferences. Use these as thoughtful leads to investigate—not as a verdict on what you should do.</p>
      <div className="result-toolbar">
        <button className="btn btn-primary" onClick={onSave} data-testid="button-save-recommendations">{saved ? <Check size={15} /> : <Bookmark size={15} />}{saved ? 'Saved on this device' : 'Save recommendations'}</button>
        <button className="btn btn-quiet" onClick={onCopy} data-testid="button-copy-recommendations"><Copy size={15} /> Copy paths</button>
        <button className="btn btn-quiet" onClick={onDownload} disabled={pdfWorking} data-testid="button-download-pdf">
          {pdfWorking ? <span className="loading-dot" /> : <FileDown size={15} />}
          {pdfWorking ? 'Preparing PDF' : 'Download PDF'}
        </button>
        <button className="btn btn-quiet" onClick={onEdit} data-testid="button-edit-answers"><ArrowLeft size={15} /> Edit answers</button>
      </div>
    </section>
    <div className="recommendation-list">
      {recommendations.map((item, index) => <RecommendationCard recommendation={item} index={index} key={item.title} />)}
    </div>
    <div className="result-footer">
      <p>Your profile and saved result stay in this browser. Explore at your own pace and verify role requirements with current job postings.</p>
      <button className="btn btn-quiet" onClick={onRestart} data-testid="button-restart"><RotateCcw size={14} /> Start fresh</button>
    </div>
  </div>;
}
function RecommendationCard({ recommendation, index }: { recommendation: Recommendation; index: number }) {
  return <article className="recommendation" data-testid={`card-recommendation-${index + 1}`}>
    <div className="recommend-top">
      <div>
        <div className="role-index">PATH {String(index + 1).padStart(2, '0')}</div>
        <h3 className="role-title" data-testid={`text-role-title-${index + 1}`}>{recommendation.title}</h3>
        <p className="role-description">{recommendation.description}</p>
      </div>
      <div className="fit-label"><strong>{recommendation.score}%</strong> signal overlap</div>
    </div>
    <div className="recommend-details">
      <div className="detail-block">
        <h4>Why this showed up</h4>
        <p>{recommendation.rationale}</p>
      </div>
      <div className="detail-block">
        <h4>Strengths you can bring</h4>
        <div className="tag-row">{recommendation.existingStrengths.map((skill) => <span className="skill-tag" key={skill}>{skill}</span>)}</div>
      </div>
      <div className="detail-block">
        <h4>Skills to build</h4>
        <div className="tag-row">{recommendation.skillsToBuild.map((skill) => <span className="skill-tag build" key={skill}>{skill}</span>)}</div>
      </div>
      <div className="detail-block">
        <h4>Try a next step</h4>
        <ol className="next-list">{recommendation.nextSteps.slice(0, 3).map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><span>{step}</span></li>)}</ol>
      </div>
    </div>
  </article>;
}

export default App;
