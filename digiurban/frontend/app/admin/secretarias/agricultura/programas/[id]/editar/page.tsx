'use client';

import { ModuleForm } from '@/components/admin/modules/ModuleForm';
import { ruralProgramsConfig } from '@/lib/module-configs/agriculture';
import { useParams } from 'next/navigation';

export default function EditarProgramaPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <ModuleForm
      config={ruralProgramsConfig}
      departmentType="agricultura"
      recordId={id}
    />
  );
}
