import React, { useState } from 'react';
import type { CompanyData } from '../../types/assessment';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface CompanyFormProps {
  initialData: CompanyData | null;
  onNext: (data: CompanyData) => void;
  onBack: () => void;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({ initialData, onNext, onBack }) => {
  const [formData, setFormData] = useState<CompanyData>(
    initialData || {
      companyName: '',
      contactName: '',
      role: '',
      email: '',
      phone: '',
      city: '',
      country: '',
      sector: '',
      employeeCount: '',
      yearsInBusiness: '',
      consent: false,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const isFormValid = () => {
    return (
      formData.companyName.trim() !== '' &&
      formData.contactName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.consent
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onNext(formData);
    }
  };

  const inputClass = "w-full bg-slate-900/60 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 opacity-100">
      <div className="glass-card rounded-2xl p-6 md:p-10 shadow-2xl">
        <h2 className="text-3xl font-bold mb-2 font-heading text-white">Datos de la Empresa</h2>
        <p className="text-slate-400 mb-8">Por favor, complete la siguiente información para personalizar su diagnóstico.</p>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Nombre de la empresa *</label>
              <input required type="text" name="companyName" value={formData.companyName} onChange={handleChange} className={inputClass} placeholder="Ej. ACME Corp" />
            </div>
            <div>
              <label className={labelClass}>Sector o actividad económica</label>
              <input type="text" name="sector" value={formData.sector} onChange={handleChange} className={inputClass} placeholder="Ej. Tecnología, Comercio..." />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Nombre del responsable *</label>
              <input required type="text" name="contactName" value={formData.contactName} onChange={handleChange} className={inputClass} placeholder="Su nombre" />
            </div>
            <div>
              <label className={labelClass}>Cargo</label>
              <input type="text" name="role" value={formData.role} onChange={handleChange} className={inputClass} placeholder="Ej. Gerente General" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Correo electrónico *</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="correo@empresa.com" />
            </div>
            <div>
              <label className={labelClass}>Teléfono</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+591 70000000" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Ciudad</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>País</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Número aprox. de colaboradores</label>
              <select name="employeeCount" value={formData.employeeCount} onChange={handleChange} className={inputClass}>
                <option value="">Seleccione una opción</option>
                <option value="1-10">1 a 10</option>
                <option value="11-50">11 a 50</option>
                <option value="51-200">51 a 200</option>
                <option value="201+">Más de 200</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Años de funcionamiento</label>
              <select name="yearsInBusiness" value={formData.yearsInBusiness} onChange={handleChange} className={inputClass}>
                <option value="">Seleccione una opción</option>
                <option value="Menos de 1 año">Menos de 1 año</option>
                <option value="1-3 años">1 a 3 años</option>
                <option value="4-10 años">4 a 10 años</option>
                <option value="Más de 10 años">Más de 10 años</option>
              </select>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                name="consent" 
                checked={formData.consent} 
                onChange={handleChange} 
                className="mt-1 w-5 h-5 rounded border-slate-600 text-blue-600 focus:ring-blue-500 bg-slate-800"
              />
              <span className="text-sm text-slate-300">
                Acepto que la información proporcionada sea utilizada para generar el diagnóstico empresarial y autorizo ser contactado. *
              </span>
            </label>
          </div>

          <div className="flex justify-between items-center mt-10">
            <button 
              type="button" 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-300 hover:text-white px-4 py-2 transition-colors"
            >
              <ArrowLeft size={18} /> Anterior
            </button>
            <button 
              type="submit" 
              disabled={!isFormValid()}
              className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                isFormValid() 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              Continuar <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
