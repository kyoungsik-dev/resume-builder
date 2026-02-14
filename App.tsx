
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { ResumeData, initialData, emptyData } from './types';
import { parsePdfResume } from './services/gemini';

const App: React.FC = () => {
  const [data, setData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('resume-data');
    return saved ? JSON.parse(saved) : initialData;
  });

  // 좌측 패널 너비 상태 (퍼센트 단위)
  const [leftWidth, setLeftWidth] = useState(35);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('resume-data', JSON.stringify(data));
  }, [data]);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      // 최소 20%, 최대 80%로 제한
      if (newWidth >= 20 && newWidth <= 80) {
        setLeftWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
      // 드래그 중 텍스트 선택 방지
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const previewEl = previewRef.current;
    if (!previewEl) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>Resume - ${data.personalInfo.fullName}</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
    body {
      font-family: 'Inter', 'Noto Sans KR', sans-serif;
      margin: 0;
      padding: 0;
      background: white;
    }
    .resume-paper {
      width: 210mm;
      min-height: 297mm;
      background: white;
      margin: 0 auto;
    }
    .resume-paper .text-\\[10px\\] { font-size: 0.625em; }
    .resume-paper .text-\\[11px\\] { font-size: 0.6875em; }
    .resume-paper .text-xs { font-size: 0.75em; line-height: 1.5em; }
    .resume-paper .text-sm { font-size: 0.875em; line-height: 1.5em; }
    .resume-paper .text-base { font-size: 1em; line-height: 1.5em; }
    .resume-paper .text-lg { font-size: 1.125em; line-height: 1.75em; }
    .resume-paper .text-xl { font-size: 1.25em; line-height: 1.75em; }
    .resume-paper .text-2xl { font-size: 1.5em; line-height: 2em; }
    .resume-paper .text-4xl { font-size: 2.25em; line-height: 2.5em; }
    .resume-paper .text-5xl { font-size: 3em; line-height: 1; }
    @media print {
      body { background: white; }
      .resume-paper {
        width: 100%;
        margin: 0;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>${previewEl.innerHTML}</body>
</html>`);
    printWindow.document.close();

    // Tailwind CDN 로드 후 print 실행
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const handleSaveFile = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.personalInfo.fullName || 'resume'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const loaded = JSON.parse(ev.target?.result as string) as ResumeData;
        setData(loaded);
      } catch {
        alert('올바른 이력서 파일이 아닙니다.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (confirm('모든 데이터를 초기화하시겠습니까?')) {
      setData(initialData);
    }
  };

  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleLoadPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    setIsPdfLoading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const parsed = await parsePdfResume(base64);

      let idCounter = Date.now();
      const nextId = () => (idCounter++).toString();
      const nl = (s: string) => (s || '').replace(/\\n/g, '\n');

      const customSections = (parsed.customSections || []).map((cs: any) => ({
        id: nextId(),
        title: cs.title || '',
        visible: true,
        items: (cs.items || []).map((item: any) => ({
          id: nextId(),
          title: item.title || '',
          period: item.period || '',
          subtitle: item.subtitle || '',
          content: nl(item.content),
        })),
      }));

      const newData: ResumeData = {
        personalInfo: {
          fullName: parsed.personalInfo?.fullName || '',
          email: parsed.personalInfo?.email || '',
          phone: parsed.personalInfo?.phone || '',
          address: parsed.personalInfo?.address || '',
          jobTitle: parsed.personalInfo?.jobTitle || '',
          summary: nl(parsed.personalInfo?.summary),
        },
        experiences: (parsed.experiences || []).map((exp: any) => ({
          id: nextId(),
          company: exp.company || '',
          position: exp.position || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          achievements: (exp.achievements || []).map((a: any) => ({
            id: nextId(),
            title: a.title || '',
            period: a.period || '',
            role: a.role || '',
            content: nl(a.content),
          })),
        })),
        educations: (parsed.educations || []).map((edu: any) => ({
          id: nextId(),
          school: edu.school || '',
          degree: edu.degree || '',
          major: edu.major || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
        })),
        skills: (parsed.skills || []).map((s: any) => ({
          id: nextId(),
          name: s.name || '',
        })),
        customSections,
        visibility: {
          summary: true,
          experiences: true,
          educations: true,
          skills: true,
        },
        sectionOrder: [
          'summary', 'experiences', 'educations', 'skills',
          ...customSections.map((cs: any) => cs.id),
        ],
        theme: data.theme,
        primaryColor: data.primaryColor,
        fontSize: data.fontSize,
      };

      setData(newData);
    } catch (err) {
      console.error(err);
      alert('PDF 파싱에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsPdfLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 no-print">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg shadow-blue-200 shadow-lg">
            <i className="fa-solid fa-file-invoice text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">AI Resume Pro</h1>
            <p className="text-xs text-slate-500 font-medium">Professional Builder</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* 테마 선택 */}
          <div className="flex items-center gap-2">
            {(['standard', 'classic', 'modern', 'minimal'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setData({ ...data, theme: t })}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${data.theme === t ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* 포인트 컬러 */}
          <div className="flex items-center gap-1.5">
            {['#2563eb', '#dc2626', '#16a34a', '#7c3aed', '#ea580c', '#334155'].map((color) => (
              <button
                key={color}
                onClick={() => setData({ ...data, primaryColor: color })}
                style={{ backgroundColor: color }}
                className={`w-6 h-6 rounded-full border-2 transition-all ${data.primaryColor === color ? 'border-white ring-2 ring-slate-300 scale-110' : 'border-transparent hover:scale-110'}`}
              />
            ))}
          </div>

          {/* 폰트 크기 */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setData({ ...data, fontSize: Math.max(12, data.fontSize - 1) })}
              className="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors text-xs font-bold"
            >
              <i className="fa-solid fa-minus text-[10px]"></i>
            </button>
            <span className="text-xs font-semibold text-slate-600 w-10 text-center">{data.fontSize}px</span>
            <button
              onClick={() => setData({ ...data, fontSize: Math.min(24, data.fontSize + 1) })}
              className="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors text-xs font-bold"
            >
              <i className="fa-solid fa-plus text-[10px]"></i>
            </button>
          </div>

          <div className="w-px h-6 bg-slate-200" />

          <button
            onClick={handleSaveFile}
            className="text-slate-500 hover:text-slate-800 text-sm font-medium px-3 py-2 flex items-center gap-1.5"
          >
            <i className="fa-solid fa-download text-xs"></i>
            저장
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-slate-500 hover:text-slate-800 text-sm font-medium px-3 py-2 flex items-center gap-1.5"
          >
            <i className="fa-solid fa-upload text-xs"></i>
            불러오기
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleLoadFile}
            className="hidden"
          />
          <button
            onClick={() => {
              if (isPdfLoading) return;
              if (confirm('본인의 이력서 PDF 파일을 불러와 자동으로 채워넣는 AI 기능입니다.\n\n계속 진행하시겠습니까?')) {
                pdfInputRef.current?.click();
              }
            }}
            disabled={isPdfLoading}
            className="text-slate-500 hover:text-slate-800 text-sm font-medium px-3 py-2 flex items-center gap-1.5 disabled:opacity-50"
          >
            {isPdfLoading ? <i className="fa-solid fa-spinner fa-spin text-xs"></i> : <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>}
            {isPdfLoading ? 'AI 분석 중...' : '이력서 가져오기'}
            {!isPdfLoading && <span className="text-[10px] bg-blue-100 text-blue-600 font-bold px-1.5 py-0.5 rounded-full leading-none">AI</span>}
          </button>
          <input
            ref={pdfInputRef}
            type="file"
            accept=".pdf"
            onChange={handleLoadPdf}
            className="hidden"
          />
          <button
            onClick={handleReset}
            className="text-slate-500 hover:text-slate-800 text-sm font-medium px-3 py-2"
          >
            초기화
          </button>
          <button
            onClick={handlePrint}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-slate-800 transition-all shadow-md flex items-center gap-2 text-sm font-bold"
          >
            <i className="fa-solid fa-file-pdf"></i>
            PDF로 저장
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main ref={containerRef} className="flex-1 flex overflow-hidden relative">
        {/* Editor Side */}
        <div 
          className="overflow-y-auto bg-white border-r border-slate-200 no-print h-full"
          style={{ width: `${leftWidth}%` }}
        >
          <Editor data={data} onChange={setData} />
        </div>

        {/* Resizer Handle */}
        <div 
          onMouseDown={startResizing}
          className={`no-print w-1.5 h-full cursor-col-resize hover:bg-blue-400 active:bg-blue-600 transition-colors z-20 absolute top-0 bottom-0`}
          style={{ left: `calc(${leftWidth}% - 3px)` }}
        />

        {/* Preview Side */}
        <div 
          className="h-full overflow-y-auto bg-slate-100 p-8 flex justify-center items-start transition-[width]"
          style={{ width: `${100 - leftWidth}%` }}
        >
          <div className="origin-top transition-transform duration-200" style={{ transform: `scale(${Math.min(1, (100 - leftWidth) / 50)})` }}>
            <div ref={previewRef}>
              <Preview data={data} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Status */}
      <footer className="bg-white border-t border-slate-200 py-2 px-6 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest no-print">
        <span>© 2026 AI Resume Pro • All changes autosaved</span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Online</span>
          <span>Build version 1.0.2</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
