import { useParams } from "next/navigation";


export function useGetProjectId() {
    const params = useParams();
    return params.projectId as string;
}