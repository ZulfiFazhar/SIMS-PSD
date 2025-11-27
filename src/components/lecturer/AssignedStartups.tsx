import { Badge, Button, Card } from "../SharedUI";
import { type Startup, StartupStatus } from "../../types";

interface AssignedStartupsProps {
  startups: Startup[];
  onSelect: (startup: Startup) => void;
}

export function AssignedStartups({
  startups,
  onSelect,
}: AssignedStartupsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard Penilaian</h2>
      {startups.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500">
            Belum ada jadwal kurasi / startup yang ditugaskan.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {startups.map((startup) => (
            <Card key={startup.id} className="flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <Badge status={startup.status} />
                  <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                    {startup.curationDate}
                  </span>
                </div>
                <h3 className="font-bold text-lg">{startup.businessName}</h3>
                <p className="text-sm text-slate-500 mb-4">
                  {startup.teamLeader}
                </p>
              </div>
              <Button
                onClick={() => onSelect(startup)}
                variant={
                  startup.status === StartupStatus.GRADED
                    ? "secondary"
                    : "primary"
                }
              >
                {startup.status === StartupStatus.GRADED
                  ? "Lihat / Edit Nilai"
                  : "Mulai Penilaian"}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
