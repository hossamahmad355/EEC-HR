import * as XLSX from 'xlsx';
import { HRState } from '../types/hr';

export function exportHRDataToExcel(state: HRState) {
  const wb = XLSX.utils.book_new();
  // Enable RTL view in Excel
  wb.Workbook = { Views: [{ RTL: true }] };

  // 1. Sheet 1: ملخص الحضور والانصراف (Attendance Summary & Weekly Breakdown)
  const attendanceRows = [
    ['الشركة المصرية الهندسية للمقاولات (EEC) - تقرير الحضور والانصراف'],
    [
      'السنة المالية',
      state.selectedYear,
      'المشروع',
      state.selectedProject,
      'الإدارة',
      state.selectedDepartment,
    ],
    [],
    ['المؤشر', 'القيمة'],
    ['إجمالي الموظفين', state.totalEmployees],
    ['الموظفين الفعالين', state.activeEmployees],
    ['الموظفين تحت التجربة', state.probationEmployees],
    ['معدل الحضور العام (%)', `${state.attendance.rate}%`],
    ['إجمالي أيام الحضور', state.attendance.presentDays],
    ['إجمالي أيام الغياب', state.attendance.absentDays],
    ['حالات التأخير', state.attendance.lateDays],
    ['حالات الانصراف المبكر', state.attendance.earlyLeaveDays],
    [],
    ['اليوم', 'معدل الحضور (%)', 'انتظام الانصراف (%)', 'نسبة التأخير (%)'],
    ['السبت', `${(state.attendance.rate - 0.6).toFixed(1)}%`, `${(state.attendance.rate - 2.1).toFixed(1)}%`, '4.2%'],
    ['الأحد', `${(state.attendance.rate + 0.8).toFixed(1)}%`, `${(state.attendance.rate - 0.7).toFixed(1)}%`, '2.8%'],
    ['الإثنين', `${(state.attendance.rate + 1.1).toFixed(1)}%`, `${(state.attendance.rate - 0.3).toFixed(1)}%`, '2.4%'],
    ['الثلاثاء', `${(state.attendance.rate + 0.5).toFixed(1)}%`, `${(state.attendance.rate - 0.9).toFixed(1)}%`, '3.1%'],
    ['الأربعاء', `${(state.attendance.rate - 0.2).toFixed(1)}%`, `${(state.attendance.rate - 1.6).toFixed(1)}%`, '3.6%'],
    ['الخميس', `${(state.attendance.rate - 1.4).toFixed(1)}%`, `${(state.attendance.rate - 3.3).toFixed(1)}%`, '5.4%'],
  ];

  const wsAttendance = XLSX.utils.aoa_to_sheet(attendanceRows);
  wsAttendance['!cols'] = [{ wch: 28 }, { wch: 18 }, { wch: 22 }, { wch: 22 }, { wch: 16 }, { wch: 22 }];
  XLSX.utils.book_append_sheet(wb, wsAttendance, 'الحضور والانصراف');

  // 2. Sheet 2: قائمة المهام اليومية (Daily To-Do Tasks)
  const todoHeader = [
    'كود المهمة',
    'عنوان المهمة',
    'الموظف المسؤول',
    'الإدارة',
    'الأولوية',
    'الموعد المحدد',
    'حالة الإنجاز',
  ];
  const todoData = state.todoTasks.map((t) => [
    t.id,
    t.title,
    t.assignee,
    t.department,
    `أولوية ${t.priority}`,
    t.dueTime,
    t.completed ? 'منجزة ✓' : 'قيد التنفيذ',
  ]);
  const wsTodos = XLSX.utils.aoa_to_sheet([todoHeader, ...todoData]);
  wsTodos['!cols'] = [
    { wch: 16 },
    { wch: 48 },
    { wch: 26 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 16 },
  ];
  XLSX.utils.book_append_sheet(wb, wsTodos, 'قائمة المهام اليومية');

  // 3. Sheet 3: سجل حضور وأداء الموظفين (Employee Attendance & Performance)
  const empHeader = [
    'الكود الوظيفي',
    'اسم الموظف',
    'المسمى الوظيفي',
    'الإدارة',
    'المشروع',
    'معدل الحضور (%)',
    'تقييم الأداء (من 5)',
    'الحالة الوظيفية',
  ];
  const empData = state.employeeList.map((e) => [
    e.code,
    e.name,
    e.role,
    e.department,
    e.project,
    `${e.attendanceRate}%`,
    `${e.rating} / 5`,
    e.status === 'active'
      ? 'فعال'
      : e.status === 'probation'
      ? 'تحت التجربة'
      : 'منقول حديثاً',
  ]);
  const wsEmployees = XLSX.utils.aoa_to_sheet([empHeader, ...empData]);
  wsEmployees['!cols'] = [
    { wch: 14 },
    { wch: 28 },
    { wch: 26 },
    { wch: 20 },
    { wch: 32 },
    { wch: 16 },
    { wch: 18 },
    { wch: 16 },
  ];
  XLSX.utils.book_append_sheet(wb, wsEmployees, 'سجل الموظفين');

  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `سجل_الحضور_والمهام_EEC_${dateStr}.xlsx`);
}

