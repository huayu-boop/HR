
import React, { useState } from 'react';
import { EmployeeData } from '../types';
import { User, ShieldAlert, Briefcase, GraduationCap, Heart, CreditCard, ChevronRight, ChevronLeft, ToggleLeft, ToggleRight, EyeOff } from 'lucide-react';

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
    status: 'Active' 
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as EmployeeData);
  };

  const StepHeader = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
    <div className="mb-8 border-b border-slate-100 pb-4">
      <div className="flex items-center gap-3 mb-1">
        <div className="bg-indigo-600 p-2 rounded-lg text-white"><Icon size={20} /></div>
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      </div>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`h-2 w-12 rounded-full transition-all ${step === s ? 'bg-indigo-600 w-20' : step > s ? 'bg-green-500' : 'bg-slate-200'}`} />
          ))}
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step {step} of 4</span>
      </div>

      <form onSubmit={handleSubmit} className="p-8 md:p-12">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right duration-300">
            <StepHeader icon={User} title="個人基本資料" desc="我們需要這些資訊來完成您的員工建檔。" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">全名</label>
                <input required name="fullName" value={formData.fullName || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="中文或英文全名" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">性別</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="Male">男性</option>
                  <option value="Female">女性</option>
                  <option value="Other">多元/其他</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">出生日期</label>
                <input required type="date" name="birthday" value={formData.birthday || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">身分證字號</label>
                <input required name="nationalId" value={formData.nationalId || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="A123456789" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">電子郵件</label>
                <input required type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="personal@email.com" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">行動電話</label>
                <input required name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="09XX-XXX-XXX" />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-sm font-bold text-slate-700">通訊地址</label>
                <input required name="address" value={formData.address || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="請輸入完整住址" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right duration-300">
            <StepHeader icon={ShieldAlert} title="行政與緊急聯絡" desc="為了確保您的權益與薪資發放。" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">薪轉銀行代碼</label>
                <input required name="bankCode" value={formData.bankCode || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="例如：822" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">薪轉帳號</label>
                <input required name="bankAccount" value={formData.bankAccount || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="完整帳號數字" />
              </div>
            </div>
            <h4 className="font-bold text-slate-800 text-sm mb-4 border-l-4 border-amber-500 pl-2">緊急聯絡人</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">姓名</label>
                <input required name="emergencyContactName" value={formData.emergencyContactName || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">關係</label>
                <input required name="emergencyContactRelation" value={formData.emergencyContactRelation || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">聯絡電話</label>
                <input required name="emergencyContactPhone" value={formData.emergencyContactPhone || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right duration-300">
            <StepHeader icon={Briefcase} title="職涯與學術背景" desc="您的過往經歷是公司最寶貴的資產。" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">總工作年資</label>
                <input required type="number" name="totalExperienceYears" value={formData.totalExperienceYears || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">畢業院校</label>
                <input required name="education" value={formData.education || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">主修專業</label>
                <input required name="major" value={formData.major || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">入職日期</label>
                <input required type="date" name="startDate" value={formData.startDate || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700">語言能力</label>
              <div className="flex flex-wrap gap-2">
                {commonLanguages.map(lang => (
                  <button key={lang} type="button" onClick={() => toggleArrayItem('languages', lang)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${formData.languages?.includes(lang) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{lang}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right duration-300">
            <StepHeader icon={Heart} title="個人特質與期望" desc="這能幫助 AI 為您規劃最佳入職計畫。" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">MBTI 類型</label>
                <select name="mbti" value={formData.mbti || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="">選擇類型</option>
                  {['INTJ', 'ENTJ', 'INTP', 'ENTP', 'INFJ', 'ENFJ', 'INFP', 'ENFP', 'ISTJ', 'ESTJ', 'ISFJ', 'ESFJ', 'ISTP', 'ESTP', 'ISFP', 'ESFP'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">預設職務狀態</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="Active">在職 (Active)</option>
                  <option value="Resigned">離職 (Resigned)</option>
                  <option value="Hidden">隱藏 (Hidden)</option>
                </select>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">強項技能</label>
                <div className="flex flex-wrap gap-2">
                  {commonSkills.map(skill => (
                    <button key={skill} type="button" onClick={() => toggleArrayItem('topSkills', skill)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${formData.topSkills?.includes(skill) ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{skill}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">對公司的期望</label>
                <textarea name="expectations" value={formData.expectations || ''} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="您希望在這裡達成什麼？" />
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between">
          {step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-700 transition-colors">
              <ChevronLeft size={20} /> 上一步
            </button>
          )}
          <div className="ml-auto">
            {step < 4 ? (
              <button type="button" onClick={() => setStep(step + 1)} className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                下一步 <ChevronRight size={20} />
              </button>
            ) : (
              <button type="submit" className="flex items-center gap-2 bg-green-600 text-white px-10 py-3 rounded-2xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all">
                完成提交資料
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
