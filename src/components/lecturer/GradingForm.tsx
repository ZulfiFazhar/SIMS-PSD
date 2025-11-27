import { useState } from "react";
import { Badge, Button, Card, Input } from "../SharedUI";
import { ClipboardList, Save } from "lucide-react";
import { type Startup, type ScoringCriteria, StartupStatus } from "../../types";
import { storageService } from "../../services/storageService";

interface GradingFormProps {
  startup: Startup;
  onBack: () => void;
  onSuccess: () => void;
}

const WEIGHTS: ScoringCriteria = {
  background: 5,
  noblePurpose: 10,
  potentialConsumer: 10,
  innovativeProduct: 25,
  marketingStrategy: 15,
  resources: 15,
  financialReport: 10,
  rab: 10,
};

export function GradingForm({ startup, onBack, onSuccess }: GradingFormProps) {
  const [scores, setScores] = useState<ScoringCriteria>(
    startup.scores || {
      background: 0,
      noblePurpose: 0,
      potentialConsumer: 0,
      innovativeProduct: 0,
      marketingStrategy: 0,
      resources: 0,
      financialReport: 0,
      rab: 0,
    }
  );

  const handleScoreChange = (key: keyof ScoringCriteria, val: string) => {
    let numVal = Number(val);
    if (numVal > 100) numVal = 100;
    if (numVal < 0) numVal = 0;
    setScores((prev) => ({ ...prev, [key]: numVal }));
  };

  const calculateTotal = () => {
    let total = 0;
    (Object.keys(WEIGHTS) as Array<keyof ScoringCriteria>).forEach((key) => {
      total += (scores[key] * WEIGHTS[key]) / 100;
    });
    return total;
  };

  const handleSubmitScore = () => {
    const finalScore = calculateTotal();
    const updated: Startup = {
      ...startup,
      scores: scores,
      totalScore: finalScore,
      status: StartupStatus.GRADED,
    };

    storageService.saveStartup(updated);
    alert(`Nilai tersimpan! Total Skor: ${finalScore.toFixed(2)}`);
    onSuccess();
  };

  const totalScore = calculateTotal();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <Button variant="secondary" onClick={onBack}>
          &larr; Kembali
        </Button>
        <Card>
          <h3 className="text-xl font-bold mb-2">{startup.businessName}</h3>
          <Badge status={startup.status} />
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>
              <strong>Ketua:</strong> {startup.teamLeader}
            </p>
            <p>
              <strong>Kategori:</strong> {startup.category}
            </p>
            <p>
              <strong>Jadwal:</strong> {startup.curationDate}
            </p>
            <p>
              <strong>Dokumen:</strong> {Object.keys(startup.documents).length}{" "}
              file dilampirkan
            </p>
          </div>
        </Card>

        <div className="bg-blue-600 text-white p-6 rounded-xl text-center">
          <h4 className="text-sm uppercase opacity-80 font-bold tracking-wider mb-2">
            Total Skor
          </h4>
          <div className="text-5xl font-bold">{totalScore.toFixed(1)}</div>
          <div className="text-xs mt-2 opacity-75">dari 100</div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <Card>
          <h3 className="text-lg font-bold border-b pb-4 mb-4 flex items-center gap-2">
            <ClipboardList className="text-blue-600" /> Form Penilaian
          </h3>
          <div className="space-y-4">
            {(Object.keys(WEIGHTS) as Array<keyof ScoringCriteria>).map(
              (key) => (
                <div key={key} className="grid grid-cols-3 gap-4 items-center">
                  <div className="col-span-2">
                    <label className="block font-medium text-slate-700 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <span className="text-xs text-slate-400">
                      Bobot: {WEIGHTS[key]}%
                    </span>
                  </div>
                  <div className="col-span-1">
                    <Input
                      label=""
                      type="number"
                      max={100}
                      min={0}
                      value={scores[key]}
                      onChange={(e) => handleScoreChange(key, e.target.value)}
                      placeholder="0-100"
                    />
                  </div>
                </div>
              )
            )}
          </div>
          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleSubmitScore}
              variant="primary"
              className="w-full md:w-auto"
            >
              <Save size={18} /> Simpan Penilaian
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
