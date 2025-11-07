'use client';

import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import Image from 'next/image';
import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface FamilyMemberForm {
  name: string;
  occupation: string;
  nationality: string;
  img_url?: string;
}

export interface CandidateFormValues {
  id: string;
  candidate_name: string;
  gender: string;
  party: string;
  constituency: string;
  division?: string;
  district?: string;
  personal_info: {
    occupation_category?: string;
    profession_details?: string;
    education_category?: string;
    education_details?: string;
  };
  income?: string;
  tax?: string;
  assets?: string;
  liabilities?: string;
  expenditure?: string;
  media?: {
    img_url?: string;
  };
  family?: {
    spouse?: FamilyMemberForm | null;
    sons: FamilyMemberForm[];
    daughters: FamilyMemberForm[];
  };
}

interface CandidateFormProps {
  mode?: 'create' | 'edit';
  defaultValues?: CandidateFormValues;
  onCancel?: () => void;
  onSuccess?: (candidateId: string) => void;
}

const tabSections = [
  { id: 'info', label: '🧍‍♂️ হলফনামা' },
  { id: 'family', label: '👨‍👩‍👧‍👦 পরিবার' },
  { id: 'finance', label: '💰 আয়কর' },
  { id: 'assets', label: '🏠 সম্পদ, দায়' },
  { id: 'expenditure', label: '📊 ব্যয়বিবরণী' }
] as const;

const getInitialValues = (defaults?: CandidateFormValues): CandidateFormValues => ({
  id: defaults?.id || '',
  candidate_name: defaults?.candidate_name || '',
  gender: defaults?.gender || '',
  party: defaults?.party || '',
  constituency: defaults?.constituency || '',
  division: defaults?.division || '',
  district: defaults?.district || '',
  personal_info: {
    occupation_category: defaults?.personal_info?.occupation_category || '',
    profession_details: defaults?.personal_info?.profession_details || '',
    education_category: defaults?.personal_info?.education_category || '',
    education_details: defaults?.personal_info?.education_details || ''
  },
  income: defaults?.income || '',
  tax: defaults?.tax || '',
  assets: defaults?.assets || '',
  liabilities: defaults?.liabilities || '',
  expenditure: defaults?.expenditure || '',
  media: {
    img_url: defaults?.media?.img_url || ''
  },
  family: {
    spouse: defaults?.family?.spouse || null,
    sons: defaults?.family?.sons || [],
    daughters: defaults?.family?.daughters || []
  }
});

const createPreviewState = (members?: FamilyMemberForm[]) => {
  if (!members || members.length === 0) {
    return {} as Record<string, { file: File | null; preview: string | null }>;
  }

  return members.reduce((acc, member, index) => {
    acc[String(index)] = {
      file: null,
      preview: member?.img_url || null
    };
    return acc;
  }, {} as Record<string, { file: File | null; preview: string | null }>);
};

