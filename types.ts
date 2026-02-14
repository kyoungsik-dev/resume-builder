
export interface Achievement {
  id: string;
  title: string;
  period: string;
  role: string;
  content: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  achievements: Achievement[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface CustomItem {
  id: string;
  title: string;
  period: string;
  subtitle: string;
  content: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomItem[];
  visible: boolean;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    jobTitle: string;
    summary: string;
    website?: string;
  };
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  customSections: CustomSection[];
  visibility: {
    summary: boolean;
    experiences: boolean;
    educations: boolean;
    skills: boolean;
  };
  theme: 'classic' | 'modern' | 'minimal';
  primaryColor: string;
}

export const initialData: ResumeData = {
  personalInfo: {
    fullName: "홍길동",
    email: "gildong@example.com",
    phone: "010-1234-5678",
    address: "서울특별시 강남구 테헤란로",
    jobTitle: "프론트엔드 개발자",
    summary: "사용자 중심의 가치를 실현하는 5년차 개발자입니다. React와 TypeScript를 활용한 대규모 프로젝트 리딩 경험이 있으며, 성능 최적화와 코드 품질 개선에 열정이 있습니다.",
  },
  experiences: [
    {
      id: "1",
      company: "멋진 기술 주식회사",
      position: "시니어 프론트엔드 개발자",
      startDate: "2021-03",
      endDate: "현재",
      achievements: [
        {
          id: "a1",
          title: "SaaS 대시보드 성능 최적화",
          period: "2021.06 - 2021.12",
          role: "리드 개발자",
          content: "Lighthouse 점수를 60점에서 95점으로 개선.\n코드 분할 및 이미지 최적화 전략 수립."
        }
      ]
    }
  ],
  educations: [
    {
      id: "1",
      school: "한국대학교",
      degree: "학사",
      major: "컴퓨터공학",
      startDate: "2012-03",
      endDate: "2018-02"
    }
  ],
  skills: [
    { id: "1", name: "React" },
    { id: "2", name: "TypeScript" },
    { id: "3", name: "Tailwind CSS" }
  ],
  customSections: [
    {
      id: "c1",
      title: "자격증 및 수상",
      visible: true,
      items: [
        {
          id: "ci1",
          title: "정보처리기사",
          period: "2018.05",
          subtitle: "한국산업인력공단",
          content: "소프트웨어 설계 및 개발 역량 인증"
        }
      ]
    }
  ],
  visibility: {
    summary: true,
    experiences: true,
    educations: true,
    skills: true,
  },
  theme: 'modern',
  primaryColor: '#2563eb'
};
