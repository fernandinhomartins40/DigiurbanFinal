'use client';

import { ModulePageTemplate } from '@/components/admin/modules/ModulePageTemplate';
import { ruralProducersConfig } from '@/lib/module-configs/agriculture';

export default function ProdutoresPage() {
  return <ModulePageTemplate config={ruralProducersConfig} departmentType="agricultura" />;
}
