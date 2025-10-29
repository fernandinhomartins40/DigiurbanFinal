'use client';

import { DepartmentDashboard } from '@/components/admin/modules/DepartmentDashboard';

export default function MeioAmbientePage() {
  return (
    <DepartmentDashboard
      departmentCode="MEIO_AMBIENTE"
      departmentName="Meio Ambiente"
      description="Gestão de licenças, denúncias e programas ambientais"
    />
  );
}
