
import React, { useState } from 'react';
import { EmployeeData } from '../types';
import { User, ShieldAlert, Briefcase, GraduationCap, Heart, CreditCard, ChevronRight, ChevronLeft, ToggleLeft, ToggleRight, EyeOff, Sparkles } from 'lucide-react';

interface Props {
  onSubmit: (data: EmployeeData) => void;
}

export const EmployeeForm: React.FC<Props> = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<EmployeeData>>({
    topSkills: [],
    languages: ['Chinese'],
    workStyle: 'Hybrid',
    gender: 'Male',
    status: 'Active',
    department: 'Engineering'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleArrayItem = (field: 'topSkills' | 'languages', item: string) => {
    setFormData(prev => {
      const current = (prev[field] as string[]) || [];
      if (current.includes(item)) {
        return { ...prev, [field]: current.filter(i => i !== item) };
      }
      return { ...prev, [field]: [...current, item] };
    });
  };

  const commonSkills = ['Communication', 'Python', 'React', 'Project Management', 'UI Design', 'Data Analysis', 'SQL', 'Digital Marketing'];
  const commonLanguages = ['Chinese', 'English', 'Japanese', 'Korean', 'Spanish'];
  const departments = ['Engineering', 'Marketing', 'Design', 'HR', 'Finance', 'Sales', 'Operations'];
  const commonPositions = [
    'Frontend Engineer', 'Backend Engineer', 'Fullstack Engineer', 
    'Product Manager', 'Project Manager', 'UI/UX Designer', 
    'Data Scientist', 'HR Specialist', 'Financial Analyst', 
    'Marketing Manager', 'Sales Executive', 'DevOps Engineer'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as EmployeeData);
  };

  const StepHeader = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
    <div className="mb-8 border-b border-slate-100 pb-4">
      <div className="flex items-center gap-3 mb-1">
        <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-md shadow-indigo-100"><Icon size={20} /></div>
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
      </div>
      <p className="text-sm text-slate-500 font-medium">{desc}</p>
    </div>
  );

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-500">
      <div className="bg-slate-50/80 backdrop-blur-sm p-5 border-b border-slate-200 flex justify-between items-center">
        <div className="flex gap-2.5">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`h-2.5 rounded-full transition-all duration-500 ${step === s ? 'bg-indigo-600 w-24 shadow-lg shadow-indigo-200' : step > s ? 'bg-emerald-500 w-12' : 'bg-slate-200 w-12'}`} />
          ))}
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Progress {step} / 4</span>
      </div>

      <form onSubmit={handleSubmit} className="p-8 md:p-14">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <StepHeader icon={User} title="個人基本資料" desc="請填寫您的法律身分資訊以進行身分驗證。" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">全名</label>
                <input required name="fullName" value={formData.fullName || ''} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 font-bold outline-none transition-all" placeholder="例如：王小明" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">法律性別</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 font-bold outline-none appearance-none bg-white">
                  <option value="Male">男性</option>
                  <option value="Female">女性</option>
                  <option value="Other">其他/多元</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">出生日期</label>
                <input required type="date" name="birthday" value={formData.birthday || ''} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 font-bold outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">身分證字號</label>
                <input required name="nationalId" value={formData.nationalId || ''} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 font-bold outline-none" placeholder="A123456789" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">電子郵件</label>
                <input required type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 font-bold outline-none" placeholder="email@company.com" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">連絡電話</label>
                <input required name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 font-bold outline-none" placeholder="09XX-XXX-XXX" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">通訊地址</label>
                <input required name="address" value={formData.address || ''} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 font-bold outline-none" placeholder="請填寫目前居住地址" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <StepHeader icon={ShieldAlert} title="行政與緊急聯絡" desc="確保薪資發放流程與緊急狀況的安全保障。" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">銀行代碼</label>
                <input required name="bankCode" value={formData.bankCode || ''} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 font-bold outline-none" placeholder="三位數代碼 (如 822)" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">銀行帳號</label>
                <input required name="bankAccount" value={formData.bankAccount || ''} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 font-bold outline-none" placeholder="純數字帳號" />
              </div>
            </div>
            <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100">
              <h4 className="font-black text-amber-800 text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                緊急聯絡人資訊 (必填)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-amber-600 uppercase">姓名</label>
                  <input required name="emergencyContactName" value={formData.emergencyContactName || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:ring-4 focus:ring-amber-100 font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-amber-600 uppercase">關係</label>
                  <input required name="emergencyContactRelation" value={formData.emergencyContactRelation || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:ring-4 focus:ring-amber-100 font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-amber-600 uppercase">電話</label>
                  <input required name="emergencyContactPhone" value={formData.emergencyContactPhone || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:ring-4 focus:ring-amber-100 font-bold outline-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <StepHeader icon={Briefcase} title="職務與專業背景" desc="請輸入您即將入職的職務資訊及過往經歷。" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 bg-indigo-50/30 p-8 rounded-[2rem] border border-indigo-50">
              <div className="space-y-2">
                <label className="text-xs font-black text-indigo-600 uppercase tracking-widest">應徵部門</label>
                <select required name="department" value={formData.department} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-indigo-100 focus:ring-4 focus:ring-indigo-100 font-bold outline-none bg-white">
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-indigo-600 uppercase tracking-widest">職位名稱 (Position)</label>
                <input 
                  required 
                  list="positions-list"
                  name="position" 
                  value={formData.position || ''} 
                  onChange={handleChange} 
                  className="w-full px-5 py-4 rounded-2xl border border-indigo-100 focus:ring-4 focus:ring-indigo-100 font-bold outline-none" 
                  placeholder="例如：Senior Frontend Engineer" 
                />
                <datalist id="positions-list">
                  {commonPositions.map(p => <option key={p} value={p} />)}
                </datalist>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-indigo-600 uppercase tracking-widest">入職日期</label>
                <input required type="date" name="startDate" value={formData.startDate || ''} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-indigo-100 focus:ring-4 focus:ring-indigo-100 font-bold outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-indigo-600 uppercase tracking-widest">總工作年資</label>
                <input required type="number" name="totalExperienceYears" value={formData.totalExperienceYears || ''} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-indigo-100 focus:ring-4 focus:ring-indigo-100 font-bold outline-none" placeholder="年數" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">畢業院校</label>
                <input required name="education" value={formData.education || ''} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 font-bold outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">主修學系</label>
                <input required name="major" value={formData.major || ''} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 font-bold outline-none" />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">掌握語言</label>
              <div className="flex flex-wrap gap-2.5">
                {commonLanguages.map(lang => (
                  <button key={lang} type="button" onClick={() => toggleArrayItem('languages', lang)} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all border ${formData.languages?.includes(lang) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'}`}>{lang}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <StepHeader icon={Heart} title="個人特質與文化匹配" desc="這將作為 Gemini 3 Pro 深度分析您的團隊定位與戰略適配度的關鍵。" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">MBTI 類型</label>
                <select name="mbti" value={formData.mbti || ''} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 font-bold outline-none appearance-none bg-white">
                  <option value="">選擇類型</option>
                  {['INTJ', 'ENTJ', 'INTP', 'ENTP', 'INFJ', 'ENFJ', 'INFP', 'ENFP', 'ISTJ', 'ESTJ', 'ISFJ', 'ESFJ', 'ISTP', 'ESTP', 'ISFP', 'ESFP'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">工作模式</label>
                <select name="workStyle" value={formData.workStyle} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 font-bold outline-none appearance-none bg-white">
                  <option value="Hybrid">混合辦公 (Hybrid)</option>
                  <option value="Remote">完全遠端 (Remote)</option>
                  <option value="On-site">辦公室駐點 (On-site)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">初始狀態</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 font-bold outline-none appearance-none bg-white">
                  <option value="Active">正式在職</option>
                  <option value="Hidden">隱藏 (人才儲備)</option>
                </select>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-500" />
                  強項技能標籤
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {commonSkills.map(skill => (
                    <button key={skill} type="button" onClick={() => toggleArrayItem('topSkills', skill)} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all border ${formData.topSkills?.includes(skill) ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-300'}`}>{skill}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">個人興趣與愛好</label>
                <input name="interests" value={formData.interests || ''} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 font-bold outline-none" placeholder="例如：攝影、馬拉松、開源專案貢獻..." />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">對職涯的具體期望</label>
                <textarea name="expectations" value={formData.expectations || ''} onChange={handleChange} rows={3} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 font-bold outline-none resize-none" placeholder="請描述您希望在公司達成的目標或希望獲得的成長..." />
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 pt-10 border-t border-slate-100 flex justify-between items-center">
          {step > 1 ? (
            <button type="button" onClick={() => setStep(step - 1)} className="flex items-center gap-3 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-indigo-600 transition-colors">
              <ChevronLeft size={20} /> 上一步
            </button>
          ) : <div />}
          
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-[10px] font-black text-slate-300 uppercase tracking-widest italic">All data encrypted</span>
            {step < 4 ? (
              <button type="button" onClick={() => setStep(step + 1)} className="flex items-center gap-3 bg-indigo-600 text-white px-10 py-4 rounded-[1.25rem] font-black text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02]">
                繼續填寫 <ChevronRight size={18} />
              </button>
            ) : (
              <button type="submit" className="flex items-center gap-3 bg-slate-900 text-white px-12 py-4 rounded-[1.25rem] font-black text-sm hover:bg-black shadow-2xl transition-all hover:scale-[1.02] group">
                確認並提交資料 
                <div className="bg-indigo-600 p-1 rounded-md group-hover:rotate-12 transition-transform">
                  <ChevronRight size={16} />
                </div>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
