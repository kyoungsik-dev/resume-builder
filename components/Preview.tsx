
import React from 'react';
import { ResumeData, CustomItem } from '../types';

interface PreviewProps {
  data: ResumeData;
}

const Preview: React.FC<PreviewProps> = ({ data }) => {
  const { personalInfo, experiences, educations, skills, customSections, theme, primaryColor, visibility } = data;

  // Modern 테마 본문용 커스텀 섹션 렌더러
  const ModernMainCustomRenderer = () => (
    <>
      {customSections.filter(s => s.visible).map(section => (
        <section key={section.id} className="mb-10">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: primaryColor }}>
            <span className="w-8 h-1" style={{ backgroundColor: primaryColor }}></span> {section.title}
          </h2>
          <div className="space-y-6">
            {section.items.map((item) => (
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
      ))}
    </>
  );

  const CustomSectionsRenderer = ({ layout }: { layout: 'sidebar' | 'main' }) => (
    <>
      {customSections.filter(s => s.visible).map(section => (
        <section key={section.id} className="mb-8">
          <h2 className={`text-lg font-bold border-b mb-4 pb-1 uppercase tracking-wider ${layout === 'sidebar' ? 'text-xs border-white/30 text-white' : ''}`} 
              style={layout === 'main' ? { borderColor: primaryColor, color: primaryColor } : {}}>
            {section.title}
          </h2>
          <div className="space-y-4">
            {section.items.map((item) => (
              <div key={item.id} className={layout === 'sidebar' ? 'text-white/90' : 'text-slate-600'}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className={`text-sm font-bold ${layout === 'sidebar' ? 'text-white' : 'text-slate-800'}`}>{item.title}</h4>
                  <span className={`text-[10px] font-medium ${layout === 'sidebar' ? 'text-white/60' : 'text-slate-400'}`}>{item.period}</span>
                </div>
                {item.subtitle && <p className={`text-[11px] font-medium mb-1 ${layout === 'sidebar' ? 'text-white/70' : 'text-slate-500'}`}>{item.subtitle}</p>}
                {item.content && <p className={`text-xs leading-relaxed whitespace-pre-line ${layout === 'sidebar' ? 'text-white/80' : 'text-slate-600'}`}>{item.content}</p>}
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );

  const renderClassic = () => (
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

      {visibility.summary && (
        <section className="mb-10 px-4">
          <p className="text-center italic leading-relaxed text-slate-700 whitespace-pre-line">{personalInfo.summary}</p>
        </section>
      )}

      <div className="space-y-10 px-4">
        {visibility.experiences && (
          <section>
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
        )}

        {visibility.educations && (
          <section>
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
        )}

        {visibility.skills && (
          <section>
            <h2 className="text-lg font-bold border-b mb-4 pb-1 uppercase tracking-wider" style={{ borderColor: primaryColor, color: primaryColor }}>Professional Skills</h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill) => (
                <span key={skill.id} className="text-xs font-semibold px-3 py-1.5 bg-slate-50 text-slate-700 rounded border border-slate-200">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        <CustomSectionsRenderer layout="main" />
      </div>
    </div>
  );

  const renderModern = () => (
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
                <span key={skill.id} className="bg-white/20 text-xs px-2 py-1 rounded border border-white/10">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </aside>

      <main className="w-2/3 p-10 bg-white text-slate-800">
        {visibility.summary && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: primaryColor }}>
              <span className="w-8 h-1" style={{ backgroundColor: primaryColor }}></span> About Me
            </h2>
            <p className="text-slate-600 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        {visibility.experiences && (
          <section className="mb-10">
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
        )}

        {visibility.educations && (
          <section className="mb-10">
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
        )}

        {/* Modern 테마 커스텀 섹션 (본문 이동) */}
        <ModernMainCustomRenderer />
      </main>
    </div>
  );

  const renderMinimal = () => (
    <div className="p-12 text-slate-700 max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-5xl font-light mb-4">{personalInfo.fullName}</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 font-medium">
          <span className="text-slate-900">{personalInfo.jobTitle}</span>
          <span className="flex items-center gap-1"><i className="fa-solid fa-envelope text-xs opacity-60"></i> {personalInfo.email}</span>
          <span className="flex items-center gap-1"><i className="fa-solid fa-phone text-xs opacity-60"></i> {personalInfo.phone}</span>
        </div>
      </header>

      {visibility.summary && (
        <section className="mb-12">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Profile</h2>
            </div>
            <div className="col-span-3">
              <p className="text-lg leading-relaxed font-light">{personalInfo.summary}</p>
            </div>
          </div>
        </section>
      )}

      {visibility.experiences && (
        <section className="mb-12">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="col-span-1">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Experience</h2>
            </div>
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
      )}

      <div className="space-y-12">
        {visibility.educations && (
          <section>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="col-span-1">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Education</h2>
              </div>
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
        )}

        {visibility.skills && (
          <section>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="col-span-1">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Expertise</h2>
              </div>
              <div className="col-span-3">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill.id} className="text-sm px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 커스텀 섹션 렌더링 (Minimal - 2단 구성) */}
        {customSections.filter(s => s.visible).map(s => (
          <section key={s.id}>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="col-span-1">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{s.title}</h2>
              </div>
            </div>
            <div className="space-y-8">
              {s.items.map(item => (
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
        ))}
      </div>
    </div>
  );

  return (
    <div className="resume-paper mx-auto overflow-hidden">
      {theme === 'classic' && renderClassic()}
      {theme === 'modern' && renderModern()}
      {theme === 'minimal' && renderMinimal()}
    </div>
  );
};

export default Preview;
