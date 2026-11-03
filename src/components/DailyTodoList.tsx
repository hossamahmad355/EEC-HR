import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ListTodo,
  Plus,
  Check,
  Pencil,
  Trash2,
  X,
  Clock,
  UserCheck,
  CheckCheck,
  FileSpreadsheet,
  FileDown,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  addToast,
  addTodoTask,
  clearCompletedTodos,
  deleteTodoTask,
  editTodoTask,
  toggleTodoTask,
} from '../store/hrSlice';
import { DepartmentName, TaskPriority, TodoTask } from '../types/hr';
import { exportHRDataToExcel, exportHRDataToPDF } from '../utils/exportData';

export const DailyTodoList: React.FC = () => {
  const dispatch = useAppDispatch();
  const hr = useAppSelector((state) => state.hr);
  const { todoTasks, employeeList } = hr;

  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'completed'>('all');

  // New Task Form State
  const [newTitle, setNewTitle] = useState('');
  const [newAssignee, setNewAssignee] = useState(
    employeeList[0]?.name || 'م. أحمد محمود عبد الرحمن'
  );
  const [newPriority, setNewPriority] = useState<TaskPriority>('عالية');
  const [newDueTime, setNewDueTime] = useState('01:30 م');

  // Inline Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAssignee, setEditAssignee] = useState('');
  const [editPriority, setEditPriority] = useState<TaskPriority>('متوسطة');
  const [editDueTime, setEditDueTime] = useState('');

  const totalCount = todoTasks.length;
  const completedCount = todoTasks.filter((t) => t.completed).length;
  const completionPct =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTasks = todoTasks.filter((task) => {
    if (filterMode === 'active') return !task.completed;
    if (filterMode === 'completed') return task.completed;
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const matchedEmp = employeeList.find((emp) => emp.name === newAssignee);
    const dept: DepartmentName = matchedEmp?.department || 'إدارة المشاريع';

    dispatch(
      addTodoTask({
        title: newTitle.trim(),
        assignee: newAssignee,
        department: dept,
        priority: newPriority,
        dueTime: newDueTime,
      })
    );
    setNewTitle('');
  };

  const startEditing = (task: TodoTask) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditAssignee(task.assignee);
    setEditPriority(task.priority);
    setEditDueTime(task.dueTime);
  };

  const saveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    dispatch(
      editTodoTask({
        id,
        title: editTitle.trim(),
        assignee: editAssignee,
        priority: editPriority,
        dueTime: editDueTime,
      })
    );
    setEditingId(null);
  };

  const priorityColorText = (priority: TaskPriority) => {
    if (priority === 'عالية') return 'text-rose-600 dark:text-rose-400';
    if (priority === 'متوسطة') return 'text-amber-600 dark:text-amber-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  return (
    <div
      dir="rtl"
      className="bg-gradient-to-b from-white to-[#f6f3fd] dark:from-slate-900 dark:to-slate-900/90 rounded-2xl p-4 border border-purple-200/80 dark:border-purple-800/60 shadow-xs flex flex-col justify-between h-full text-right"
    >
      <div>
        {/* Card Header + Completion Progress */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-purple-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-[#5b21b6] dark:text-purple-300 flex items-center justify-center border border-purple-200/70 dark:border-purple-800/60">
              <ListTodo className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-[16.5px] font-extrabold text-[#1e1b4b] dark:text-white">
                قائمة المهام اليومية للموظفين
              </h3>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 tabular-nums">
                تم إنجاز {completedCount} من أصل {totalCount} مهام ({completionPct}%)
              </p>
            </div>
          </div>

          {/* Filter Segmented Control */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-purple-100/70 dark:bg-slate-800 border border-purple-200/70 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-colors cursor-pointer whitespace-nowrap ${
                filterMode === 'all'
                  ? 'bg-white dark:bg-slate-900 text-[#5b21b6] dark:text-purple-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              الكل ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('active')}
              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-colors cursor-pointer whitespace-nowrap ${
                filterMode === 'active'
                  ? 'bg-white dark:bg-slate-900 text-[#5b21b6] dark:text-purple-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              قيد التنفيذ ({totalCount - completedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('completed')}
              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-colors cursor-pointer whitespace-nowrap ${
                filterMode === 'completed'
                  ? 'bg-white dark:bg-slate-900 text-[#5b21b6] dark:text-purple-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              المكتملة ({completedCount})
            </button>
          </div>
        </div>

        {/* Add New Task Form */}
        <form onSubmit={handleAddSubmit} className="mb-3 space-y-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="أضف مهمة يومية جديدة للمتابعة..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-purple-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#5b21b6] hover:bg-[#4c1d95] text-white text-xs sm:text-[13px] font-extrabold shadow-xs transition-all active:scale-98 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>إضافة مهمة</span>
            </button>
          </div>

          {/* Secondary Row: Assignee, Priority & Due Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <select
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value)}
              aria-label="الموظف المسؤول"
              className="px-2.5 py-1.5 rounded-lg border border-purple-200/80 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold truncate"
            >
              {employeeList.map((emp) => (
                <option key={emp.id} value={emp.name}>
                  {emp.name}
                </option>
              ))}
            </select>

            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
              aria-label="الأولوية"
              className="px-2.5 py-1.5 rounded-lg border border-purple-200/80 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold"
            >
              <option value="عالية">أولوية عالية</option>
              <option value="متوسطة">أولوية متوسطة</option>
              <option value="عادية">أولوية عادية</option>
            </select>

            <input
              type="text"
              value={newDueTime}
              onChange={(e) => setNewDueTime(e.target.value)}
              placeholder="الموعد (مثال: 02:00 م)"
              className="px-2.5 py-1.5 rounded-lg border border-purple-200/80 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold tabular-nums"
            />
          </div>
        </form>

        {/* Tasks List */}
        <div className="space-y-2 max-h-[215px] overflow-y-auto pl-1">
          <AnimatePresence initial={false}>
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-8 text-center text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-bold"
              >
                لا توجد مهام مطابقة في هذا التصنيف حالياً.
              </motion.div>
            ) : (
              filteredTasks.map((task) => {
                const isEditing = editingId === task.id;
                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      task.completed
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40'
                        : 'bg-white dark:bg-slate-800/70 border-purple-100 dark:border-slate-700/80 hover:border-purple-300 dark:hover:border-purple-700'
                    }`}
                  >
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-purple-300 dark:border-purple-600 bg-white dark:bg-slate-900 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
                        />
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
                            <select
                              value={editAssignee}
                              onChange={(e) => setEditAssignee(e.target.value)}
                              className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[140px] truncate"
                            >
                              {employeeList.map((emp) => (
                                <option key={emp.id} value={emp.name}>
                                  {emp.name}
                                </option>
                              ))}
                            </select>
                            <select
                              value={editPriority}
                              onChange={(e) =>
                                setEditPriority(e.target.value as TaskPriority)
                              }
                              className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
                            >
                              <option value="عالية">عالية</option>
                              <option value="متوسطة">متوسطة</option>
                              <option value="عادية">عادية</option>
                            </select>
                            <input
                              type="text"
                              value={editDueTime}
                              onChange={(e) => setEditDueTime(e.target.value)}
                              className="w-20 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums"
                            />
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => saveEdit(task.id)}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold cursor-pointer"
                            >
                              حفظ
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="p-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2.5">
                        {/* Right: Completion Checkbox + Title & Metadata */}
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => dispatch(toggleTodoTask(task.id))}
                            title={
                              task.completed
                                ? 'إعادة المهمة لقيد التنفيذ'
                                : 'تحديد كمهمة منجزة'
                            }
                            className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                              task.completed
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                                : 'border-purple-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:border-purple-500'
                            }`}
                          >
                            {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>

                          <div className="min-w-0 flex-1">
                            <p
                              onClick={() => dispatch(toggleTodoTask(task.id))}
                              className={`text-xs sm:text-[13.5px] font-extrabold leading-snug cursor-pointer transition-colors ${
                                task.completed
                                  ? 'line-through text-slate-400 dark:text-slate-500'
                                  : 'text-slate-900 dark:text-slate-100'
                              }`}
                            >
                              {task.title}
                            </p>
                            {/* Clean unboxed metadata with typographic separators */}
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                                <UserCheck className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                                {task.assignee}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className={priorityColorText(task.priority)}>
                                أولوية {task.priority}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="flex items-center gap-0.5 tabular-nums">
                                <Clock className="w-3 h-3" />
                                {task.dueTime}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Left: Edit & Delete Action Icons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditing(task)}
                            title="تعديل المهمة"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => dispatch(deleteTodoTask(task.id))}
                            title="حذف المهمة"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Progress Bar, Export Buttons & Clear Completed Action */}
      <div className="mt-3 pt-2.5 border-t border-purple-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-1 min-w-[140px]">
          <div className="flex-1 h-2 rounded-full bg-purple-100 dark:bg-slate-800 overflow-hidden">
            <div
              style={{ width: `${completionPct}%` }}
              className="h-full bg-gradient-to-l from-emerald-500 to-teal-500 transition-all duration-300"
            />
          </div>
          <span className="text-[11.5px] font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums shrink-0">
            {completionPct}% مكتمل
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              exportHRDataToExcel(hr);
              dispatch(
                addToast({
                  title: 'تم تصدير ملف Excel بنجاح',
                  description: 'تم حفظ سجل الحضور والمهام اليومية بصيغة Excel (.xlsx).',
                  variant: 'success',
                })
              );
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-extrabold transition-colors cursor-pointer"
            title="تصدير الحضور والمهام إلى Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>

          <button
            type="button"
            onClick={() => {
              exportHRDataToPDF(hr);
              dispatch(
                addToast({
                  title: 'جاري تصدير ملف PDF',
                  description: 'تم إعداد تقرير الحضور والمهام اليومية بصيغة PDF.',
                  variant: 'info',
                })
              );
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-[#5b21b6] dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[11px] font-extrabold transition-colors cursor-pointer"
            title="تصدير الحضور والمهام إلى PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          {completedCount > 0 && (
            <button
              type="button"
              onClick={() => dispatch(clearCompletedTodos())}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors cursor-pointer shrink-0"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>حذف المنجزة</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
