<?php

namespace App\Services;

use App\Models\Student;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Builds the official transcript XLSX from the registrar template (staff/admin).
 */
class OfficialTranscriptExportService
{
    public function streamForStudent(Student $student): StreamedResponse
    {
        $student->loadMissing(['program', 'grades.subject']);

        $templatePath = public_path('assets/templates/OFFICIAL TRANSCRIPT OF RECORD - template.xlsx');
        $spreadsheet = IOFactory::load($templatePath);
        $sheet = $spreadsheet->getActiveSheet();

        $sheet->setCellValue('C10', Str::upper(trim(implode(', ', array_filter([
            $student->last_name,
            trim(implode(' ', array_filter([$student->first_name, $student->middle_name]))),
        ])))));
        $sheet->setCellValue('C11', Str::upper((string) ($student->address ?? '')));
        $sheet->setCellValue('C12', Str::upper((string) ($student->place_of_birth ?? '')));
        $sheet->setCellValue('C13', Str::upper((string) ($student->sex ?? '')));
        $sheet->setCellValue('C14', Str::upper($this->formatDateForTranscript($student->date_of_birth)));
        $sheet->setCellValue('C15', Str::upper((string) ($student->guardian_name ?? '')));
        $sheet->setCellValue('C16', Str::upper((string) ($student->citizenship ?? '')));
        $sheet->setCellValue('C18', Str::upper((string) ($student->elementary_school ?? '')));
        $sheet->setCellValue('J18', $student->elementary_year ?? null);
        $sheet->setCellValue('C19', Str::upper((string) ($student->high_school ?? '')));
        $sheet->setCellValue('J19', $student->high_school_year ?? null);
        $sheet->setCellValue('C20', Str::upper((string) ($student->previous_school ?? '')));
        $sheet->setCellValue('C21', Str::upper((string) ($student->previous_course ?? '')));

        $programName = Str::upper((string) ($student->program?->name ?? $student->program?->code ?? ''));
        if ($programName !== '') {
            $sheet->setCellValue('B68', $programName);
        } else {
            $sheet->setCellValue('B68', '');
        }
        $sheet->setCellValue('B69', Str::upper((string) ($student->previous_school ?? '')));
        $sheet->setCellValue('B70', Str::upper((string) ($student->place_of_birth ?? '')));

        for ($row = 75; $row <= 94; $row++) {
            $sheet->setCellValue("A{$row}", '');
            $sheet->setCellValue("B{$row}", '');
            $sheet->setCellValue("I{$row}", '');
            $sheet->setCellValue("J{$row}", '');
            $sheet->setCellValue("K{$row}", '');
        }

        $grades = $student->grades
            ->sortBy(function ($g) {
                return sprintf(
                    '%s-%02d-%s',
                    (string) $g->academic_year,
                    $this->semesterRank((string) $g->semester),
                    (string) ($g->subject?->code ?? '')
                );
            })
            ->values();

        $row = 75;
        foreach ($grades as $grade) {
            if ($row > 94) {
                break;
            }
            $sheet->setCellValue("A{$row}", Str::upper((string) ($grade->subject?->code ?? '')));
            $sheet->setCellValue("B{$row}", Str::upper((string) ($grade->subject?->title ?? '')));
            $sheet->setCellValue("I{$row}", $grade->grade_value ?? $grade->remarks ?? '');
            $sheet->setCellValue("K{$row}", $grade->subject?->units ?? '');
            $row++;
        }

        if ($row <= 94) {
            $sheet->setCellValue("B{$row}", 'xxx NOTHING FOLLOWS xxx');
        }

        $filename = sprintf(
            'OFFICIAL_TRANSCRIPT_OF_RECORD_%s_%s.xlsx',
            Str::upper((string) ($student->student_number ?? 'STUDENT')),
            now()->format('Ymd_His')
        );

        return response()->streamDownload(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    private function formatDateForTranscript(mixed $value): string
    {
        if (! $value) {
            return '';
        }
        try {
            return Carbon::parse($value)->format('F j, Y');
        } catch (\Throwable) {
            return (string) $value;
        }
    }

    private function semesterRank(string $semester): int
    {
        $normalized = Str::lower(trim($semester));
        return match (true) {
            str_contains($normalized, '1') || str_contains($normalized, 'first') => 1,
            str_contains($normalized, '2') || str_contains($normalized, 'second') => 2,
            str_contains($normalized, '3') || str_contains($normalized, 'third') => 3,
            default => 9,
        };
    }
}
