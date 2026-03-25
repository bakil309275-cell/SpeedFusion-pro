Write-Host "--- جاري فحص SpeedFusion Pro (نسخة PWA) ---" -ForegroundColor Cyan
$report = @()

# فحص الملفات البرمجية
if (!(Test-Path "src/app/page.tsx")) { $report += "MISSING_PAGE" }
if (!(Test-Path "src/lib/optimizer.ts")) { $report += "MISSING_OPTIMIZER" }

# فحص ملفات الـ PWA والهوية
if (!(Test-Path "public/manifest.json")) { $report += "MISSING_MANIFEST" }
$layout = Get-Content "src/app/layout.tsx" -Raw
if ($layout -notmatch "manifest: '/manifest.json'") { $report += "MISSING_LAYOUT_LINK" }

# فحص سجل المكتبات
$pkg = Get-Content "package.json" -Raw
if ($pkg -notmatch "lucide-react") { $report += "MISSING_LUCIDE" }

if ($report.Count -eq 0) {
    Write-Host "[OK] مذهل! تم إنجاز هيكل التطبيق والـ PWA بنجاح 100%." -ForegroundColor Green
    Write-Host "التطبيق الآن جاهز للتثبيت كبرنامج فور التشغيل." -ForegroundColor Gray
} else {
    Write-Host "--- تم العثور على ملاحظات ---" -ForegroundColor Yellow
    foreach ($item in $report) {
        if ($item -eq "MISSING_PAGE") { Write-Host "[!] ملف الواجهة page.tsx مفقود" -ForegroundColor Red }
        if ($item -eq "MISSING_OPTIMIZER") { Write-Host "[!] ملف المحرك optimizer.ts مفقود" -ForegroundColor Red }
        if ($item -eq "MISSING_MANIFEST") { Write-Host "[!] ملف manifest.json غير موجود في public" -ForegroundColor Red }
        if ($item -eq "MISSING_LAYOUT_LINK") { Write-Host "[!] لم يتم ربط المانيفست في layout.tsx" -ForegroundColor Yellow }
        if ($item -eq "MISSING_LUCIDE") { Write-Host "[i] مكتبة الأيقونات غير مسجلة في package.json" -ForegroundColor Cyan }
    }
}
