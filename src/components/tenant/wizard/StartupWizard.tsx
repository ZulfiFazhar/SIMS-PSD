import { useState } from "react";
import { Button, Card, Input, Select } from "../../SharedUI";
import { FileText, Save, Send, Plus, Trash2 } from "lucide-react";
import { type Startup, StartupStatus, CATEGORIES } from "../../../types";
import { storageService } from "../../../services/storageService";

interface StartupWizardProps {
  initialData: Partial<Startup>;
  onCancel: () => void;
  onSuccess: () => void;
}

export function StartupWizard({
  initialData,
  onCancel,
  onSuccess,
}: StartupWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Startup>>(initialData);

  const handleInputChange = (
    field: keyof Startup,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value } as Partial<Startup>));
  };

  const addMember = () => {
    const current = formData.teamMembers || [];
    if (current.length < 4) {
      setFormData((prev) => ({ ...prev, teamMembers: [...current, ""] }));
    }
  };

  const updateMember = (idx: number, val: string) => {
    const current = [...(formData.teamMembers || [])];
    current[idx] = val;
    setFormData((prev) => ({ ...prev, teamMembers: current }));
  };

  const removeMember = (idx: number) => {
    const current = [...(formData.teamMembers || [])];
    current.splice(idx, 1);
    setFormData((prev) => ({ ...prev, teamMembers: current }));
  };

  const handleFileToggle = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: !prev.documents?.[field as keyof typeof prev.documents],
      },
    }));
  };

  const handleSubmit = (isDraft: boolean) => {
    const newStartup: Startup = {
      ...(formData as Startup),
      id: formData.id || `s-${Date.now()}`,
      status: isDraft ? StartupStatus.DRAFT : StartupStatus.SUBMITTED,
      submissionDate: new Date().toISOString(),
    };
    storageService.saveStartup(newStartup);
    alert(isDraft ? "Draft disimpan!" : "Pendaftaran berhasil dikirim!");
    onSuccess();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="secondary" onClick={onCancel}>
          &larr; Kembali
        </Button>
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                step === s
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      <Card>
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b pb-2">
              Identitas Bisnis
            </h3>
            <Input
              label="Nama Bisnis"
              value={formData.businessName || ""}
              onChange={(e) =>
                handleInputChange("businessName", e.target.value)
              }
              placeholder="Contoh: Kopi Kampus"
            />
            <Select
              label="Kategori"
              options={CATEGORIES}
              value={formData.category || ""}
              onChange={(e) => handleInputChange("category", e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Tipe Alamat"
                options={["Online", "Offline"]}
                value={formData.addressType || ""}
                onChange={(e) =>
                  handleInputChange("addressType", e.target.value)
                }
              />
              <Input
                label="Fakultas / Prodi"
                value={formData.faculty || ""}
                onChange={(e) => handleInputChange("faculty", e.target.value)}
              />
            </div>
            <Input
              label="Alamat Lengkap"
              value={formData.addressDetails || ""}
              onChange={(e) =>
                handleInputChange("addressDetails", e.target.value)
              }
            />
            <Input
              label="Ketua Tim"
              value={formData.teamLeader || ""}
              onChange={(e) => handleInputChange("teamLeader", e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                Anggota Tim (Maks 4)
              </label>
              {formData.teamMembers?.map((member, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    className="flex-1 px-3 py-2 border rounded-lg"
                    value={member}
                    onChange={(e) => updateMember(idx, e.target.value)}
                    placeholder={`Anggota ${idx + 1}`}
                  />
                  <button
                    onClick={() => removeMember(idx)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {formData.teamMembers && formData.teamMembers.length < 4 && (
                <Button
                  variant="outline"
                  onClick={addMember}
                  className="text-xs py-1"
                >
                  <Plus size={14} /> Tambah Anggota
                </Button>
              )}
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)}>Lanjut &rarr;</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b pb-2">Status Usaha</h3>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => handleInputChange("isGrowing", false)}
                className={`flex-1 p-4 rounded-lg border-2 text-center ${
                  !formData.isGrowing
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200"
                }`}
              >
                <div className="font-bold">Usaha Baru</div>
                <div className="text-xs text-slate-500">Ide / Prototype</div>
              </button>
              <button
                onClick={() => handleInputChange("isGrowing", true)}
                className={`flex-1 p-4 rounded-lg border-2 text-center ${
                  formData.isGrowing
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200"
                }`}
              >
                <div className="font-bold">Bertumbuh</div>
                <div className="text-xs text-slate-500">Sudah Berjalan</div>
              </button>
            </div>

            {formData.isGrowing && (
              <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
                <Select
                  label="Lama Usaha"
                  options={["< 6 Bulan", "6 - 12 Bulan", "> 1 Tahun"]}
                  value={formData.businessDuration || ""}
                  onChange={(e) =>
                    handleInputChange("businessDuration", e.target.value)
                  }
                />
                <Input
                  label="Rata-rata Omzet Harian (Rp)"
                  type="number"
                  value={formData.dailyRevenue || ""}
                  onChange={(e) =>
                    handleInputChange("dailyRevenue", Number(e.target.value))
                  }
                />
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={() => setStep(1)}>
                &larr; Kembali
              </Button>
              <Button onClick={() => setStep(3)}>Lanjut &rarr;</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b pb-2">Upload Dokumen</h3>
            <p className="text-sm text-slate-500 mb-4">
              Simulasi upload: Centang dokumen yang "sudah diupload".
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "logo",
                "socialMedia",
                "nib",
                "bmc",
                "financial",
                "rab",
                "productPhoto",
                "proposal",
              ].map((key) => (
                <div
                  key={key}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-slate-50"
                >
                  <input
                    type="checkbox"
                    id={key}
                    checked={
                      !!formData.documents?.[
                        key as keyof typeof formData.documents
                      ]
                    }
                    onChange={() => handleFileToggle(key)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor={key}
                    className="flex-1 font-medium text-sm capitalize"
                  >
                    {key.replace(/([A-Z])/g, " $1").trim()}{" "}
                    {key === "proposal" || key === "financial" ? "*" : ""}
                  </label>
                  <FileText size={16} className="text-slate-400" />
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-6 border-t mt-6">
              <Button variant="secondary" onClick={() => setStep(2)}>
                &larr; Kembali
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleSubmit(true)}>
                  <Save size={16} /> Simpan Draft
                </Button>
                <Button variant="primary" onClick={() => handleSubmit(false)}>
                  <Send size={16} /> Submit Final
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
