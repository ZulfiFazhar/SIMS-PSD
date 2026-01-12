import { useState, useEffect, useRef } from "react";
import { Upload, Plus, Trash2, Save, Send, User, Building2, Users, FileText, Share2, Loader2, Check, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { tenantService } from "../../services/tenantService";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { TenantRegistrationDetail, type TenantData } from "./TenantRegistrationDetail";

const FILE_SIZE_LIMITS = {
    logo: 2 * 1024 * 1024, // 2MB
    sertifikat_nib: 5 * 1024 * 1024, // 5MB
    proposal: 10 * 1024 * 1024, // 10MB
    bmc: 5 * 1024 * 1024, // 5MB
    rab: 5 * 1024 * 1024, // 5MB
    laporan_keuangan: 10 * 1024 * 1024, // 10MB
    foto_produk: 5 * 1024 * 1024, // 5MB per file
};

const BUSINESS_MAP: { [key: string]: string[] } = {
    "Food & Beverage (F&B)": ["Usaha Kuliner"],
    "Creative & Lifestyle": ["Usaha Fashion", "Usaha Kecantikan", "Usaha Produk Kreatif", "Usaha Kebutuhan Anak"],
    "Service & Hospitality": ["Usaha Otomotif", "Usaha Tour & Travel", "Usaha Event Organizer", "Usaha Jasa Kebersihan"],
    "Edu & Tech": ["Usaha Pendidikan", "Usaha Teknologi Internet"],
    "Agri & Environment": ["Usaha Agribisnis"]
};

export function TenantRegister() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
    const [registeredTenant, setRegisteredTenant] = useState<TenantData | null>(null);

    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const productPhotoInputRef = useRef<HTMLInputElement>(null);

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

    // Check for existing registration
    useEffect(() => {
        const checkRegistration = async () => {
            try {
                const idToken = await authService.getValidToken();
                const data = await tenantService.getTenantRegistration(idToken);
                if (data) {
                    setRegisteredTenant(data);
                }
            } catch (error) {
                console.error("Failed to check registration", error);
            } finally {
                setIsCheckingRegistration(false);
            }
        };
        checkRegistration();
    }, []);

    // Init Logic: Load Draft (only if not registered)
    useEffect(() => {
        if (registeredTenant) return;

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
    }, [registeredTenant]);

    // Save Draft Logic
    const saveDraft = () => {
        setSaveStatus("saving");
        const draftData = {
            formData,
            members,
        };
        localStorage.setItem("tenant_register_draft", JSON.stringify(draftData));
        setTimeout(() => setSaveStatus("saved"), 500);
        setTimeout(() => setSaveStatus("idle"), 2500); // Back to idle after showing 'saved' for ~2s
    };

    // Auto-save logic (debounce 2s)
    useEffect(() => {
        const timer = setTimeout(() => {
            saveDraft();
        }, 2000);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData, members]);

    // Pre-fill form data if status is 'rejected' (allow re-registration)
    useEffect(() => {
        if (registeredTenant && registeredTenant.status === 'rejected') {
            // Pre-fill form data from backend
            setFormData({
                nama_ketua_tim: registeredTenant.nama_ketua_tim || "",
                nim_nidn_ketua: registeredTenant.nim_nidn_ketua || "",
                nomor_telepon: registeredTenant.nomor_telepon || "",
                fakultas: registeredTenant.fakultas || "",
                prodi: registeredTenant.prodi || "",
                nama_bisnis: registeredTenant.nama_bisnis || "",
                kategori_bisnis: registeredTenant.kategori_bisnis || "",
                jenis_usaha: registeredTenant.jenis_usaha || "",
                alamat_usaha: registeredTenant.alamat_usaha || "",
                startupStatus: registeredTenant.lama_usaha > 0 ? "bertumbuh" : "startup_baru",
                lama_waktu_usaha: registeredTenant.lama_usaha || 0,
                omzet: registeredTenant.omzet || "0",
                social_ig: "",
                social_tiktok: "",
            });

            // Pre-fill members data
            try {
                const namaAnggota = JSON.parse(registeredTenant.nama_anggota_tim || "[]");
                const nimAnggota = JSON.parse(registeredTenant.nim_nidn_anggota || "[]");

                if (namaAnggota.length > 0) {
                    const membersData = namaAnggota.map((nama: string, idx: number) => ({
                        name: nama,
                        nim: nimAnggota[idx] || ""
                    }));
                    setMembers(membersData);
                } else {
                    setMembers([{ name: "", nim: "" }]);
                }
            } catch (e) {
                console.error("Failed to parse members data", e);
                setMembers([{ name: "", nim: "" }]);
            }

            // Pre-fill social media if available
            try {
                const socialMedia = JSON.parse(registeredTenant.business_documents?.akun_medsos || "{}");
                setFormData(prev => ({
                    ...prev,
                    social_ig: socialMedia.instagram || "",
                    social_tiktok: socialMedia.tiktok || ""
                }));
            } catch (e) {
                console.error("Failed to parse social media", e);
            }
        }
    }, [registeredTenant]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "kategori_bisnis") {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
                jenis_usaha: "" // Reset jenis usaha when category changes
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        // Clear validation error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validatePhoneNumber = (phone: string): boolean => {
        if (!phone) return true; // Don't show error if empty (handled by 'required')
        if (!phone.startsWith("08")) {
            setValidationErrors((prev) => ({ ...prev, nomor_telepon: "Nomor telepon harus diawali dengan '08'" }));
            return false;
        }
        if (phone.length < 10) {
            setValidationErrors((prev) => ({ ...prev, nomor_telepon: "Nomor telepon minimal berjumlah 10 digit" }));
            return false;
        }
        setValidationErrors((prev) => ({ ...prev, nomor_telepon: "" }));
        return true;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const maxSize = FILE_SIZE_LIMITS[key as keyof typeof FILE_SIZE_LIMITS];

            if (file.size > maxSize) {
                setValidationErrors((prev) => ({
                    ...prev,
                    [key]: `Ukuran file melebihi batas maksimal ${(maxSize / (1024 * 1024)).toFixed(0)}MB`
                }));
                e.target.value = "";
                return;
            }

            setValidationErrors((prev) => ({ ...prev, [key]: "" }));
            setFiles((prev) => ({ ...prev, [key]: file }));
        }
    };

    const handleProductPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const maxSize = FILE_SIZE_LIMITS.foto_produk;
            const validPhotos: File[] = [];
            const errors: string[] = [];

            Array.from(e.target.files).forEach((file) => {
                if (file.size > maxSize) {
                    errors.push(`${file.name} terlalu besar (max 5MB)`);
                } else {
                    validPhotos.push(file);
                }
            });

            if (errors.length > 0) {
                setValidationErrors((prev) => ({
                    ...prev,
                    foto_produk: errors.join(", ")
                }));
            } else {
                setValidationErrors((prev) => ({ ...prev, foto_produk: "" }));
            }

            if (validPhotos.length > 0) {
                setProductPhotos((prev) => [...prev, ...validPhotos]);
            }

            e.target.value = "";
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

        // Validate phone number
        if (!validatePhoneNumber(formData.nomor_telepon)) {
            setIsLoading(false);
            setError("Periksa kembali nomor telepon Anda");
            return;
        }

        try {
            const idToken = await authService.getValidToken();

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
            await tenantService.registerStartup(submissionData, idToken);

            // Clear Draft
            localStorage.removeItem("tenant_register_draft");

            // Redirect
            navigate("/tenant");

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Gagal mengirim pendaftaran";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    if (isCheckingRegistration) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">Memeriksa status pendaftaran...</p>
                </div>
            </div>
        );
    }


    // If registered and status is NOT 'rejected', show read-only detail
    if (registeredTenant && registeredTenant.status !== 'rejected') {
        return <TenantRegistrationDetail data={registeredTenant} />;
    }

    return (
        <div className="p-6 max-w-full mx-auto pb-20 relative">
            {/* Pop-up Notification for Draft */}
            {saveStatus !== "idle" && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-300">
                    <div className={`px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border transition-all ${saveStatus === "saving"
                        ? "bg-white border-gray-200 text-gray-600"
                        : "bg-blue-600 border-blue-500 text-white"
                        }`}>
                        {saveStatus === "saving" ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                <span className="text-sm font-medium">Menyimpan draft...</span>
                            </>
                        ) : (
                            <>
                                <div className="bg-white/20 p-1 rounded-full text-white">
                                    <Check className="w-3 h-3" />
                                </div>
                                <span className="text-sm font-medium">Draft berhasil tersimpan!</span>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Registrasi Startup</h1>
                    <p className="text-gray-500 mt-1">Lengkapi data di bawah ini untuk mendaftarkan startup Anda.</p>
                </div>
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
                                onBlur={(e) => validatePhoneNumber(e.target.value)}
                                placeholder="Contoh: 081234567890"
                                className={`w-full px-4 py-2 rounded-lg border ${validationErrors.nomor_telepon ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                            />
                            <p className="mt-1 text-[11px] text-gray-400">Harus diawali 08 dan minimal 10 digit</p>
                            {validationErrors.nomor_telepon && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {validationErrors.nomor_telepon}
                                </p>
                            )}
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
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
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
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Bisnis</label>
                            <select
                                required
                                name="kategori_bisnis"
                                value={formData.kategori_bisnis}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                            >
                                <option value="">Pilih Kategori</option>
                                {Object.keys(BUSINESS_MAP).map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Usaha</label>
                            <select
                                required
                                name="jenis_usaha"
                                value={formData.jenis_usaha}
                                onChange={handleInputChange}
                                disabled={!formData.kategori_bisnis}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white disabled:bg-gray-50 disabled:text-gray-400"
                            >
                                <option value="">Pilih Jenis</option>
                                {formData.kategori_bisnis && BUSINESS_MAP[formData.kategori_bisnis]?.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
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
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Lama Usaha</label>
                            <select
                                name="startupStatus"
                                value={formData.startupStatus}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
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
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Social Media Inputs */}
                        <div className="col-span-2 border-t border-gray-100 pt-4 mt-2">
                            <div className="flex items-center gap-2 mb-4">
                                <Share2 className="w-4 h-4 text-blue-500" />
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
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
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
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
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
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
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
                                                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                                                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                            className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors w-fit"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Anggota
                        </button>
                    </div>
                </section>

                {/* Section 4: Dokumen & Berkas */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Dokumen Pendukung</h2>
                            <p className="text-sm text-gray-500">Upload berkas keperluan administrasi (Opsional untuk tahap ini)</p>
                        </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { label: "Logo Startup", desc: "JPG/PNG, Maks 2MB", id: "logo" },
                            { label: "Sertifikat NIB", desc: "PDF/JPG/PNG, Maks 5MB", id: "sertifikat_nib" },
                            { label: "Proposal Bisnis", desc: "PDF/DOC, Maks 10MB", id: "proposal" },
                            { label: "Business Model Canvas", desc: "PDF/JPG, Maks 5MB", id: "bmc" },
                            { label: "Rencana Anggaran (RAB)", desc: "PDF/Excel, Maks 5MB", id: "rab" },
                            { label: "Laporan Keuangan", desc: "PDF/Excel, Maks 10MB", id: "laporan_keuangan" },
                        ].map((file) => (
                            <label
                                key={file.id}
                                htmlFor={file.id}
                                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center text-center transition-colors cursor-pointer ${files[file.id]
                                    ? 'border-blue-500 bg-blue-50'
                                    : validationErrors[file.id]
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/10'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${files[file.id]
                                    ? 'bg-blue-100 text-blue-600'
                                    : validationErrors[file.id]
                                        ? 'bg-red-100 text-red-600'
                                        : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                                    }`}>
                                    {files[file.id] ? (
                                        <Check className="w-6 h-6" />
                                    ) : validationErrors[file.id] ? (
                                        <AlertCircle className="w-6 h-6" />
                                    ) : (
                                        <Upload className="w-6 h-6" />
                                    )}
                                </div>
                                <h3 className="text-sm font-medium text-gray-900 mb-1">{file.label}</h3>
                                {validationErrors[file.id] ? (
                                    <p className="text-xs text-red-600 mb-3">{validationErrors[file.id]}</p>
                                ) : (
                                    <p className="text-xs text-gray-500 mb-3">
                                        {files[file.id] ? files[file.id]?.name : file.desc}
                                    </p>
                                )}
                                <span className="text-xs font-semibold text-blue-600 hover:underline">
                                    {files[file.id] ? 'Ganti File' : 'Pilih File'}
                                </span>
                                <input
                                    type="file"
                                    id={file.id}
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, file.id)}
                                />
                            </label>
                        ))}
                    </div>
                    <div className="px-6 pb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Foto Produk (Multiple)</label>
                        <label
                            htmlFor="foto_produk_input"
                            className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center text-center hover:border-blue-400 hover:bg-blue-50/10 transition-colors cursor-pointer w-full"
                        >
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                                <Plus className="w-6 h-6 text-gray-400 group-hover:text-blue-600" />
                            </div>
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold text-blue-600">Klik untuk upload</span> atau drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">JPG/PNG, Maks 5MB per file</p>
                            <input
                                type="file"
                                id="foto_produk_input"
                                ref={productPhotoInputRef}
                                multiple
                                accept="image/jpeg,image/png"
                                className="hidden"
                                onChange={handleProductPhotosChange}
                            />
                        </label>
                        {validationErrors.foto_produk && (
                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {validationErrors.foto_produk}
                            </p>
                        )}
                        {productPhotos.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {productPhotos.map((photo, idx) => (
                                    <div key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100 flex items-center gap-1">
                                        <FileText className="w-3 h-3" />
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
                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 active:bg-blue-100 transition-all flex items-center gap-2 shadow-sm mb-1"
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
