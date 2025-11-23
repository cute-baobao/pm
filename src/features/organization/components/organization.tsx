import { ErrorView, LoadingView } from '@/components/entity-component';

export function OrganizationLoading() {
  return (
    <LoadingView message="Loading organizations..." entity="organizations" />
  );
}

export function OrganizationError() {
  return <ErrorView message="Error loading organizations..." />;
}
