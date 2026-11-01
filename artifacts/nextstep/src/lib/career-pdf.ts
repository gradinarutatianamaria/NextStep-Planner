import type { Profile, Recommendation } from './career-types';

export async function downloadCareerPdf(
  profile: Profile,
  recommendations: Recommendation[],
) {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ format: 'a4', unit: 'mm' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const ink: [number, number, number] = [36, 41, 58];
  const muted: [number, number, number] = [104, 105, 106];
  const accent: [number, number, number] = [189, 101, 75];
  let y = 22;

  const safeText = (value: string) =>
    value
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/[–—]/g, '-')
      .replace(/…/g, '...');

  const ensureSpace = (height = 8) => {
    if (y + height > pageHeight - 19) {
      pdf.addPage();
      y = 20;
    }
  };

  const addText = (
    value: string,
    options: {
      size?: number;
      style?: 'normal' | 'bold' | 'italic';
      color?: [number, number, number];
      indent?: number;
      gap?: number;
    } = {},
  ) => {
    const {
      size = 10,
      style = 'normal',
      color = ink,
      indent = 0,
      gap = 2,
    } = options;
    pdf.setFont('helvetica', style);
    pdf.setFontSize(size);
    pdf.setTextColor(...color);
    const lines = pdf.splitTextToSize(
      safeText(value || 'Not provided'),
      contentWidth - indent,
    ) as string[];
    for (const line of lines) {
      ensureSpace(6);
      pdf.text(line, margin + indent, y);
      y += size * 0.48;
    }
    y += gap;
  };

  const addSection = (title: string) => {
    ensureSpace(15);
    y += 3;
    pdf.setDrawColor(225, 218, 205);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 8;
    addText(title.toUpperCase(), {
      size: 9,
      style: 'bold',
      color: accent,
      gap: 3,
    });
  };

  const addField = (label: string, value: string) => {
    addText(label, { size: 9, style: 'bold', gap: 1 });
    addText(value, { size: 10, color: muted, gap: 3 });
  };

  pdf.setProperties({
    title: 'NextStep Career Exploration',
    subject: 'Career profile and recommendations',
    author: 'NextStep',
  });
  addText('NEXTSTEP  |  CAREER EXPLORATION', {
    size: 9,
    style: 'bold',
    color: accent,
    gap: 5,
  });
  addText('Your profile + career paths', {
    size: 21,
    style: 'bold',
    gap: 2,
  });
  addText(
    `Prepared ${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`,
    { size: 9, color: muted, gap: 4 },
  );

  addSection('Your profile');
  addField('Degree or program', profile.education.degree);
  addField('Field of study', profile.education.field);
  addField('Courses, certificates, or training', profile.education.courses);
  addField('Interests', profile.interests.join(', '));
  addField('Current skills', profile.currentSkills.join(', '));
  addField('Skills to develop', profile.desiredSkills.join(', '));
  addField('Work, internship, volunteer, or project experience', profile.experiences);
  addField('Preferred work styles', profile.workStyles.join(', '));
  addField('Location', profile.location);
  addField('Work location preference', profile.remotePreference);
  addField('Industries or settings', profile.industries.join(', '));

  addSection('Career paths to explore');
  for (const [index, recommendation] of recommendations.entries()) {
    ensureSpace(23);
    addText(`${String(index + 1).padStart(2, '0')}  ${recommendation.title}`, {
      size: 14,
      style: 'bold',
      gap: 2,
    });
    addText(recommendation.description, { color: muted, gap: 3 });
    addField('Why it may fit', recommendation.rationale);
    addField('Strengths you can bring', recommendation.existingStrengths.join(', '));
    addField('Skills or qualifications to build', recommendation.skillsToBuild.join(', '));
    addText('PRACTICAL NEXT STEPS', {
      size: 9,
      style: 'bold',
      color: accent,
      gap: 2,
    });
    recommendation.nextSteps.slice(0, 3).forEach((step, stepIndex) => {
      addText(`${stepIndex + 1}. ${step}`, { indent: 2, color: muted, gap: 2 });
    });
    y += 3;
  }

  addSection('A note about these suggestions');
  addText(
    'These career matches are exploratory starting points, not guaranteed outcomes or professional advice. Role requirements and availability vary, so check current job postings and other reliable sources as you explore.',
    { color: muted, gap: 4 },
  );

  const pageCount = pdf.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    pdf.setPage(page);
    pdf.setDrawColor(225, 218, 205);
    pdf.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(...muted);
    pdf.text('NextStep  |  Possibilities, not predictions.', margin, pageHeight - 8);
    pdf.text(`${page} / ${pageCount}`, pageWidth - margin, pageHeight - 8, {
      align: 'right',
    });
  }

  pdf.save('nextstep-career-exploration.pdf');
}
