import { useState } from "react";
import { toast } from "sonner";
import type { QueryClient } from "@tanstack/react-query";
import type { EditForm } from "./JournalistFormModal";
import type { JournalistListRow } from "@/lib/journalist.functions";

export function emptyJournalistForm(): EditForm {
  return {
    email: "",
    password: "",
    displayName: "",
    phone: "",
    bloodGroup: "",
    dob: "",
    validTill: "",
    fatherName: "",
    motherName: "",
    gender: "",
    maritalStatus: "",
    husbandName: "",
    documentType: "",
    documentUrl: "",
    address: "",
    state: "",
    country: "",
    pinCode: "",
    avatarUrl: "",
    articlesPublished: 0,
    points: 0,
    active: true,
  };
}

interface UseJournalistFormOptions {
  upsert: (opts: { data: any }) => Promise<any>;
  qc: QueryClient;
}

export function useJournalistForm({ upsert, qc }: UseJournalistFormOptions) {
  const [form, setForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);

  const openNew = () => setForm(emptyJournalistForm());

  const openEdit = (j: JournalistListRow) =>
    setForm({
      userId: j.userId,
      email: j.email ?? "",
      password: "",
      displayName: j.displayName ?? "",
      phone: j.phone ?? "",
      bloodGroup: j.bloodGroup ?? "",
      dob: j.dob ?? "",
      validTill: j.validTill ?? "",
      fatherName: j.fatherName ?? "",
      motherName: j.motherName ?? "",
      gender: j.gender ?? "",
      maritalStatus: j.maritalStatus ?? "",
      husbandName: j.husbandName ?? "",
      documentType: j.documentType ?? "",
      documentUrl: j.documentUrl ?? "",
      address: j.address ?? "",
      state: j.state ?? "",
      country: j.country ?? "",
      pinCode: j.pinCode ?? "",
      avatarUrl: j.avatarUrl ?? "",
      articlesPublished: j.articlesPublished ?? 0,
      points: j.points ?? 0,
      active: j.active,
    });

  const submitForm = async () => {
    if (!form) return;
    if (form.gender === "Female" && form.maritalStatus === "Married" && !form.husbandName.trim()) {
      toast.error("Husband's name is required for married female journalists.");
      return;
    }
    setSaving(true);
    try {
      await upsert({
        data: {
          userId: form.userId,
          email: form.email,
          password: form.password || undefined,
          displayName: form.displayName,
          phone: form.phone,
          bloodGroup: form.bloodGroup,
          dob: form.dob,
          validTill: form.validTill,
          fatherName: form.fatherName,
          motherName: form.motherName,
          gender: form.gender,
          maritalStatus: form.maritalStatus,
          husbandName:
            form.gender === "Female" && form.maritalStatus === "Married"
              ? form.husbandName.trim()
              : undefined,
          documentType: form.documentType || undefined,
          documentUrl: form.documentUrl || undefined,
          address: form.address,
          state: form.state,
          country: form.country,
          pinCode: form.pinCode,
          avatarUrl: form.avatarUrl,
          articlesPublished: form.articlesPublished,
          points: form.points,
          active: form.active,
        },
      });
      toast.success(form.userId ? "Journalist updated" : "Journalist created");
      setForm(null);
      qc.invalidateQueries({ queryKey: ["admin-journalists"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return {
    form,
    setForm,
    saving,
    openNew,
    openEdit,
    submitForm,
  };
}
