'use client';

import { ModuleForm } from '@/components/admin/modules/ModuleForm';
import { ruralProgramsConfig } from '@/lib/module-configs/agriculture';

export default function NovoProgramaPage() {
  return (
    <ModuleForm
      config={ruralProgramsConfig}
      departmentType="agricultura"
    />
  );
}
