export type Profile = {
  education: { degree: string; field: string; courses: string };
  interests: string[];
  currentSkills: string[];
  desiredSkills: string[];
  experiences: string;
  workStyles: string[];
  location: string;
  remotePreference: string;
  industries: string[];
};

export type Recommendation = {
  title: string;
  description: string;
  rationale: string;
  existingStrengths: string[];
  skillsToBuild: string[];
  nextSteps: string[];
  score: number;
};
