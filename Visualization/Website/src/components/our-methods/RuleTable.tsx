import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

type RuleRow = {
  variable: string;
  pass: number;
  fail: number;
};

type RuleTableProps = {
  rows: RuleRow[];
};

export function RuleTable({ rows }: RuleTableProps) {
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <Table className="w-full rounded-lg border border-white/10 bg-white/[0.03] overflow-hidden">
          <TableHeader>
            <TableRow className="border-b border-white/10">
              <TableHead className="font-semibold text-slate-200 py-4 px-4">Variable</TableHead>
              <TableHead className="text-right font-semibold text-slate-200 py-4 px-4">Pass</TableHead>
              <TableHead className="text-right font-semibold text-slate-200 py-4 px-4">Fail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow 
                key={row.variable} 
                className={idx !== rows.length - 1 ? "border-b border-white/5" : ""}
              >
                <TableCell className="font-medium text-white py-4 px-4">{row.variable}</TableCell>
                <TableCell className="text-right font-semibold text-emerald-400 py-4 px-4">{row.pass}</TableCell>
                <TableCell className="text-right font-medium text-rose-400 py-4 px-4">{row.fail}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

