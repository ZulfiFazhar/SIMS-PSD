import { useState, useEffect } from "react";
import { Upload, Plus, Trash2, Save, Send, User, Building2, Users, FileText, Share2, Loader2, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { tenantService } from "../../services/tenantService";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export function TenantRegister() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
    const [error, setError] = useState<string | null>(null);

    // Form States
    const [formData, setFormData] = useState({
        nama_ketua_tim: "",
        nim_nidn_ketua: "",
        nomor_telepon: "",
        fakultas: "",
        prodi: "",
        nama_bisnis: "",
        kategori_bisnis: "",
        jenis_usaha: "",
        alamat_usaha: "",
        startupStatus: "",
        lama_waktu_usaha: 0,
        omzet: "0",
        social_ig: "",
        social_tiktok: "",
    });

    const [members, setMembers] = useState([{ name: "", nim: "" }]);
    const [files, setFiles] = useState<{ [key: string]: File | null }>({
        logo: null,
        sertifikat_nib: null,
        proposal: null,
        bmc: null,
        rab: null,
        laporan_keuangan: null,
    });
    const [productPhotos, setProductPhotos] = useState<File[]>([]);

    // Init Logic: Load Draft
    useEffect(() => {
        const savedDraft = localStorage.getItem("tenant_register_draft");
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft);
                setFormData((prev) => ({ ...prev, ...draft.formData }));
                setMembers(draft.members || [{ name: "", nim: "" }]);
            } catch (e) {
                console.error("Failed to load draft", e);
            }
        }
    }, []);

    // Save Draft Logic
    const saveDraft = () => {
        setSaveStatus("saving");
        const draftData = {
            formData,
            members,
            // Files cannot be saved in localStorage
        };
        localStorage.setItem("tenant_register_draft", JSON.stringify(draftData));
        setTimeout(() => setSaveStatus("saved"), 500);
        setTimeout(() => setSaveStatus("idle"), 3000);
    };

    // Auto-save logic (debounce 2s)
    useEffect(() => {
        const timer = setTimeout(() => {
            saveDraft();
        }, 2000);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData, members]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        if (e.target.files && e.target.files[0]) {
            setFiles((prev) => ({ ...prev, [key]: e.target.files![0] }));
        }
    };

    const handleProductPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newPhotos = Array.from(e.target.files);
            setProductPhotos((prev) => [...prev, ...newPhotos]);
        }
    };

    const addMember = () => setMembers([...members, { name: "", nim: "" }]);

    const removeMember = (index: number) => {
        const newMembers = [...members];
        newMembers.splice(index, 1);
        setMembers(newMembers);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Get current session token
            const session = authService.getCurrentSession();
            if (!session?.idToken) throw new Error("Silakan login kembali.");

            const submissionData = new FormData();

            // 1. Mandatory Fields
            submissionData.append("nama_ketua_tim", formData.nama_ketua_tim);
            submissionData.append("nim_nidn_ketua", formData.nim_nidn_ketua);
            submissionData.append("nomor_telepon", formData.nomor_telepon);
            submissionData.append("fakultas", formData.fakultas);
            submissionData.append("prodi", formData.prodi);
            submissionData.append("nama_bisnis", formData.nama_bisnis);
            submissionData.append("kategori_bisnis", formData.kategori_bisnis);
            submissionData.append("alamat_usaha", formData.alamat_usaha);
            submissionData.append("jenis_usaha", formData.jenis_usaha);
            
            // Logic for lama_usaha & omzet
            if (formData.startupStatus === "bertumbuh") {
                submissionData.append("lama_usaha", formData.lama_waktu_usaha.toString());
                submissionData.append("omzet", formData.omzet.toString());
            } else {
                submissionData.append("lama_usaha", "0");
                submissionData.append("omzet", "0");
            }

            // 2. Optional Fields (JSON Strings)
            const memberNames = members.map(m => m.name).filter(n => n);
            const memberNims = members.map(m => m.nim).filter(n => n);
            
            if (memberNames.length > 0) {
                submissionData.append("nama_anggota_tim", JSON.stringify(memberNames));
                submissionData.append("nim_nidn_anggota", JSON.stringify(memberNims));
            }

            const socialMedia = {
                instagram: formData.social_ig,
                tiktok: formData.social_tiktok
            };
            submissionData.append("akun_medsos", JSON.stringify(socialMedia));

            // 3. Files
            Object.entries(files).forEach(([key, file]) => {
                if (file) submissionData.append(key, file);
            });

            productPhotos.forEach((photo) => {
                submissionData.append("foto_produk", photo);
            });

            // Call API
            await tenantService.registerStartup(submissionData, session.idToken);
            
            // Clear Draft
            localStorage.removeItem("tenant_register_draft");
            
            // Redirect
            // alert("Pendaftaran Berhasil! Menunggu verifikasi admin.");
            navigate("/tenant");

        } catch (err: any) {
            setError(err.message || "Gagal mengirim pendaftaran");
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="p-6 max-w-full mx-auto pb-20">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Registrasi Startup</h1>
                    <p className="text-gray-500 mt-1">Lengkapi data di bawah ini untuk mendaftarkan startup Anda.</p>
                </div>
                {saveStatus === "saving" && <span className="text-sm text-gray-400 flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin"/> Menyimpan draft...</span>}
                {saveStatus === "saved" && <span className="text-sm text-green-600 flex items-center gap-2"><Check className="w-3 h-3"/> Draft tersimpan</span>}
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Identitas Ketua Tim */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Identitas Ketua Tim</h2>
                            <p className="text-sm text-gray-500">Informasi data diri ketua tim pengusul</p>
                        </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap Ketua</label>
                            <input
                                required
                                type="text"
                                name="nama_ketua_tim"
                                value={formData.nama_ketua_tim}
                                onChange={handleInputChange}
                                placeholder="Masukkan nama lengkap"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">NIM / NIDN</label>
                            <input
                                required
                                type="text"
                                name="nim_nidn_ketua"
                                value={formData.nim_nidn_ketua}
                                onChange={handleInputChange}
                                placeholder="Masukkan NIM atau NIDN"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon / WhatsApp</label>
                            <input
                                required
                                type="tel"
                                name="nomor_telepon"
                                value={formData.nomor_telepon}
                                onChange={handleInputChange}
                                placeholder="Contoh: 081234567890"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fakultas</label>
                            <select 
                                required
                                name="fakultas"
                                value={formData.fakultas}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                            >
                                <option value="">Pilih Fakultas</option>
                                <option value="teknik">Fakultas Teknik dan Ilmu Komputer</option>
                                <option value="ekonomi">Fakultas Ekonomi dan Bisnis</option>
                                <option value="desain">Fakultas Desain</option>
                                <option value="sastra">Fakultas Sastra</option>
                                <option value="hukum">Fakultas Hukum</option>
                                <option value="isip">Fakultas Ilmu Sosial dan Ilmu Politik</option>
                            </select>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Program Studi</label>
                            <input
                                required
                                type="text"
                                name="prodi"
                                value={formData.prodi}
                                onChange={handleInputChange}
                                placeholder="Contoh: Teknik Informatika"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </section>

                {/* Section 2: Data Startup / Bisnis */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Data Startup</h2>
                            <p className="text-sm text-gray-500">Informasi mengenai bisnis atau startup yang dijalankan</p>
                        </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Bisnis / Startup</label>
                            <input
                                required
                                type="text"
                                name="nama_bisnis"
                                value={formData.nama_bisnis}
                                onChange={handleInputChange}
                                placeholder="Masukkan nama bisnis Anda"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Bisnis</label>
                            <select 
                                required
                                name="kategori_bisnis"
                                value={formData.kategori_bisnis}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                            >
                                <option value="">Pilih Kategori</option>
                                <option value="kuliner">Kuliner</option>
                                <option value="fashion">Fashion</option>
                                <option value="teknologi">Teknologi / Digital</option>
                                <option value="jasa">Jasa</option>
                                <option value="kreatif">Industri Kreatif</option>
                                <option value="agribisnis">Agribisnis</option>
                                <option value="lainnya">Lainnya</option>
                            </select>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Usaha</label>
                            <select 
                                required
                                name="jenis_usaha"
                                value={formData.jenis_usaha}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                            >
                                <option value="">Pilih Jenis</option>
                                <option value="barang">Barang</option>
                                <option value="jasa">Jasa</option>
                                <option value="campuran">Barang & Jasa</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Usaha</label>
                            <textarea
                                required
                                rows={3}
                                name="alamat_usaha"
                                value={formData.alamat_usaha}
                                onChange={handleInputChange}
                                placeholder="Masukkan alamat lengkap lokasi usaha"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Lama Usaha</label>
                            <select
                                name="startupStatus"
                                value={formData.startupStatus}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                            >
                                <option value="">Pilih Status</option>
                                <option value="baru">Baru</option>
                                <option value="bertumbuh">Bertumbuh</option>
                            </select>
                        </div>

                        {formData.startupStatus === "bertumbuh" && (
                            <>
                                <div className="col-span-2 md:col-span-1 text-inherit animate-in fade-in duration-300">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Lama Waktu Usaha (Bulan)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            name="lama_waktu_usaha"
                                            value={formData.lama_waktu_usaha}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        />
                                        <span className="absolute right-4 top-2.5 text-gray-400 text-sm">Bulan</span>
                                    </div>
                                </div>
                                <div className="col-span-2 md:col-span-1 animate-in fade-in duration-300">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Omzet Penjualan Harian</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-2.5 text-gray-500 text-sm font-medium">Rp</span>
                                        <input
                                            type="number"
                                            min="0"
                                            name="omzet"
                                            value={formData.omzet}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Social Media Inputs */}
                        <div className="col-span-2 border-t border-gray-100 pt-4 mt-2">
                            <div className="flex items-center gap-2 mb-4">
                                <Share2 className="w-4 h-4 text-indigo-500" />
                                <label className="text-sm font-medium text-gray-700">Akun Media Sosial (Opsional)</label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-gray-400 text-xs font-bold">IG</span>
                                        <input
                                            type="text"
                                            name="social_ig"
                                            value={formData.social_ig}
                                            onChange={handleInputChange}
                                            placeholder="@username"
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-gray-400 text-xs font-bold">TT</span>
                                        <input
                                            type="text"
                                            name="social_tiktok"
                                            value={formData.social_tiktok}
                                            onChange={handleInputChange}
                                            placeholder="@username"
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Anggota Tim */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Anggota Tim</h2>
                                <p className="text-sm text-gray-500">Daftar anggota tim (Opsional)</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="space-y-4">
                            {members.map((member, index) => (
                                <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg border border-gray-100 relative group">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Nama Anggota</label>
                                            <input
                                                type="text"
                                                value={member.name}
                                                onChange={(e) => {
                                                    const newMembers = [...members];
                                                    newMembers[index].name = e.target.value;
                                                    setMembers(newMembers);
                                                }}
                                                placeholder="Nama lengkap"
                                                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">NIM / NIDN</label>
                                            <input
                                                type="text"
                                                value={member.nim}
                                                onChange={(e) => {
                                                    const newMembers = [...members];
                                                    newMembers[index].nim = e.target.value;
                                                    setMembers(newMembers);
                                                }}
                                                placeholder="Nomor identitas"
                                                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    {members.length > 1 && (
                                        <button 
                                            type="button"
                                            onClick={() => removeMember(index)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors mt-6"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        <button
                            type="button"
                            onClick={addMember}
                            className="mt-4 flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors w-fit"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Anggota
                        </button>
                    </div>
                </section>

                {/* Section 4: Dokumen & Berkas */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                        <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Dokumen Pendukung</h2>
                            <p className="text-sm text-gray-500">Upload berkas keperluan administrasi (Opsional untuk tahap ini)</p>
                        </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {/* File Inputs */}
                         {[
                            { label: "Logo Startup", desc: "JPG/PNG, Maks 2MB", id: "logo" },
                            { label: "Sertifikat NIB", desc: "PDF/JPG/PNG, Maks 5MB", id: "sertifikat_nib" },
                            { label: "Proposal Bisnis", desc: "PDF/DOC, Maks 10MB", id: "proposal" },
                            { label: "Business Model Canvas", desc: "PDF/JPG, Maks 5MB", id: "bmc" },
                            { label: "Rencana Anggaran (RAB)", desc: "PDF/Excel, Maks 5MB", id: "rab" },
                            { label: "Laporan Keuangan", desc: "PDF/Excel, Maks 10MB", id: "laporan_keuangan" },
                         ].map((file) => (
                             <div key={file.id} className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center text-center transition-colors group cursor-pointer ${files[file.id] ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-400 hover:bg-teal-50/10'}`}>
                                 <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${files[file.id] ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-400 group-hover:bg-teal-100 group-hover:text-teal-600'}`}>
                                     {files[file.id] ? <Check className="w-6 h-6"/> : <Upload className="w-6 h-6" />}
                                 </div>
                                 <h3 className="text-sm font-medium text-gray-900 mb-1">{file.label}</h3>
                                 <p className="text-xs text-gray-500 mb-3">{files[file.id] ? files[file.id]?.name : file.desc}</p>
                                 <label htmlFor={file.id} className="text-xs font-semibold text-teal-600 cursor-pointer hover:underline stretched-link">
                                     {files[file.id] ? 'Ganti File' : 'Pilih File'}
                                 </label>
                                 <input 
                                    type="file" 
                                    id={file.id} 
                                    className="hidden" 
                                    onChange={(e) => handleFileChange(e, file.id)}
                                />
                             </div>
                         ))}
                    </div>
                     <div className="px-6 pb-6">
                         <label className="block text-sm font-medium text-gray-700 mb-2">Foto Produk (Multiple)</label>
                         <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center text-center hover:border-teal-400 hover:bg-teal-50/10 transition-colors group cursor-pointer w-full">
                             <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-teal-100 transition-colors">
                                 <Plus className="w-6 h-6 text-gray-400 group-hover:text-teal-600" />
                             </div>
                             <p className="text-sm text-gray-600">
                                 <span className="font-semibold text-teal-600">Klik untuk upload</span> atau drag and drop
                             </p>
                             <p className="text-xs text-gray-500 mt-1">JPG/PNG, Maks 5MB per file</p>
                             <input type="file" multiple className="hidden" onChange={handleProductPhotosChange} />
                         </div>
                         {productPhotos.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {productPhotos.map((photo, idx) => (
                                    <div key={idx} className="px-3 py-1 bg-teal-50 text-teal-700 text-xs rounded-full border border-teal-100 flex items-center gap-1">
                                        <FileText className="w-3 h-3"/>
                                        {photo.name}
                                    </div>
                                ))}
                            </div>
                         )}
                     </div>
                </section>

                <div className="flex items-center justify-end gap-4 pt-6">
                    <button
                        type="button"
                        onClick={saveDraft}
                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                        disabled={isLoading}
                    >
                        <Save className="w-4 h-4" />
                        Simpan Draft
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Mengirim...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Kirim Registrasi
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