export default function CandidateForm({
  mode = 'create',
  defaultValues,
  onCancel,
  onSuccess
}: CandidateFormProps) {
  const router = useRouter();
  const resolvedDefaults = useMemo(() => getInitialValues(defaultValues), [defaultValues]);
  const [activeTab, setActiveTab] = useState<(typeof tabSections)[number]['id']>('info');
  const [submitting, setSubmitting] = useState(false);

  const [candidateImage, setCandidateImage] = useState<{ file: File | null; preview: string | null }>(
    {
      file: null,
      preview: resolvedDefaults.media?.img_url || null
    }
  );

  const [spouseImage, setSpouseImage] = useState<{ file: File | null; preview: string | null }>(
    {
      file: null,
      preview: resolvedDefaults.family?.spouse?.img_url || null
    }
  );

  const [sonsImages, setSonsImages] = useState<Record<string, { file: File | null; preview: string | null }>>(
    createPreviewState(resolvedDefaults.family?.sons)
  );

  const [daughtersImages, setDaughtersImages] = useState<Record<string, { file: File | null; preview: string | null }>>(
    createPreviewState(resolvedDefaults.family?.daughters)
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<CandidateFormValues>({
    defaultValues: resolvedDefaults
  });

  const {
    fields: sonsFields,
    append: appendSon,
    remove: removeSon
  } = useFieldArray({
    control,
    name: 'family.sons'
  });

  const {
    fields: daughtersFields,
    append: appendDaughter,
    remove: removeDaughter
  } = useFieldArray({
    control,
    name: 'family.daughters'
  });

  const familySpouse = watch('family.spouse') as FamilyMemberForm | null | undefined;

  const handleImageChange = (
    fileList: FileList | null,
    setState: (value: { file: File | null; preview: string | null }) => void
  ) => {
    const file = fileList?.[0];
    if (!file) {
      setState({ file: null, preview: null });
      return;
    }

    setState({
      file,
      preview: URL.createObjectURL(file)
    });
  };

  const handleFamilyImageChange = (
    fileList: FileList | null,
    memberId: string,
    existingState: Record<string, { file: File | null; preview: string | null }>,
    setState: Dispatch<
      SetStateAction<Record<string, { file: File | null; preview: string | null }>>
    >
  ) => {
    const file = fileList?.[0] || null;
    if (!file) {
      setState((prev) => ({
        ...prev,
        [memberId]: { file: null, preview: existingState[memberId]?.preview || null }
      }));
      return;
    }

    const preview = URL.createObjectURL(file);
    setState((prev) => ({
      ...prev,
      [memberId]: { file, preview }
    }));
  };

  const sanitizeFamilyMembers = (members: FamilyMemberForm[] = []) =>
    members.map((member) => ({
      name: member.name,
      occupation: member.occupation,
      nationality: member.nationality,
      img_url: member.img_url || undefined
    }));

  const onSubmit = handleSubmit(async (values: CandidateFormValues) => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      toast.error('প্রশাসক হিসাবে লগইন করুন।');
      router.push('/admin/login');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      const payload: CandidateFormValues = {
        ...values,
        media: {
          img_url: candidateImage.preview || values.media?.img_url || ''
        },
        family: {
          spouse: values.family?.spouse
            ? {
                ...values.family.spouse,
                img_url: spouseImage.preview || values.family.spouse.img_url || undefined
              }
            : undefined,
          sons: sanitizeFamilyMembers(values.family?.sons),
          daughters: sanitizeFamilyMembers(values.family?.daughters)
        }
      };

      // Remove null spouse to avoid storing empty object
      if (payload.family && !payload.family.spouse) {
        delete payload.family.spouse;
      }

      formData.append('data', JSON.stringify(payload));

      if (candidateImage.file) {
        formData.append('candidateImage', candidateImage.file);
      }

      if (familySpouse && spouseImage.file) {
        formData.append('family_spouse_image', spouseImage.file);
      }

      sonsFields.forEach((field: { id: string }, index: number) => {
        const imageState = sonsImages[field.id] || sonsImages[String(index)];
        if (imageState?.file) {
          formData.append(`family_sons_${index}`, imageState.file);
        }
      });

      daughtersFields.forEach((field: { id: string }, index: number) => {
        const imageState = daughtersImages[field.id] || daughtersImages[String(index)];
        if (imageState?.file) {
          formData.append(`family_daughters_${index}`, imageState.file);
        }
      });

      const endpoint = mode === 'create' ? '/api/candidates' : `/api/candidates/${values.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: 'Failed to save candidate' }));
        throw new Error(payload.error || 'Candidate save failed');
      }

      const saved = await response.json();
      toast.success(mode === 'create' ? 'প্রার্থী যুক্ত হয়েছে' : 'প্রার্থীর তথ্য আপডেট হয়েছে');

      if (onSuccess) {
        onSuccess(saved.id || saved._id);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Candidate submit failed:', error);
      toast.error('প্রার্থীর তথ্য সংরক্ষণ ব্যর্থ হয়েছে');
    } finally {
      setSubmitting(false);
    }
  });

  const renderRequired = (label: string) => (
    <span className="text-sm font-medium text-gray-700">
      {label}
      <span className="text-red-500">*</span>
    </span>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-100 bg-white shadow-lg">
        <div className="flex flex-wrap border-b border-blue-100 bg-blue-50/60 p-4 gap-2">
          {tabSections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveTab(section.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === section.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-blue-600 shadow-sm hover:bg-blue-100'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-8">
          {activeTab === 'info' && (
            <section className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      {renderRequired('প্রার্থীর আইডি')}
                      <input
                        {...register('id', { required: true })}
                        disabled={mode === 'edit'}
                        className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        placeholder="উদাহরণ: CAND-001"
                      />
                      {errors.id && <span className="text-xs text-red-500">আইডি প্রয়োজন</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      {renderRequired('প্রার্থীর নাম')}
                      <input
                        {...register('candidate_name', { required: true })}
                        className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        placeholder="প্রার্থীর পূর্ণ নাম"
                      />
                      {errors.candidate_name && <span className="text-xs text-red-500">প্রার্থীর নাম প্রয়োজন</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      {renderRequired('দল')}
                      <input
                        {...register('party', { required: true })}
                        className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        placeholder="দলের নাম"
                      />
                      {errors.party && <span className="text-xs text-red-500">দল প্রয়োজন</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      {renderRequired('আসন (নির্বাচনী এলাকা)')}
                      <input
                        {...register('constituency', { required: true })}
                        className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        placeholder="উদাহরণ: ঢাকা-৮"
                      />
                      {errors.constituency && (
                        <span className="text-xs text-red-500">নির্বাচনী এলাকা প্রয়োজন</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-gray-700">লিঙ্গ</span>
                      <input
                        {...register('gender')}
                        className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        placeholder="উদাহরণ: পুরুষ / নারী"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-gray-700">বিভাগ</span>
                      <input
                        {...register('division')}
                        className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        placeholder="উদাহরণ: ঢাকা"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-gray-700">জেলা</span>
                      <input
                        {...register('district')}
                        className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        placeholder="উদাহরণ: গাজীপুর"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-gray-700">পেশা</span>
                      <input
                        {...register('personal_info.occupation_category')}
                        className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        placeholder="উদাহরণ: ব্যবসা"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-gray-700">পেশার বিস্তারিত</span>
                      <textarea
                        {...register('personal_info.profession_details')}
                        className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        rows={3}
                        placeholder="পেশার বিস্তারিত বিবরণ"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-gray-700">শিক্ষা</span>
                      <input
                        {...register('personal_info.education_category')}
                        className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        placeholder="উদাহরণ: স্নাতক"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-gray-700">শিক্ষার বিস্তারিত</span>
                      <textarea
                        {...register('personal_info.education_details')}
                        className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        rows={3}
                        placeholder="শিক্ষার বিস্তারিত বিবরণ"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50/40 p-4 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-36 w-36 overflow-hidden rounded-xl bg-white shadow">
                        {candidateImage.preview ? (
                          <Image
                            src={candidateImage.preview}
                            alt="Candidate preview"
                            width={144}
                            height={144}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-4xl text-blue-300">
                            👤
                          </div>
                        )}
                      </div>
                      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm transition hover:border-blue-400 hover:text-blue-700">
                        একটি ছবি আপলোড করুন
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          className="hidden"
                          onChange={(event) => handleImageChange(event.target.files, setCandidateImage)}
                        />
                      </label>
                      <p className="text-xs text-gray-500">PNG, JPG অথবা JPEG (max 5MB)</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'family' && (
            <section className="space-y-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h3 className="text-lg font-semibold text-gray-800">পরিবারের তথ্য</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (familySpouse) {
                        setValue('family.spouse', null);
                        setSpouseImage({ file: null, preview: null });
                      } else {
                        setValue('family.spouse', {
                          name: '',
                          occupation: '',
                          nationality: '',
                          img_url: ''
                        });
                        setSpouseImage({ file: null, preview: null });
                      }
                    }}
                    className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition hover:bg-blue-200"
                  >
                    {familySpouse ? 'সঙ্গীর তথ্য মুছুন' : 'সঙ্গী যুক্ত করুন'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      appendSon({ name: '', occupation: '', nationality: '', img_url: '' });
                    }}
                    className="rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700 shadow-sm transition hover:bg-green-200"
                  >
                    পুত্র যুক্ত করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      appendDaughter({ name: '', occupation: '', nationality: '', img_url: '' });
                    }}
                    className="rounded-lg bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 shadow-sm transition hover:bg-purple-200"
                  >
                    কন্যা যুক্ত করুন
                  </button>
                </div>
              </div>

              {familySpouse && (
                <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
                  <h4 className="mb-3 text-sm font-semibold text-gray-800">সঙ্গীর তথ্য</h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="md:col-span-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-gray-700">নাম</span>
                        <input
                          {...register('family.spouse.name', { required: true })}
                          className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-gray-700">পেশা</span>
                        <input
                          {...register('family.spouse.occupation', { required: true })}
                          className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-gray-700">জাতীয়তা</span>
                        <input
                          {...register('family.spouse.nationality', { required: true })}
                          className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-20 w-20 overflow-hidden rounded-full bg-blue-50">
                        {spouseImage.preview ? (
                          <Image
                            src={spouseImage.preview}
                            alt="Spouse preview"
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl text-blue-300">
                            👤
                          </div>
                        )}
                      </div>
                      <label className="cursor-pointer rounded-lg bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 shadow-sm hover:bg-blue-200">
                        ছবি পরিবর্তন
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          className="hidden"
                          onChange={(event) => handleImageChange(event.target.files, setSpouseImage)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {(sonsFields.length > 0 || daughtersFields.length > 0) && (
                <div className="space-y-4">
                  {sonsFields.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-800">পুত্র</h4>
                      <div className="flex flex-wrap gap-4">
                        {sonsFields.map((field: { id: string }, index: number) => (
                          <div
                            key={field.id}
                            className="flex w-full max-w-xl flex-col gap-4 rounded-2xl bg-white p-4 shadow-md sm:flex-row"
                          >
                            <div className="flex items-center justify-center">
                              <div className="h-20 w-20 overflow-hidden rounded-full bg-green-50">
                                {(() => {
                                  const preview =
                                    sonsImages[field.id]?.preview ?? sonsImages[String(index)]?.preview;
                                  return preview ? (
                                    <Image
                                      src={preview}
                                      alt="Son preview"
                                      width={80}
                                      height={80}
                                      className="h-full w-full object-cover"
                                      unoptimized
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center text-2xl text-green-300">
                                      👦
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                            <div className="flex-1 space-y-3">
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                <input
                                  {...register(`family.sons.${index}.name` as const, { required: true })}
                                  className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                  placeholder="নাম"
                                />
                                <input
                                  {...register(`family.sons.${index}.occupation` as const, { required: true })}
                                  className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                  placeholder="পেশা"
                                />
                                <input
                                  {...register(`family.sons.${index}.nationality` as const, { required: true })}
                                  className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                  placeholder="জাতীয়তা"
                                />
                              </div>
                              <div className="flex flex-wrap items-center gap-3">
                                <label className="cursor-pointer rounded-lg bg-green-100 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-200">
                                  ছবি আপলোড
                                  <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    className="hidden"
                                    onChange={(event) =>
                                      handleFamilyImageChange(
                                        event.target.files,
                                        field.id,
                                        sonsImages,
                                        setSonsImages
                                      )
                                    }
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    removeSon(index);
                                    setSonsImages((prev) => {
                                      const updated = { ...prev };
                                      delete updated[field.id];
                                      delete updated[String(index)];
                                      return updated;
                                    });
                                  }}
                                  className="text-xs font-medium text-red-500 hover:text-red-600"
                                >
                                  মুছুন
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {daughtersFields.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-800">কন্যা</h4>
                      <div className="flex flex-wrap gap-4">
                        {daughtersFields.map((field: { id: string }, index: number) => (
                          <div
                            key={field.id}
                            className="flex w-full max-w-xl flex-col gap-4 rounded-2xl bg-white p-4 shadow-md sm:flex-row"
                          >
                            <div className="flex items-center justify-center">
                              <div className="h-20 w-20 overflow-hidden rounded-full bg-purple-50">
                                {(() => {
                                  const preview =
                                    daughtersImages[field.id]?.preview ??
                                    daughtersImages[String(index)]?.preview;
                                  return preview ? (
                                    <Image
                                      src={preview}
                                      alt="Daughter preview"
                                      width={80}
                                      height={80}
                                      className="h-full w-full object-cover"
                                      unoptimized
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center text-2xl text-purple-300">
                                      👧
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                            <div className="flex-1 space-y-3">
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                <input
                                  {...register(`family.daughters.${index}.name` as const, { required: true })}
                                  className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                  placeholder="নাম"
                                />
                                <input
                                  {...register(`family.daughters.${index}.occupation` as const, { required: true })}
                                  className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                  placeholder="পেশা"
                                />
                                <input
                                  {...register(`family.daughters.${index}.nationality` as const, { required: true })}
                                  className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                  placeholder="জাতীয়তা"
                                />
                              </div>
                              <div className="flex flex-wrap items-center gap-3">
                                <label className="cursor-pointer rounded-lg bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 hover:bg-purple-200">
                                  ছবি আপলোড
                                  <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    className="hidden"
                                    onChange={(event) =>
                                      handleFamilyImageChange(
                                        event.target.files,
                                        field.id,
                                        daughtersImages,
                                        setDaughtersImages
                                      )
                                    }
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    removeDaughter(index);
                                    setDaughtersImages((prev) => {
                                      const updated = { ...prev };
                                      delete updated[field.id];
                                      delete updated[String(index)];
                                      return updated;
                                    });
                                  }}
                                  className="text-xs font-medium text-red-500 hover:text-red-600"
                                >
                                  মুছুন
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {activeTab === 'finance' && (
            <section className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-700">আয় (Income)</span>
                  <textarea
                    {...register('income')}
                    className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    rows={4}
                    placeholder="আয় সংক্রান্ত বিবরণ"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-700">কর (Tax)</span>
                  <textarea
                    {...register('tax')}
                    className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    rows={4}
                    placeholder="কর এবং ট্যাক্স সংক্রান্ত তথ্য"
                  />
                </div>
              </div>
            </section>
          )}

          {activeTab === 'assets' && (
            <section className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-700">সম্পদ (Assets)</span>
                  <textarea
                    {...register('assets')}
                    className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    rows={4}
                    placeholder="সম্পদের বিস্তারিত"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-700">দায় (Liabilities)</span>
                  <textarea
                    {...register('liabilities')}
                    className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    rows={4}
                    placeholder="দায় সংক্রান্ত তথ্য"
                  />
                </div>
              </div>
            </section>
          )}

          {activeTab === 'expenditure' && (
            <section className="space-y-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-700">ব্যয়বিবরণী (Expenditure)</span>
                <textarea
                  {...register('expenditure')}
                  className="rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  rows={6}
                  placeholder="প্রচারের ব্যয় বা অন্যান্য ব্যয়ের বিবরণ"
                />
              </div>
            </section>
          )}

          <div className="flex flex-wrap items-center justify-end gap-3 pt-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                বাতিল করুন
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {submitting ? 'সংরক্ষণ হচ্ছে...' : mode === 'create' ? 'Save Candidate' : 'Update Candidate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


