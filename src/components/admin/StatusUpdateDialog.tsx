import { useState } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import type { TenantRegistration, TenantRegistrationStatus } from "../../types";
import { TenantRegistrationStatus as StatusEnum } from "../../types";

interface StatusUpdateDialogProps {
    tenant: TenantRegistration;
    newStatus: TenantRegistrationStatus;
    onClose: () => void;
    onConfirm: (rejectionReason?: string) => void;
}

export function StatusUpdateDialog({ tenant, newStatus, onClose, onConfirm }: StatusUpdateDialogProps) {
    const [rejectionReason, setRejectionReason] = useState("");
    const [error, setError] = useState("");

    const handleConfirm = () => {
        // If rejecting, require rejection reason
        if (newStatus === StatusEnum.REJECTED) {
            if (!rejectionReason.trim()) {
                setError("Alasan penolakan wajib diisi");
                return;
            }
            if (rejectionReason.trim().length < 10) {
                setError("Alasan penolakan minimal 10 karakter");
                return;
            }
        }

        onConfirm(rejectionReason.trim() || undefined);
    };

    const isRejecting = newStatus === StatusEnum.REJECTED;
    const isApproving = newStatus === StatusEnum.APPROVED;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full">
                {/* Header */}
                <div className={`px-6 py-4 border-b border-gray-200 flex items-center justify-between ${isRejecting ? 'bg-red-50' : isApproving ? 'bg-green-50' : 'bg-gray-50'
                    }`}>
                    <div className="flex items-center gap-3">
                        {isRejecting ? (
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                            </div>
                        ) : isApproving ? (
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                        ) : null}
                        <h3 className="text-lg font-semibold text-gray-900">
                            {isRejecting ? 'Tolak Pendaftaran' : isApproving ? 'Setujui Pendaftaran' : 'Ubah Status'}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Tenant:</p>
                        <p className="text-base font-semibold text-gray-900">{tenant.nama_bisnis}</p>
                        <p className="text-sm text-gray-500">{tenant.nama_ketua_tim}</p>
                    </div>

                    {isApproving && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-green-800">
                                Apakah Anda yakin ingin <strong>menyetujui</strong> pendaftaran tenant ini?
                                Tenant akan mendapatkan notifikasi bahwa pendaftaran mereka telah disetujui.
                            </p>
                        </div>
                    )}

                    {isRejecting && (
                        <div>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                <p className="text-sm text-red-800">
                                    Anda akan <strong>menolak</strong> pendaftaran tenant ini.
                                    Mohon berikan alasan yang jelas agar tenant dapat memperbaiki.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alasan Penolakan <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => {
                                        setRejectionReason(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="Jelaskan mengapa pendaftaran ditolak dan apa yang perlu diperbaiki..."
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    rows={4}
                                />
                                {error && (
                                    <p className="mt-1 text-sm text-red-600">{error}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    {rejectionReason.length} karakter (minimal 10)
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${isRejecting
                                ? 'bg-red-600 hover:bg-red-700'
                                : isApproving
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isRejecting ? 'Tolak Pendaftaran' : isApproving ? 'Setujui Pendaftaran' : 'Konfirmasi'}
                    </button>
                </div>
            </div>
        </div>
    );
}
