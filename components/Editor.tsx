
import React from 'react';
import { ResumeData, Experience, Education, Skill, CustomSection, Achievement, CustomItem } from '../types';

interface EditorProps {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const toggleVisibility = (section: keyof ResumeData['visibility']) => {
    onChange({
      ...data,
      visibility: { ...data.visibility, [section]: !data.visibility[section] }
    });
  };

  // 섹션 순서 관리
  const allKeys = ['summary', 'experiences', 'educations', 'skills', ...data.customSections.map(s => s.id)];
  const effectiveOrder = [
    ...(data.sectionOrder || []).filter((k: string) => allKeys.includes(k)),
    ...allKeys.filter(k => !(data.sectionOrder || []).includes(k))
  ];

  const moveSection = (key: string, direction: 'up' | 'down') => {
    const order = [...effectiveOrder];
    const idx = order.indexOf(key);
    if (direction === 'up' && idx > 0) {
      [order[idx - 1], order[idx]] = [order[idx], order[idx - 1]];
    } else if (direction === 'down' && idx < order.length - 1) {
      [order[idx + 1], order[idx]] = [order[idx], order[idx + 1]];
    }
    onChange({ ...data, sectionOrder: order });
  };

  // Experiences
  const addExperience = () => {
    const newExp: Experience = { id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', achievements: [] };
    onChange({ ...data, experiences: [...data.experiences, newExp] });
  };
  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    const newExps = data.experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp);
    onChange({ ...data, experiences: newExps });
  };
  const removeExperience = (id: string) => {
    onChange({ ...data, experiences: data.experiences.filter(exp => exp.id !== id) });
  };

  const addAchievement = (expId: string) => {
    const newExps = data.experiences.map(exp => {
      if (exp.id === expId) {
        const newAchievement: Achievement = {
          id: Date.now().toString(),
          title: '',
          period: '',
          role: '',
          content: ''
        };
        return { ...exp, achievements: [...exp.achievements, newAchievement] };
      }
      return exp;
    });
    onChange({ ...data, experiences: newExps });
  };

  const updateAchievement = (expId: string, achievementId: string, field: keyof Achievement, value: string) => {
    const newExps = data.experiences.map(exp => {
      if (exp.id === expId) {
        const newAchievements = exp.achievements.map(a => 
          a.id === achievementId ? { ...a, [field]: value } : a
        );
        return { ...exp, achievements: newAchievements };
      }
      return exp;
    });
    onChange({ ...data, experiences: newExps });
  };

  const removeAchievement = (expId: string, achievementId: string) => {
    const newExps = data.experiences.map(exp => {
      if (exp.id === expId) {
        return { ...exp, achievements: exp.achievements.filter(a => a.id !== achievementId) };
      }
      return exp;
    });
    onChange({ ...data, experiences: newExps });
  };

  // Educations
  const addEducation = () => {
    const newEdu: Education = { id: Date.now().toString(), school: '', degree: '', major: '', startDate: '', endDate: '' };
    onChange({ ...data, educations: [...data.educations, newEdu] });
  };
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    const newEdus = data.educations.map(edu => edu.id === id ? { ...edu, [field]: value } : edu);
    onChange({ ...data, educations: newEdus });
  };
  const removeEducation = (id: string) => {
    onChange({ ...data, educations: data.educations.filter(edu => edu.id !== id) });
  };

  // Skills
  const addSkill = () => {
    const newSkill: Skill = { id: Date.now().toString(), name: '' };
    onChange({ ...data, skills: [...data.skills, newSkill] });
  };
  const updateSkill = (id: string, value: string) => {
    const newSkills = data.skills.map(s => s.id === id ? { ...s, name: value } : s);
    onChange({ ...data, skills: newSkills });
  };
  const removeSkill = (id: string) => {
    onChange({ ...data, skills: data.skills.filter(s => s.id !== id) });
  };

  // Custom Sections
  const addCustomSection = () => {
    const newSection: CustomSection = {
      id: Date.now().toString(),
      title: '새 섹션',
      items: [],
      visible: true
    };
    onChange({ ...data, customSections: [...data.customSections, newSection], sectionOrder: [...effectiveOrder, newSection.id] });
  };
  const updateCustomSection = (id: string, field: keyof CustomSection, value: any) => {
    const newSections = data.customSections.map(s => s.id === id ? { ...s, [field]: value } : s);
    onChange({ ...data, customSections: newSections });
  };
  const removeCustomSection = (id: string) => {
    onChange({ ...data, customSections: data.customSections.filter(s => s.id !== id), sectionOrder: effectiveOrder.filter(k => k !== id) });
  };

  const addCustomItem = (sectionId: string) => {
    const newSections = data.customSections.map(s => {
      if (s.id === sectionId) {
        const newItem: CustomItem = {
          id: Date.now().toString(),
          title: '',
          period: '',
          subtitle: '',
          content: ''
        };
        return { ...s, items: [...s.items, newItem] };
      }
      return s;
    });
    onChange({ ...data, customSections: newSections });
  };

  const updateCustomItem = (sectionId: string, itemId: string, field: keyof CustomItem, value: string) => {
    const newSections = data.customSections.map(s => {
      if (s.id === sectionId) {
        const newItems = s.items.map(item => 
          item.id === itemId ? { ...item, [field]: value } : item
        );
        return { ...s, items: newItems };
      }
      return s;
    });
    onChange({ ...data, customSections: newSections });
  };

  const removeCustomItem = (sectionId: string, itemId: string) => {
    const newSections = data.customSections.map(s => {
      if (s.id === sectionId) {
        return { ...s, items: s.items.filter(item => item.id !== itemId) };
      }
      return s;
    });
    onChange({ ...data, customSections: newSections });
  };

  const SectionHeader = ({ icon, title, isVisible, onToggle, onAdd, sectionKey }: { icon: string, title: string, isVisible?: boolean, onToggle?: () => void, onAdd?: () => void, sectionKey?: string }) => {
    const idx = sectionKey ? effectiveOrder.indexOf(sectionKey) : -1;
    const isFirst = idx === 0;
    const isLast = idx === effectiveOrder.length - 1;

    return (
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          {sectionKey && (
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => moveSection(sectionKey, 'up')}
                disabled={isFirst}
                className={`w-5 h-4 flex items-center justify-center rounded text-[9px] transition-colors ${isFirst ? 'text-slate-200' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
              ><i className="fa-solid fa-chevron-up"></i></button>
              <button
                onClick={() => moveSection(sectionKey, 'down')}
                disabled={isLast}
                className={`w-5 h-4 flex items-center justify-center rounded text-[9px] transition-colors ${isLast ? 'text-slate-200' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
              ><i className="fa-solid fa-chevron-down"></i></button>
            </div>
          )}
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <i className={`${icon} text-blue-500 w-6 text-center`}></i> {title}
          </h2>
          {onToggle && (
            <button
              onClick={onToggle}
              className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${isVisible ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
            >
              {isVisible ? <i className="fa-solid fa-eye mr-1"></i> : <i className="fa-solid fa-eye-slash mr-1"></i>}
              {isVisible ? '노출 중' : '비노출'}
            </button>
          )}
        </div>
        {onAdd && (
          <button onClick={onAdd} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">
            + 추가
          </button>
        )}
      </div>
    );
  };

  // 에디터 섹션 렌더러
  const renderEditorSection = (key: string): React.ReactNode => {
    if (key === 'summary') {
      return (
        <section key="summary">
          <SectionHeader icon="fa-solid fa-user" title="기본 정보" sectionKey="summary" />
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">이름</label>
              <input type="text" value={data.personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">직무 타이틀</label>
              <input type="text" value={data.personalInfo.jobTitle} onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">이메일</label>
              <input type="email" value={data.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">전화번호</label>
              <input type="text" value={data.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">주소</label>
              <input type="text" value={data.personalInfo.address} onChange={(e) => updatePersonalInfo('address', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
            </div>
            <div className="col-span-2 mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-sm font-medium text-gray-700">자기소개</label>
                <button onClick={() => toggleVisibility('summary')} className={`text-[10px] px-1.5 py-0.5 rounded border ${data.visibility.summary ? 'text-blue-500 border-blue-200' : 'text-slate-400 border-slate-200'}`}>
                  {data.visibility.summary ? '노출' : '숨김'}
                </button>
              </div>
              <textarea rows={4} value={data.personalInfo.summary} onChange={(e) => updatePersonalInfo('summary', e.target.value)} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 ${!data.visibility.summary && 'bg-slate-50 opacity-60'}`} />
            </div>
          </div>
        </section>
      );
    }

    if (key === 'experiences') {
      return (
        <section key="experiences">
          <SectionHeader icon="fa-solid fa-briefcase" title="경력 사항" sectionKey="experiences" isVisible={data.visibility.experiences} onToggle={() => toggleVisibility('experiences')} onAdd={addExperience} />
          <div className={`space-y-6 ${!data.visibility.experiences && 'opacity-50 grayscale pointer-events-none'}`}>
            {data.experiences.map((exp) => (
              <div key={exp.id} className="relative p-5 border rounded-xl bg-white shadow-sm border-slate-200 hover:border-blue-200 transition-colors">
                <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"><i className="fa-solid fa-trash-can"></i></button>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">회사명</label>
                    <input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="w-full text-base font-bold border-b border-transparent focus:border-blue-500 outline-none pb-1" placeholder="회사명 입력" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">직책</label>
                    <input type="text" value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} className="w-full text-base border-b border-transparent focus:border-blue-500 outline-none pb-1" placeholder="직책/역할 입력" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">시작일</label>
                    <input type="text" value={exp.startDate} placeholder="YYYY-MM" onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className="w-full text-sm border-b border-transparent focus:border-blue-500 outline-none pb-1" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">종료일</label>
                    <input type="text" value={exp.endDate} placeholder="YYYY-MM or 현재" onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} className="w-full text-sm border-b border-transparent focus:border-blue-500 outline-none pb-1" />
                  </div>
                  <div className="col-span-2 mt-6">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-50">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><i className="fa-solid fa-list-check text-blue-400"></i> 주요 성과 및 세부 프로젝트</h4>
                      <button onClick={() => addAchievement(exp.id)} className="text-[11px] bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full hover:bg-blue-100 transition-colors flex items-center gap-1"><i className="fa-solid fa-plus"></i> 항목 추가</button>
                    </div>
                    <div className="space-y-5">
                      {exp.achievements.map((a) => (
                        <div key={a.id} className="group relative bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <button onClick={() => removeAchievement(exp.id, a.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 text-slate-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all shadow-sm"><i className="fa-solid fa-xmark text-[10px]"></i></button>
                          <div className="grid grid-cols-3 gap-3 mb-3">
                            <div className="col-span-3 sm:col-span-1">
                              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">제목</label>
                              <input type="text" value={a.title} onChange={(e) => updateAchievement(exp.id, a.id, 'title', e.target.value)} className="w-full text-sm font-semibold bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-300" placeholder="프로젝트/성과 제목" />
                            </div>
                            <div className="col-span-3 sm:col-span-1">
                              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">기간</label>
                              <input type="text" value={a.period} onChange={(e) => updateAchievement(exp.id, a.id, 'period', e.target.value)} className="w-full text-sm bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-300" placeholder="YYYY.MM - YYYY.MM" />
                            </div>
                            <div className="col-span-3 sm:col-span-1">
                              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">역할</label>
                              <input type="text" value={a.role} onChange={(e) => updateAchievement(exp.id, a.id, 'role', e.target.value)} className="w-full text-sm bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-300" placeholder="수행 역할" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">상세 내용</label>
                            <textarea rows={2} value={a.content} onChange={(e) => updateAchievement(exp.id, a.id, 'content', e.target.value)} className="w-full text-sm bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-300 resize-none" placeholder="상세 내용을 입력하세요 (여러 줄 가능)" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (key === 'educations') {
      return (
        <section key="educations">
          <SectionHeader icon="fa-solid fa-graduation-cap" title="학력 사항" sectionKey="educations" isVisible={data.visibility.educations} onToggle={() => toggleVisibility('educations')} onAdd={addEducation} />
          <div className={`space-y-6 ${!data.visibility.educations && 'opacity-50 grayscale pointer-events-none'}`}>
            {data.educations.map((edu) => (
              <div key={edu.id} className="relative p-4 border rounded-lg bg-white shadow-sm border-slate-200">
                <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition-colors"><i className="fa-solid fa-trash-can"></i></button>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1"><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">학교명</label><input type="text" value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} className="mt-1 block w-full border-b focus:border-blue-500 sm:text-sm outline-none p-1" /></div>
                  <div className="col-span-1"><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">전공</label><input type="text" value={edu.major} onChange={(e) => updateEducation(edu.id, 'major', e.target.value)} className="mt-1 block w-full border-b focus:border-blue-500 sm:text-sm outline-none p-1" /></div>
                  <div className="col-span-1"><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">학위</label><input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="mt-1 block w-full border-b focus:border-blue-500 sm:text-sm outline-none p-1" /></div>
                  <div className="col-span-1"><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">졸업년도</label><input type="text" value={edu.endDate} placeholder="YYYY-MM" onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} className="mt-1 block w-full border-b focus:border-blue-500 sm:text-sm outline-none p-1" /></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (key === 'skills') {
      return (
        <section key="skills">
          <SectionHeader icon="fa-solid fa-screwdriver-wrench" title="보유 기술" sectionKey="skills" isVisible={data.visibility.skills} onToggle={() => toggleVisibility('skills')} onAdd={addSkill} />
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${!data.visibility.skills && 'opacity-50 grayscale pointer-events-none'}`}>
            {data.skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-3 p-2 border rounded-md bg-slate-50 border-slate-200">
                <input type="text" value={skill.name} onChange={(e) => updateSkill(skill.id, e.target.value)} className="bg-transparent text-sm font-medium w-full outline-none focus:border-b border-blue-400" placeholder="스킬명 (예: React, SQL, Photoshop)" />
                <button onClick={() => removeSkill(skill.id)} className="text-slate-400 hover:text-red-500 px-1"><i className="fa-solid fa-xmark"></i></button>
              </div>
            ))}
            {data.skills.length === 0 && (
              <div className="col-span-2 text-center py-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg"><p className="text-xs text-slate-400">보유하고 있는 기술이나 역량을 추가해보세요.</p></div>
            )}
          </div>
        </section>
      );
    }

    // 커스텀 섹션
    const section = data.customSections.find(s => s.id === key);
    if (!section) return null;
    return (
      <section key={section.id}>
        <SectionHeader icon="fa-solid fa-layer-group" title={section.title} sectionKey={section.id} />
        <div className="relative p-5 border rounded-xl bg-slate-50 border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <input type="text" value={section.title} onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)} className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-800 outline-none focus:border-blue-400 shadow-sm" placeholder="섹션 제목 (예: 자격증, 어학능력)" />
            <div className="flex items-center gap-2">
              <button onClick={() => updateCustomSection(section.id, 'visible', !section.visible)} className={`text-xs px-2.5 py-1.5 rounded-full border transition-all ${section.visible ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-400'}`}>
                {section.visible ? <i className="fa-solid fa-eye mr-1"></i> : <i className="fa-solid fa-eye-slash mr-1"></i>}
                {section.visible ? '노출 중' : '비노출'}
              </button>
              <button onClick={() => removeCustomSection(section.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-white hover:text-red-500 transition-all border border-transparent hover:border-slate-100"><i className="fa-solid fa-trash-can"></i></button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">항목 리스트</span>
              <button onClick={() => addCustomItem(section.id)} className="text-[10px] bg-white text-blue-600 px-2 py-1 rounded border border-blue-100 hover:bg-blue-50 transition-colors">+ 항목 추가</button>
            </div>
            <div className="space-y-4">
              {section.items.map((item) => (
                <div key={item.id} className="relative bg-white p-4 rounded-lg border border-slate-100 shadow-sm group">
                  <button onClick={() => removeCustomItem(section.id, item.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 text-slate-300 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all shadow-sm"><i className="fa-solid fa-xmark text-[10px]"></i></button>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="col-span-2 sm:col-span-1"><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">제목</label><input type="text" value={item.title} onChange={(e) => updateCustomItem(section.id, item.id, 'title', e.target.value)} className="w-full text-sm font-semibold border-b border-slate-100 focus:border-blue-300 outline-none pb-0.5" placeholder="항목 제목" /></div>
                    <div className="col-span-2 sm:col-span-1"><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">기간</label><input type="text" value={item.period} onChange={(e) => updateCustomItem(section.id, item.id, 'period', e.target.value)} className="w-full text-sm border-b border-slate-100 focus:border-blue-300 outline-none pb-0.5" placeholder="YYYY.MM" /></div>
                    <div className="col-span-2"><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">부제 / 소속</label><input type="text" value={item.subtitle} onChange={(e) => updateCustomItem(section.id, item.id, 'subtitle', e.target.value)} className="w-full text-sm border-b border-slate-100 focus:border-blue-300 outline-none pb-0.5" placeholder="부제목 또는 발급 기관" /></div>
                  </div>
                  <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">내용</label><textarea rows={2} value={item.content} onChange={(e) => updateCustomItem(section.id, item.id, 'content', e.target.value)} className="w-full text-sm border-b border-slate-100 focus:border-blue-300 outline-none pb-0.5 resize-none" placeholder="상세 내용을 입력하세요..." /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="flex flex-col gap-8 p-6 pb-24 h-full overflow-y-auto no-print">
      {effectiveOrder.map(key => renderEditorSection(key))}

      {/* 커스텀 섹션 추가 버튼 */}
      <div className="flex justify-center">
        <button onClick={addCustomSection} className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors flex items-center gap-2">
          <i className="fa-solid fa-plus"></i> 커스텀 섹션 추가
        </button>
      </div>
    </div>
  );
};

export default Editor;
