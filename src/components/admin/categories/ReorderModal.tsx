import { useState, useEffect } from "react";
import { X, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CategoryRow } from "@/lib/taxonomy.functions";

type SortableItemProps = {
  category: CategoryRow;
  index: number;
};

function SortableItem({ category, index }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border bg-white px-4 py-3 shadow-xs ${
        isDragging ? "border-slate-400 opacity-80" : "border-slate-200"
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab touch-none p-1 text-slate-400 hover:text-slate-600">
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="flex flex-1 items-center gap-2">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
          {index + 1}
        </span>
        <span className="font-semibold text-slate-800">{category.name}</span>
      </div>
      <span className="text-xs text-slate-400">Header Item</span>
    </div>
  );
}

export function ReorderModal({
  categories,
  onClose,
  onSave,
}: {
  categories: CategoryRow[];
  onClose: () => void;
  onSave: (orderedCats: CategoryRow[]) => Promise<void>;
}) {
  const [items, setItems] = useState<CategoryRow[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const headerCats = categories
      .filter((c) => c.showInHeader)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    setItems(headerCats);
  }, [categories]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id.toString() === active.id);
        const newIndex = items.findIndex((i) => i.id.toString() === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const updated = items.map((c, idx) => ({ ...c, sortOrder: idx + 1 }));
    await onSave(updated);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Reorder Header Categories</h2>
            <p className="text-xs text-slate-500 mt-1">Drag and drop to change navigation order</p>
          </div>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500">
            No categories are set to "Show in Header". <br />
            Edit a category and check the box first.
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-2 py-2">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={items.map((i) => i.id.toString())} strategy={verticalListSortingStrategy}>
                {items.map((category, index) => (
                  <SortableItem key={category.id} category={category} index={index} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || items.length === 0}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
