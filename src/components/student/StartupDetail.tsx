import { Button, Card, Badge } from "../SharedUI";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { type Startup, StartupStatus } from "../../types";

interface StartupDetailProps {
  startup: Startup;
  onBack: () => void;
}

export function StartupDetail({ startup, onBack }: StartupDetailProps) {
  return (
    <div className="space-y-6">
      <Button variant="secondary" onClick={onBack}>
        <ArrowLeft size={16} /> Kembali ke Daftar
      </Button>

      <Card>
        <div className="flex justify-between items-start   pb-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {startup.businessName}
            </h2>
            <p className="text-slate-500">{startup.category}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge status={startup.status} />
            <span className="text-xs text-slate-400">
              Diajukan:{" "}
              {new Date(startup.submissionDate || "").toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900   pb-1 mb-2">
                Identitas Tim
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ketua Tim</span>
                  <span className="font-medium">{startup.teamLeader}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fakultas/Prodi</span>
                  <span className="font-medium">{startup.faculty}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">
                    Anggota Tim:
                  </span>
                  <ul className="list-disc list-inside pl-2 text-slate-700">
                    {startup.teamMembers.length > 0 ? (
                      startup.teamMembers.map((m, i) => <li key={i}>{m}</li>)
                    ) : (
                      <li className="text-slate-400 italic">
                        Tidak ada anggota
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900   pb-1 mb-2">
                Detail Usaha
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <span className="font-medium">
                    {startup.isGrowing ? "Bertumbuh" : "Merintis (Baru)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tipe Alamat</span>
                  <span className="font-medium">{startup.addressType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Alamat</span>
                  <span className="font-medium text-right">
                    {startup.addressDetails}
                  </span>
                </div>
                {startup.isGrowing && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Lama Usaha</span>
                      <span className="font-medium">
                        {startup.businessDuration}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Omzet Harian</span>
                      <span className="font-medium">
                        Rp {startup.dailyRevenue?.toLocaleString()}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Dokumen Pendukung
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(startup.documents).map(([key, isUploaded]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-2 bg-slate-50 rounded"
                  >
                    <span className="text-sm capitalize text-slate-700">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    {isUploaded ? (
                      <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                        <CheckCircle size={14} /> Uploaded
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <XCircle size={14} /> -
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback Section */}
            {startup.status === StartupStatus.REJECTED && (
              <div className="bg-red-50 border-red-100 rounded-lg p-4">
                <h3 className="font-bold text-red-800 mb-1">
                  Catatan Revisi Admin
                </h3>
                <p className="text-sm text-red-700">
                  {startup.adminFeedback || "Tidak ada catatan."}
                </p>
              </div>
            )}

            {/* Scoring Section */}
            {startup.status === StartupStatus.GRADED && startup.scores && (
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-green-800">Hasil Penilaian</h3>
                  <span className="text-2xl font-bold text-green-700">
                    {startup.totalScore?.toFixed(2)}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-green-800">
                  {Object.entries(startup.scores).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between   border-green-200/50 pb-1"
                    >
                      <span className="capitalize">
                        {k.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
