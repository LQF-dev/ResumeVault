/**
 * ResumeVault 简历数据类型定义
 *
 * @author QinFeng Luo
 * @date 2026/03/04
 */

export interface BasicInfo {
  name: string;
  gender: string;
  birthDate: string;
  phone: string;
  email: string;
  politicalStatus: string;
  ethnicity: string;
  hometown: string;
  currentCity: string;
}

export interface EducationItem {
  id: string;
  school: string;
  major: string;
  degree: string;
  gpa: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface InternshipItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  role: string;
  techStack: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface AwardItem {
  id: string;
  name: string;
  date: string;
  description: string;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface ResumeData {
  basicInfo: BasicInfo;
  education: EducationItem[];
  internship: InternshipItem[];
  project: ProjectItem[];
  skills: string;
  awards: AwardItem[];
  selfEvaluation: string;
  custom: CustomField[];
}

export function createEmptyResumeData(): ResumeData {
  return {
    basicInfo: {
      name: "",
      gender: "",
      birthDate: "",
      phone: "",
      email: "",
      politicalStatus: "",
      ethnicity: "",
      hometown: "",
      currentCity: "",
    },
    education: [],
    internship: [],
    project: [],
    skills: "",
    awards: [],
    selfEvaluation: "",
    custom: [],
  };
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