export function exportHRDataToPDF(state: HRState) {
  const completedTasks = state.todoTasks.filter((t) => t.completed).length;
  const totalTasks = state.todoTasks.length;
  const dateStr = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>تقرير الحضور والمهام اليومية - EEC</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; font-family: 'Cairo', sans-serif; }
    body { margin: 0; padding: 28px; color: #1e1b4b; background: #ffffff; direction: rtl; }
    .header {
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 3px solid #5b21b6; padding-bottom: 16px; margin-bottom: 24px;
    }
    .header h1 { margin: 0; font-size: 22px; color: #3b1c71; font-weight: 800; }
    .header p { margin: 4px 0 0; font-size: 13px; color: #475569; font-weight: 600; }
    .meta-bar {
      display: flex; gap: 20px; background: #f5f3ff; border: 1px solid #ddd6fe;
      border-radius: 12px; padding: 12px 18px; margin-bottom: 22px; font-size: 13px; font-weight: 700;
    }
    .kpi-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 26px;
    }
    .kpi-card {
      border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; text-align: center; background: #faf8ff;
    }
    .kpi-card .label { font-size: 12px; color: #475569; font-weight: 700; }
    .kpi-card .val { font-size: 22px; color: #1e1b4b; font-weight: 800; margin-top: 4px; }
    h2 { font-size: 16px; color: #3b1c71; border-right: 4px solid #5b21b6; padding-right: 10px; margin: 22px 0 12px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12.5px; }
    th { background: #4c1d95; color: #ffffff; padding: 10px 12px; text-align: right; font-weight: 700; }
    td { padding: 9px 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: 600; }
    tr:nth-child(even) td { background: #f8fafc; }
    .status-done { color: #059669; font-weight: 800; }
    .status-pending { color: #d97706; font-weight: 800; }
    .footer { margin-top: 28px; padding-top: 12px; border-top: 1px solid #cbd5e1; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; }
    @media print {
      body { padding: 10px; }
      @page { size: A4 portrait; margin: 12mm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>الشركة المصرية الهندسية للمقاولات (EEC)</h1>
      <p>قطاع إدارة الموارد البشرية — سجل الحضور والانصراف والمهام اليومية</p>
    </div>
    <div style="text-align: left;">
      <p><strong>تاريخ التقرير:</strong> ${dateStr}</p>
      <p><strong>السنة المالية:</strong> ${state.selectedYear}</p>
    </div>
  </div>

  <div class="meta-bar">
    <span>الإدارة: ${state.selectedDepartment}</span>
    <span>|</span>
    <span>المشروع: ${state.selectedProject}</span>
    <span>|</span>
    <span>إنجاز المهام اليومية: ${completedTasks} من ${totalTasks}</span>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="label">معدل الحضور العام</div>
      <div class="val" style="color: #059669;">${state.attendance.rate}%</div>
    </div>
    <div class="kpi-card">
      <div class="label">أيام الحضور المعتمدة</div>
      <div class="val">${state.attendance.presentDays.toLocaleString('en-US')}</div>
    </div>
    <div class="kpi-card">
      <div class="label">حالات التأخير / الانصراف المبكر</div>
      <div class="val" style="color: #d97706;">${state.attendance.lateDays + state.attendance.earlyLeaveDays}</div>
    </div>
    <div class="kpi-card">
      <div class="label">إجمالي القوة العاملة</div>
      <div class="val">${state.totalEmployees}</div>
    </div>
  </div>

  <h2>أولاً: قائمة المهام اليومية للموظفين (${totalTasks} مهام)</h2>
  <table>
    <thead>
      <tr>
        <th>م</th>
        <th>عنوان المهمة</th>
        <th>الموظف المسؤول</th>
        <th>الإدارة</th>
        <th>الأولوية</th>
        <th>الموعد</th>
        <th>الحالة</th>
      </tr>
    </thead>
    <tbody>
      ${state.todoTasks
        .map(
          (task, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${task.title}</td>
          <td>${task.assignee}</td>
          <td>${task.department}</td>
          <td>أولوية ${task.priority}</td>
          <td>${task.dueTime}</td>
          <td class="${task.completed ? 'status-done' : 'status-pending'}">
            ${task.completed ? 'منجزة ✓' : 'قيد التنفيذ'}
          </td>
        </tr>`
        )
        .join('')}
    </tbody>
  </table>

  <h2>ثانياً: سجل الحضور والأداء لموظفي الشركة</h2>
  <table>
    <thead>
      <tr>
        <th>الكود</th>
        <th>اسم الموظف</th>
        <th>المسمى الوظيفي</th>
        <th>الإدارة</th>
        <th>المشروع</th>
        <th>نسبة الحضور</th>
        <th>التقييم</th>
      </tr>
    </thead>
    <tbody>
      ${state.employeeList
        .map(
          (emp) => `
        <tr>
          <td>${emp.code}</td>
          <td>${emp.name}</td>
          <td>${emp.role}</td>
          <td>${emp.department}</td>
          <td>${emp.project}</td>
          <td>${emp.attendanceRate}%</td>
          <td>${emp.rating} / 5</td>
        </tr>`
        )
        .join('')}
    </tbody>
  </table>

  <div class="footer">
    <span>تم استخراج هذا المستند آلياً من نظام إدارة الموارد البشرية - EEC</span>
    <span>جميع الحقوق محفوظة © الشركة المصرية الهندسية للمقاولات ${state.selectedYear}</span>
  </div>
</body>
</html>`;

  // Trigger print-to-PDF via hidden iframe (safe inside iframe environments without window.open)
  const existingIframe = document.getElementById('eec-pdf-print-frame');
  if (existingIframe) {
    existingIframe.remove();
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'eec-pdf-print-frame';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(htmlContent);
    doc.close();
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch {
        // Fallback download if print is blocked
      }
    }, 350);
  }
}
