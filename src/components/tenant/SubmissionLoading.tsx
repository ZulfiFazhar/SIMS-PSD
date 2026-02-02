import { Loader2, Upload, FileCheck } from "lucide-react";
import type { ReactNode } from "react";

interface SubmissionLoadingProps {
    stage: "uploading" | "complete";
    progress: number;
}

export function SubmissionLoading({ stage, progress }: SubmissionLoadingProps) {
    const getStageInfo = (): { icon: ReactNode; title: string; description: string; color: string } => {
        switch (stage) {
            case "uploading":
                return {
                    icon: <Upload className="w-12 h-12" />,
                    title: "Mengupload File",
                    description: "Sedang mengupload dokumen pendaftaran...",
                    color: "text-blue-600"
                };
            case "complete":
                return {
                    icon: <FileCheck className="w-12 h-12" />,
                    title: "Selesai",
                    description: "Pendaftaran berhasil diproses!",
                    color: "text-green-600"
                };
            default:
                return {
                    icon: <Upload className="w-12 h-12" />,
                    title: "Memproses",
                    description: "Sedang memproses...",
                    color: "text-blue-600"
                };
        }
    };

    const stageInfo = getStageInfo();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                {/* Animated Icon */}
                <div className="flex justify-center mb-6">
                    <div className={`${stageInfo.color} animate-pulse`}>
                        {stageInfo.icon}
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                    {stageInfo.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 text-center mb-6">
                    {stageInfo.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-300 ${stage === "uploading" ? "bg-blue-600" :
                                "bg-green-600"
                                }`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Progress Percentage */}
                <p className="text-center text-sm font-medium text-gray-700">
                    {Math.round(progress)}%
                </p>

                {/* Loading Spinner */}
                {stage !== "complete" && (
                    <div className="flex justify-center mt-4">
                        <Loader2 className={`w-6 h-6 animate-spin ${stageInfo.color}`} />
                    </div>
                )}
            </div>
        </div>
    );
}
