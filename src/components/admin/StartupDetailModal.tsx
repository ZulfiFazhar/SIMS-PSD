import { useState } from "react";
import { Button, Input, Select } from "../SharedUI";
import { type Startup, type User, StartupStatus } from "../../types";
import { storageService } from "../../services/storageService";

interface StartupDetailModalProps {
  startup: Startup;
  tenants: User[];
  onClose: () => void;
  onUpdate: () => void;
}

export function StartupDetailModal({
  startup,
  tenants,
  onClose,
  onUpdate,
}: StartupDetailModalProps) {
  const [verifyAction, setVerifyAction] = useState<"approve" | "reject" | null>(
    null
  );
  const [feedback, setFeedback] = useState("");
  const [assignedTenant, setAssignedTenant] = useState("");
  const [curationDate, setCurationDate] = useState("");

  const handleVerify = () => {
    if (verifyAction === "reject") {
      const updated: Startup = {
        ...startup,
        status: StartupStatus.REJECTED,
        adminFeedback: feedback,
      };
      storageService.saveStartup(updated);
    } else {
      const updated: Startup = {
        ...startup,
        status: StartupStatus.VERIFIED,
        assignedTenantId: assignedTenant,
        curationDate: curationDate,
      };
      storageService.saveStartup(updated);
    }
    onUpdate();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
          <h3 className="text-xl font-bold">{startup.businessName}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Ketua Tim</p>
              <p className="font-medium">{startup.teamLeader}</p>
            </div>
            <div>
              <p className="text-slate-500">Fakultas</p>
              <p className="font-medium">{startup.faculty}</p>
            </div>
            <div>
              <p className="text-slate-500">Tipe Alamat</p>
              <p className="font-medium">{startup.addressType}</p>
            </div>
            <div>
              <p className="text-slate-500">Status Usaha</p>
              <p className="font-medium">
                {startup.isGrowing ? "Bertumbuh" : "Baru"}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-bold text-sm mb-2">Kelengkapan Dokumen</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(startup.documents)
                .filter(([, v]) => v)
                .map(([k]) => (
                  <span
                    key={k}
                    className="px-2 py-1 bg-white border rounded text-xs text-slate-600 capitalize"
                  >
                    {k.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                ))}
            </div>
          </div>

          {startup.status === StartupStatus.SUBMITTED && !verifyAction && (
            <div className="flex gap-4 pt-4 border-t">
              <Button
                onClick={() => setVerifyAction("approve")}
                variant="success"
                className="flex-1"
              >
                Verifikasi Lulus
              </Button>
              <Button
                onClick={() => setVerifyAction("reject")}
                variant="danger"
                className="flex-1"
              >
                Tolak / Revisi
              </Button>
            </div>
          )}

          {verifyAction === "reject" && (
            <div className="pt-4 border-t space-y-4">
              <Input
                label="Catatan Revisi"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Alasan penolakan..."
              />
              <Button
                onClick={handleVerify}
                variant="danger"
                className="w-full"
              >
                Kirim Revisi
              </Button>
            </div>
          )}

          {verifyAction === "approve" && (
            <div className="pt-4 border-t space-y-4">
              <Select
                label="Pilih Pengguna Kurator"
                options={tenants.map((t) => t.name)}
                value={
                  tenants.find((t) => t.id === assignedTenant)?.name || ""
                }
                onChange={(e) => {
                  const t = tenants.find(
                    (user) => user.name === e.target.value
                  );
                  setAssignedTenant(t?.id || "");
                }}
              />
              <Input
                label="Jadwal Kurasi"
                type="date"
                value={curationDate}
                onChange={(e) => setCurationDate(e.target.value)}
              />
              <Button
                onClick={handleVerify}
                variant="success"
                className="w-full"
                disabled={!assignedTenant || !curationDate}
              >
                Simpan & Tugaskan
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
