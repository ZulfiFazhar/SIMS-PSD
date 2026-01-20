import { X, FileText, Image, Download, ExternalLink } from "lucide-react";
import type { TenantRegistration } from "../../types";

interface FilePreviewModalProps {
    tenant: TenantRegistration;
    onClose: () => void;
}

interface FileItem {
    name: string;
    type: 'document' | 'image';
    url?: string;
    icon: React.ReactNode;
}

export function FilePreviewModal({ tenant, onClose }: FilePreviewModalProps) {
    const files: FileItem[] = [];
    const docs = tenant.business_documents;

    // Build file list from business_documents
    if (docs?.logo_url) {
        files.push({
            name: "Logo Bisnis",
            type: 'image',
            url: docs.logo_url,
            icon: <Image className="w-5 h-5" />
        });
    }
    if (docs?.proposal_url) {
        files.push({
            name: "Proposal Bisnis",
            type: 'document',
            url: docs.proposal_url,
            icon: <FileText className="w-5 h-5" />
        });
    }
    if (docs?.bmc_url) {
        files.push({
            name: "Business Model Canvas (BMC)",
            type: 'document',
            url: docs.bmc_url,
            icon: <FileText className="w-5 h-5" />
        });
    }
    if (docs?.sertifikat_nib_url) {
        files.push({
            name: "Nomor Induk Berusaha (NIB)",
            type: 'document',
            url: docs.sertifikat_nib_url,
            icon: <FileText className="w-5 h-5" />
        });
    }
    if (docs?.laporan_keuangan_url) {
        files.push({
            name: "Laporan Keuangan",
            type: 'document',
            url: docs.laporan_keuangan_url,
            icon: <FileText className="w-5 h-5" />
        });
    }
    if (docs?.rab_url) {
        files.push({
            name: "Rencana Anggaran Biaya (RAB)",
            type: 'document',
            url: docs.rab_url,
            icon: <FileText className="w-5 h-5" />
        });
    }

    // Parse foto_produk_urls from JSON string
    if (docs?.foto_produk_urls) {
        try {
            const productPhotos = JSON.parse(docs.foto_produk_urls);
            if (Array.isArray(productPhotos) && productPhotos.length > 0) {
                productPhotos.forEach((photo, index) => {
                    files.push({
                        name: `Foto Produk ${index + 1}`,
                        type: 'image',
                        url: photo,
                        icon: <Image className="w-5 h-5" />
                    });
                });
            }
        } catch (err) {
            console.error('Failed to parse foto_produk_urls:', err);
        }
    }

    const handleOpenFile = (url?: string) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-gray-900/35 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-xl">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Dokumen Pendaftaran</h3>
                        <p className="text-sm text-gray-600 mt-1">{tenant.nama_bisnis}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body - File List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {files.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Tidak ada file yang diupload</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="group flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                                    onClick={() => handleOpenFile(file.url)}
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`p-2 rounded-lg ${file.type === 'image'
                                            ? 'bg-purple-100 text-purple-600'
                                            : 'bg-blue-100 text-blue-600'
                                            } group-hover:scale-110 transition-transform`}>
                                            {file.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700">
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {file.type === 'image' ? 'Gambar' : 'Dokumen'}
                                                {file.url && (
                                                    <span className="ml-2 text-blue-600 group-hover:underline">
                                                        Klik untuk preview
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {file.url ? (
                                            <>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenFile(file.url);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Preview di tab baru"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Placeholder for download
                                                        alert('Download functionality - to be implemented');
                                                    }}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Download"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Tidak tersedia</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Total: <span className="font-semibold text-gray-900">{files.length}</span> file
                        </p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
