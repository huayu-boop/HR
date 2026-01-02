
import React, { useState, useEffect } from 'react';
import { EmployeeForm } from './components/EmployeeForm';
import { Dashboard } from './components/Dashboard';
import { AdminLogin } from './components/AdminLogin';
import { EmployeeData, AppView } from './types';
import { Zap, ClipboardList, ShieldCheck, ArrowRight, Settings } from 'lucide-react';

const STORAGE_KEY = 'smart_onboard_v2_persistent';

const DEFAULT_MOCK_DATA: EmployeeData[] = [
  { fullName: '陳小明', email: 'ming@company.com', phone: '0912-345-678', birthday: '1992-05-12', gender: 'Male', nationalId: 'A123456789', address: '台北市信義區忠孝東路', emergencyContactName: '陳大明', emergencyContactRelation: '父', emergencyContactPhone: '0933-222-111', department: 'Engineering', position: 'Frontend Engineer', startDate: '2023-10-01', totalExperienceYears: 5, education: 'National Taiwan University', major: 'Computer Science', languages: ['Chinese', 'English'], topSkills: ['React', 'TypeScript'], bankCode: '822', bankAccount: '123456789012', mbti: 'INTJ', workStyle: 'Hybrid', interests: 'Photography', expectations: '引領技術團隊邁向現代化架構。', status: 'Active', notes: '技術領袖潛力股，具備極強的架構思維。' },
  { fullName: '林美玲', email: 'meiling@company.com', phone: '0922-111-222', birthday: '1995-08-20', gender: 'Female', nationalId: 'B222333444', address: '新北市板橋區文化路', emergencyContactName: '林媽媽', emergencyContactRelation: '母', emergencyContactPhone: '0911-000-999', department: 'Marketing', position: 'Content Strategist', startDate: '2023-11-15', totalExperienceYears: 3, education: 'Chengchi University', major: 'Journalism', languages: ['Chinese', 'English', 'Japanese'], topSkills: ['SEO', 'Copywriting'], bankCode: '007', bankAccount: '987654321098', mbti: 'ENFP', workStyle: 'Remote', interests: 'Cooking', expectations: '打造具備國際視野的品牌敘事。', status: 'Active', notes: '具備極高的團隊感染力，適合主導跨部門專案。' }
];

export default function App() {
  const [view, setView] = useState<AppView>('portal');
  const [hasApiKey, setHasApiKey] = useState(true);

  // 初始載入
  const [employees, setEmployees] = useState<EmployeeData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_MOCK_DATA;
    } catch (e) {
      return DEFAULT_MOCK_DATA;
    }
  });

  const [lastSubmission, setLastSubmission] = useState<EmployeeData | null>(null);

  // 檢查 API Key 狀態 (依照規範處理 Paid Key 邏輯)
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkKey();
  }, []);

  // 持久化同步
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true); // 觸發後直接假設成功以優化 UX
    }
  };

  const handleSubmit = (data: EmployeeData) => {
    setEmployees(prev => [...prev, data]);
    setLastSubmission(data);
    setView('success');
  };

  const handleDeleteEmployee = (email: string) => {
    if (window.confirm('確定要永久刪除此資料嗎？')) {
      setEmployees(prev => prev.filter(emp => emp.email !== email));
    }
  };

  const handleUpdateStatus = (email: string, newStatus: 'Active' | 'Resigned' | 'Hidden') => {
    setEmployees(prev => prev.map(emp => 
      emp.email === email ? { ...emp, status: newStatus } : emp
    ));
  };

  const handleUpdateNotes = (email: string, notes: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.email === email ? { ...emp, notes } : emp
    ));
  };

  const handleResetData = () => {
    if (window.confirm('確定要還原至範例數據嗎？這將覆蓋您目前所有的修改。')) {
      setEmployees(DEFAULT_MOCK_DATA);
    }
  };

  // 如果沒有 API Key，顯示設定畫面 (Vercel/Pro Model 規範)
  if (!hasApiKey && view === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-800 p-10 rounded-[2.5rem] border border-slate-700 shadow-2xl">
          <div className="bg-indigo-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Settings className="text-indigo-400 w-8 h-8 animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">需要戰略分析授權</h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            為了啟用 Gemini 3 Pro 進行深度人才戰略分析，請選取您的 Google Cloud Paid API Key。
            <br />
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-indigo-400 hover:underline">了解計費文件</a>
          </p>
          <button onClick={handleOpenKeySelector} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
            開啟金鑰選取器
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView('portal')}>
              <div className="bg-indigo-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
                <Zap className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">SmartOnboard</span>
            </div>
            
            <div className="flex gap-2">
              <button onClick={() => setView('form')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'form' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                員工入職
              </button>
              <button onClick={() => setView('admin-login')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'dashboard' || view === 'admin-login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
                HR 戰略中心
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full">
        {view === 'portal' && (
          <div className="py-12 flex flex-col items-center">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">智慧人才策略領航員</h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">基於 Gemini 3 Pro 的深度分析，讓每一次入職都成為企業成長的數據金礦。</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              <div onClick={() => setView('form')} className="group bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-400 transition-all cursor-pointer relative overflow-hidden">
                <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-indigo-600"><ClipboardList size={32} /></div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">員工入職</h2>
                <p className="text-slate-500 mb-8">啟動您的職涯體驗，提交第一手人才數據。</p>
                <div className="flex items-center text-indigo-600 font-black">開始填寫 <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" /></div>
              </div>
              <div onClick={() => setView('admin-login')} className="group bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-slate-900 transition-all cursor-pointer relative overflow-hidden">
                <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-white"><ShieldCheck size={32} /></div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">戰略管理</h2>
                <p className="text-slate-500 mb-8">調閱 AI 分析報告，制定下一階段人力策略。</p>
                <div className="flex items-center text-slate-900 font-black">進入中心 <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" /></div>
              </div>
            </div>
          </div>
        )}

        {view === 'form' && <div className="max-w-4xl mx-auto"><EmployeeForm onSubmit={handleSubmit} /></div>}
        {view === 'admin-login' && <AdminLogin onSuccess={() => setView('dashboard')} onCancel={() => setView('portal')} />}
        {view === 'dashboard' && (
          <Dashboard 
            employees={employees} 
            onDeleteEmployee={handleDeleteEmployee} 
            onUpdateStatus={handleUpdateStatus} 
            onUpdateNotes={handleUpdateNotes}
            onResetData={handleResetData}
          />
        )}
        {view === 'success' && lastSubmission && (
          <div className="max-w-2xl mx-auto text-center py-24 bg-white rounded-[3rem] border border-slate-200 shadow-xl px-12">
            <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"><Zap className="text-emerald-600 w-10 h-10" /></div>
            <h2 className="text-3xl font-bold text-slate-900">入職資料已建檔</h2>
            <p className="text-slate-500 mt-4 mb-12 text-lg font-medium">歡迎您 {lastSubmission.fullName}，系統已根據您的資料啟動個人化分析。</p>
            <button onClick={() => setView('portal')} className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg">回首頁</button>
          </div>
        )}
      </main>
      <footer className="py-10 text-center text-slate-400 text-sm border-t border-slate-200 bg-white">
        <p className="font-bold tracking-widest uppercase">SmartOnboard © 2025 | 全數據持久化引擎監控中</p>
      </footer>
    </div>
  );
}
