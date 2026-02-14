
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const suggestSkills = async (jobTitle: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `List 5 key professional skill names for a ${jobTitle} in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING }
          },
          required: ["name"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return [];
  }
};

const achievementSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "프로젝트/성과 제목" },
    period: { type: Type.STRING, description: "기간 (예: 2021.06 - 2021.12)" },
    role: { type: Type.STRING, description: "역할 (예: 리드 개발자)" },
    content: { type: Type.STRING, description: "상세 내용, 여러 줄일 경우 \\n으로 구분" },
  },
  required: ["title", "period", "role", "content"],
};

const experienceSchema = {
  type: Type.OBJECT,
  properties: {
    company: { type: Type.STRING },
    position: { type: Type.STRING },
    startDate: { type: Type.STRING, description: "YYYY-MM 형식" },
    endDate: { type: Type.STRING, description: "YYYY-MM 형식 또는 '현재'" },
    achievements: { type: Type.ARRAY, items: achievementSchema },
  },
  required: ["company", "position", "startDate", "endDate", "achievements"],
};

const educationSchema = {
  type: Type.OBJECT,
  properties: {
    school: { type: Type.STRING },
    degree: { type: Type.STRING, description: "학사, 석사, 박사 등" },
    major: { type: Type.STRING },
    startDate: { type: Type.STRING, description: "YYYY-MM 형식" },
    endDate: { type: Type.STRING, description: "YYYY-MM 형식" },
  },
  required: ["school", "degree", "major", "startDate", "endDate"],
};

const customItemSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    period: { type: Type.STRING },
    subtitle: { type: Type.STRING, description: "발급기관, 소속 등" },
    content: { type: Type.STRING },
  },
  required: ["title", "period", "subtitle", "content"],
};

const customSectionSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "섹션 제목 (예: 자격증 및 수상, 프로젝트, 어학능력, 강의 경력 등)" },
    items: { type: Type.ARRAY, items: customItemSchema },
  },
  required: ["title", "items"],
};

const resumeResponseSchema = {
  type: Type.OBJECT,
  properties: {
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        address: { type: Type.STRING },
        jobTitle: { type: Type.STRING },
        summary: { type: Type.STRING },
      },
      required: ["fullName", "email", "phone", "address", "jobTitle", "summary"],
    },
    experiences: { type: Type.ARRAY, items: experienceSchema },
    educations: { type: Type.ARRAY, items: educationSchema },
    skills: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING } }, required: ["name"] } },
    customSections: { type: Type.ARRAY, items: customSectionSchema },
  },
  required: ["personalInfo", "experiences", "educations", "skills", "customSections"],
};

export const parsePdfResume = async (pdfBase64: string): Promise<any> => {
  const ai = getAIClient();

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: pdfBase64,
            },
          },
          {
            text: `이 PDF는 이력서입니다. PDF 내용을 분석하여 아래 JSON 형식에 맞게 데이터를 추출해주세요.

규칙:
- personalInfo: 이름, 이메일, 전화번호, 주소, 직무 타이틀, 자기소개를 추출
- experiences: 경력 사항을 추출. 각 경력의 achievements(성과/프로젝트)도 최대한 상세히 분류
- educations: 학력 사항 추출
- skills: 보유 기술/스킬 목록 추출
- customSections: 위 카테고리에 해당하지 않는 나머지 섹션들 (자격증, 수상, 어학, 봉사활동, 프로젝트, 강의 경력 등)을 커스텀 섹션으로 추출
- 날짜 형식: startDate/endDate는 YYYY-MM, period는 YYYY.MM - YYYY.MM 형식
- 내용이 없는 필드는 빈 문자열("")로 채워주세요
- 한국어 이력서일 가능성이 높으니 한국어 기준으로 파싱해주세요`,
          },
        ],
      },
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: resumeResponseSchema,
    },
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch {
    throw new Error('PDF 파싱 결과를 JSON으로 변환할 수 없습니다.');
  }
};
