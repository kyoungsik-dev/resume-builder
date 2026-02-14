
import React from 'react';
import { ResumeData, CustomItem } from '../types';

interface PreviewProps {
  data: ResumeData;
}

const Preview: React.FC<PreviewProps> = ({ data }) => {
  const { personalInfo, experiences, educations, skills, customSections, theme, primaryColor, visibility, fontSize } = data;

  // 섹션 순서 계산 (sectionOrder에 없는 새 섹션은 끝에 추가)
  const allKeys = ['summary', 'experiences', 'educations', 'skills', ...customSections.map(s => s.id)];
  const effectiveOrder = [
    ...(data.sectionOrder || []).filter((k: string) => allKeys.includes(k)),
    ...allKeys.filter(k => !(data.sectionOrder || []).includes(k))
  ];


  const renderClassic = () => {
    const renderSection = (key: string): React.ReactNode => {
      if (key === 'summary') {
        return visibility.summary ? (
          <section key="summary" className="mb-10 px-4">
            <p className="text-center leading-relaxed text-slate-700 whitespace-pre-line">{personalInfo.summary}</p>
          </section>
        ) : null;
      }
      if (key === 'experiences') {
        return visibility.experiences ? (
          <section key="experiences" className="px-4 mb-10">
            <h2 className="text-lg font-bold border-b mb-4 pb-1 uppercase tracking-wider" style={{ borderColor: primaryColor, color: primaryColor }}>Work Experience</h2>
            <div className="space-y-8">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-800 text-lg">{exp.company}</h3>
                    <span className="text-sm text-slate-500 font-medium">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-600 mb-4">{exp.position}</p>
                  <div className="space-y-5 ml-2">
                    {exp.achievements.map((a) => (
                      <div key={a.id} className="border-l-2 pl-4 py-1" style={{ borderColor: `${primaryColor}30` }}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="text-sm font-bold text-slate-700">{a.title}</h4>
                          <span className="text-[11px] text-slate-400 font-medium">{a.period}</span>
                        </div>
                        {a.role && <p className="text-[11px] font-medium text-slate-500 mb-1">{a.role}</p>}
                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{a.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null;
      }
      if (key === 'educations') {
        return visibility.educations ? (
          <section key="educations" className="px-4 mb-10">
            <h2 className="text-lg font-bold border-b mb-4 pb-1 uppercase tracking-wider" style={{ borderColor: primaryColor, color: primaryColor }}>Education</h2>
            <div className="space-y-4">
              {educations.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-800">{edu.school}</h3>
                    <span className="text-sm text-slate-500 font-medium">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium">{edu.degree} in {edu.major}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null;
      }
      if (key === 'skills') {
        return visibility.skills ? (
          <section key="skills" className="px-4 mb-10">
            <h2 className="text-lg font-bold border-b mb-4 pb-1 uppercase tracking-wider" style={{ borderColor: primaryColor, color: primaryColor }}>Professional Skills</h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill) => (
                <span key={skill.id} className="text-xs font-semibold px-3 py-1.5 bg-slate-50 text-slate-700 rounded border border-slate-200">{skill.name}</span>
              ))}
            </div>
          </section>
        ) : null;
      }
      const cs = customSections.find(s => s.id === key);
      if (cs && cs.visible) {
        return (
          <section key={cs.id} className="px-4 mb-10">
            <h2 className="text-lg font-bold border-b mb-4 pb-1 uppercase tracking-wider" style={{ borderColor: primaryColor, color: primaryColor }}>{cs.title}</h2>
            <div className="space-y-4">
              {cs.items.map((item) => (
                <div key={item.id} className="text-slate-600">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                    <span className="text-[10px] font-medium text-slate-400">{item.period}</span>
                  </div>
                  {item.subtitle && <p className="text-[11px] font-medium mb-1 text-slate-500">{item.subtitle}</p>}
                  {item.content && <p className="text-xs leading-relaxed whitespace-pre-line text-slate-600">{item.content}</p>}
                </div>
              ))}
            </div>
          </section>
        );
      }
      return null;
    };

    return (
      <div className="p-12 text-slate-800">
        <header className="text-center mb-8 border-b-2 pb-6" style={{ borderColor: primaryColor }}>
          <h1 className="text-4xl font-bold uppercase tracking-widest mb-2" style={{ color: primaryColor }}>{personalInfo.fullName}</h1>
          <p className="text-xl font-medium text-slate-600 mb-4">{personalInfo.jobTitle}</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-slate-500">
            {personalInfo.email && <span><i className="fa-solid fa-envelope mr-1"></i> {personalInfo.email}</span>}
            {personalInfo.phone && <span><i className="fa-solid fa-phone mr-1"></i> {personalInfo.phone}</span>}
            {personalInfo.address && <span><i className="fa-solid fa-location-dot mr-1"></i> {personalInfo.address}</span>}
          </div>
        </header>
        {effectiveOrder.map(key => renderSection(key))}
      </div>
    );
  };

  const renderModern = () => {
    const renderSection = (key: string): React.ReactNode => {
      if (key === 'summary') {
        return visibility.summary ? (
          <section key="summary" className="mb-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: primaryColor }}>
              <span className="w-8 h-1" style={{ backgroundColor: primaryColor }}></span> About Me
            </h2>
            <p className="text-slate-600 leading-relaxed">{personalInfo.summary}</p>
          </section>
        ) : null;
      }
      if (key === 'experiences') {
        return visibility.experiences ? (
          <section key="experiences" className="mb-10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: primaryColor }}>
              <span className="w-8 h-1" style={{ backgroundColor: primaryColor }}></span> Work Experience
            </h2>
            <div className="space-y-8 relative border-l-2 ml-4 pl-6" style={{ borderColor: `${primaryColor}20` }}>
              {experiences.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 bg-white" style={{ borderColor: primaryColor }}></div>
                  <div className="flex justify-between mb-1">
                    <h3 className="font-bold text-slate-800">{exp.position}</h3>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-sm font-bold mb-4" style={{ color: primaryColor }}>{exp.company}</p>
                  <div className="space-y-5">
                    {exp.achievements.map((a) => (
                      <div key={a.id}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="text-sm font-bold text-slate-700">{a.title}</h4>
                          <span className="text-[10px] text-slate-400">{a.period}</span>
                        </div>
                        {a.role && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{a.role}</p>}
                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{a.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null;
      }
      if (key === 'educations') {
        return visibility.educations ? (
          <section key="educations" className="mb-10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: primaryColor }}>
              <span className="w-8 h-1" style={{ backgroundColor: primaryColor }}></span> Education
            </h2>
            <div className="space-y-6">
              {educations.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-800">{edu.school}</h3>
                    <span className="text-xs text-slate-500">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <p className="text-sm text-slate-600">{edu.degree}, {edu.major}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null;
      }
      if (key === 'skills') return null; // modern 사이드바에 표시
      const cs = customSections.find(s => s.id === key);
      if (cs && cs.visible) {
        return (
          <section key={cs.id} className="mb-10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: primaryColor }}>
              <span className="w-8 h-1" style={{ backgroundColor: primaryColor }}></span> {cs.title}
            </h2>
            <div className="space-y-6">
              {cs.items.map((item) => (
                <div key={item.id} className="text-slate-600">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-base font-bold text-slate-800">{item.title}</h4>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">{item.period}</span>
                  </div>
                  {item.subtitle && <p className="text-sm font-bold mb-2" style={{ color: primaryColor }}>{item.subtitle}</p>}
                  {item.content && <p className="text-xs leading-relaxed whitespace-pre-line text-slate-600">{item.content}</p>}
                </div>
              ))}
            </div>
          </section>
        );
      }
      return null;
    };

    return (
      <div className="flex h-full min-h-[297mm]">
        <aside className="w-1/3 p-8 text-white h-full" style={{ backgroundColor: primaryColor }}>
          <div className="text-center mb-10">
            <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold border-4 border-white/40">
              {personalInfo.fullName.charAt(0)}
            </div>
            <h1 className="text-2xl font-bold mb-1">{personalInfo.fullName}</h1>
            <p className="text-white/80 text-sm font-medium">{personalInfo.jobTitle}</p>
          </div>
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-white/30 mb-4 pb-1">Contact</h2>
            <ul className="space-y-3 text-sm text-white/90">
              <li className="flex items-center gap-3"><i className="fa-solid fa-envelope w-4"></i> {personalInfo.email}</li>
              <li className="flex items-center gap-3"><i className="fa-solid fa-phone w-4"></i> {personalInfo.phone}</li>
              <li className="flex items-center gap-3"><i className="fa-solid fa-location-dot w-4"></i> {personalInfo.address}</li>
            </ul>
          </section>
          {visibility.skills && (
            <section className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-widest border-b border-white/30 mb-4 pb-1">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill.id} className="bg-white/20 text-xs px-2 py-1 rounded border border-white/10">{skill.name}</span>
                ))}
              </div>
            </section>
          )}
        </aside>
        <main className="w-2/3 p-10 bg-white text-slate-800">
          {effectiveOrder.map(key => renderSection(key))}
        </main>
      </div>
    );
  };

  const renderMinimal = () => {
    const renderSection = (key: string): React.ReactNode => {
      if (key === 'summary') {
        return visibility.summary ? (
          <section key="summary" className="mb-12">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1"><h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Profile</h2></div>
              <div className="col-span-3"><p className="text-lg leading-relaxed font-light">{personalInfo.summary}</p></div>
            </div>
          </section>
        ) : null;
      }
      if (key === 'experiences') {
        return visibility.experiences ? (
          <section key="experiences" className="mb-12">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="col-span-1"><h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Experience</h2></div>
            </div>
            <div className="space-y-12">
              {experiences.map((exp) => (
                <div key={exp.id} className="grid grid-cols-4 gap-4">
                  <div className="col-span-1 text-sm text-slate-400 font-medium">{exp.startDate} – {exp.endDate}</div>
                  <div className="col-span-3">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{exp.position}</h3>
                    <p className="text-slate-600 font-medium mb-6">{exp.company}</p>
                    <div className="space-y-8">
                      {exp.achievements.map((a) => (
                        <div key={a.id}>
                          <div className="flex justify-between items-baseline mb-2">
                            <h4 className="text-base font-bold text-slate-800">{a.title}</h4>
                            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{a.period}</span>
                          </div>
                          {a.role && <p className="text-[11px] font-medium text-slate-500 mb-2 uppercase tracking-widest">{a.role}</p>}
                          <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">{a.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null;
      }
      if (key === 'educations') {
        return visibility.educations ? (
          <section key="educations" className="mb-12">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="col-span-1"><h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Education</h2></div>
            </div>
            <div className="space-y-6">
              {educations.map((edu) => (
                <div key={edu.id} className="grid grid-cols-4 gap-4">
                  <div className="col-span-1 text-sm text-slate-400 font-medium">{edu.startDate} – {edu.endDate}</div>
                  <div className="col-span-3">
                    <h3 className="font-bold text-slate-900">{edu.school}</h3>
                    <p className="text-sm text-slate-600">{edu.degree}, {edu.major}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null;
      }
      if (key === 'skills') {
        return visibility.skills ? (
          <section key="skills" className="mb-12">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="col-span-1"><h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Expertise</h2></div>
              <div className="col-span-3">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill.id} className="text-sm px-3 py-1 bg-slate-100 text-slate-700 rounded-full">{skill.name}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null;
      }
      const cs = customSections.find(s => s.id === key);
      if (cs && cs.visible) {
        return (
          <section key={cs.id} className="mb-12">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="col-span-1"><h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{cs.title}</h2></div>
            </div>
            <div className="space-y-8">
              {cs.items.map(item => (
                <div key={item.id} className="grid grid-cols-4 gap-4">
                  <div className="col-span-1 text-sm text-slate-400 font-medium">{item.period}</div>
                  <div className="col-span-3">
                    <h4 className="text-base font-bold text-slate-800 mb-1">{item.title}</h4>
                    {item.subtitle && <p className="text-[11px] font-medium text-slate-500 mb-2 uppercase tracking-widest">{item.subtitle}</p>}
                    {item.content && <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">{item.content}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      }
      return null;
    };

    return (
      <div className="p-12 text-slate-700 max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-light mb-4">{personalInfo.fullName}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 font-medium">
            <span className="text-slate-900">{personalInfo.jobTitle}</span>
            <span className="flex items-center gap-1"><i className="fa-solid fa-envelope text-xs opacity-60"></i> {personalInfo.email}</span>
            <span className="flex items-center gap-1"><i className="fa-solid fa-phone text-xs opacity-60"></i> {personalInfo.phone}</span>
          </div>
        </header>
        {effectiveOrder.map(key => renderSection(key))}
      </div>
    );
  };

  const renderStandard = () => {
    const renderSection = (key: string): React.ReactNode => {
      if (key === 'summary') {
        return visibility.summary && personalInfo.summary ? (
          <section key="summary" className="mb-8">
            <p className="text-sm leading-normal text-slate-700 whitespace-pre-line">{personalInfo.summary}</p>
          </section>
        ) : null;
      }
      if (key === 'experiences') {
        return visibility.experiences && experiences.length > 0 ? (
          <section key="experiences" className="mb-8">
            <h2 className="text-lg font-bold mb-1" style={{ color: primaryColor }}>경력</h2>
            <div className="border-b-2 mb-5" style={{ borderColor: primaryColor }}></div>
            <div className="space-y-8">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="mb-3">
                    <h3 className="text-base font-bold text-slate-900">{exp.company}</h3>
                    <div className="flex flex-wrap items-center gap-x-2 text-sm text-slate-500 mt-0.5">
                      <span>{exp.startDate} - {exp.endDate}</span>
                      <span className="text-slate-300">|</span>
                      <span>{exp.position}</span>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 mt-2 pt-3"></div>
                  <div className="space-y-5">
                    {exp.achievements.map((a) => (
                      <div key={a.id}>
                        <h4 className="text-sm font-bold text-slate-800 mb-1">{a.title}</h4>
                        <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-400 mb-2">
                          {a.period && <span>{a.period}</span>}
                          {a.role && (<><span className="text-slate-300">|</span><span>{a.role}</span></>)}
                        </div>
                        {a.content && <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-line">{a.content}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null;
      }
      if (key === 'educations') {
        return visibility.educations && educations.length > 0 ? (
          <section key="educations" className="mb-8">
            <h2 className="text-lg font-bold mb-1" style={{ color: primaryColor }}>학력</h2>
            <div className="border-b-2 mb-5" style={{ borderColor: primaryColor }}></div>
            <div className="space-y-4">
              {educations.map((edu) => (
                <div key={edu.id}>
                  <h3 className="text-base font-bold text-slate-900">{edu.school}</h3>
                  <div className="flex flex-wrap items-center gap-x-2 text-sm text-slate-500 mt-0.5">
                    <span>{edu.startDate} - {edu.endDate}</span>
                    <span className="text-slate-300">|</span>
                    <span>{edu.degree}</span>
                    <span className="text-slate-300">|</span>
                    <span>{edu.major}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null;
      }
      if (key === 'skills') {
        return visibility.skills && skills.length > 0 ? (
          <section key="skills" className="mb-8">
            <h2 className="text-lg font-bold mb-1" style={{ color: primaryColor }}>스킬</h2>
            <div className="border-b-2 mb-5" style={{ borderColor: primaryColor }}></div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill.id} className="text-xs font-medium px-3 py-1.5 border border-slate-200 rounded text-slate-700">{skill.name}</span>
              ))}
            </div>
          </section>
        ) : null;
      }
      // 커스텀 섹션
      const cs = customSections.find(s => s.id === key);
      if (cs && cs.visible) {
        return (
          <section key={cs.id} className="mb-8">
            <h2 className="text-lg font-bold mb-1" style={{ color: primaryColor }}>{cs.title}</h2>
            <div className="border-b-2 mb-5" style={{ borderColor: primaryColor }}></div>
            <div className="space-y-5">
              {cs.items.map((item) => (
                <div key={item.id}>
                  <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                  <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-400 mt-0.5 mb-1">
                    {item.period && <span>{item.period}</span>}
                    {item.subtitle && (<><span className="text-slate-300">|</span><span>{item.subtitle}</span></>)}
                  </div>
                  {item.content && <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-line">{item.content}</p>}
                </div>
              ))}
            </div>
          </section>
        );
      }
      return null;
    };

    return (
      <div className="py-10 px-16 text-slate-800">
        <header className="mb-6">
          <h1 className="text-4xl font-bold mb-3">{personalInfo.fullName}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
            {personalInfo.phone && (<span className="flex items-center gap-1.5"><i className="fa-solid fa-phone text-xs"></i> {personalInfo.phone}</span>)}
            {personalInfo.email && (<span className="flex items-center gap-1.5"><i className="fa-solid fa-envelope text-xs"></i> {personalInfo.email}</span>)}
            {personalInfo.address && (<span className="flex items-center gap-1.5"><i className="fa-solid fa-location-dot text-xs"></i> {personalInfo.address}</span>)}
          </div>
        </header>
        {effectiveOrder.map(key => renderSection(key))}
      </div>
    );
  };

  return (
    <div className="resume-paper mx-auto overflow-hidden" style={{ fontSize: `${fontSize}px` }}>
      {theme === 'classic' && renderClassic()}
      {theme === 'modern' && renderModern()}
      {theme === 'minimal' && renderMinimal()}
      {theme === 'standard' && renderStandard()}
    </div>
  );
};

export default Preview;
