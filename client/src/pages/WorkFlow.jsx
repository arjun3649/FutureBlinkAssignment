import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import Reactflow from "../components/Reactflow";
import { BASE_URL } from "../../../server/utils/BaseUrl";

const WorkflowPage = () => {
  const { id } = useParams();

  const getUserId = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        return payload.id;
      }
      return null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  };

  const userId = getUserId();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['workflow', id],
    queryFn: () => axios.get(`${BASE_URL}/api/users/${userId}/workflows/${id}`).then(res => res.data),
  });

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (isError) return <p className="text-center text-red-500">Failed to Load Workflow</p>;
  if (!data || !data.sequence || data.sequence.length === 0) {
    return <p className="text-center">No workflow data found.</p>;
  }

  const workflow = data;

  const transformNodes = (nodes) =>
    nodes.map((node) => ({
      id: node.id,
      type: "selectLead",
      position: node.position,
      data: {
        header: node.data.label,
        bottom: node.data?.leadSourceId?.name || node.data?.emailTemplateId?.name || "",
        leadSourceId: node.data?.leadSourceId?._id,
        emailTemplateId: node.data?.emailTemplateId?._id,
        waitFor: node.data?.waitFor,
        waitType: node.data?.waitType,
        showActionButtons: node.id !== '2' && node.id !== '3',
      },
    }));

  // Only generate edges as a fallback if stored edges don't exist
  const generateEdges = (nodes) =>
    nodes.slice(0, -1).map((node, idx) => ({
      id: `e${node.id}-${nodes[idx + 1].id}`,
      source: node.id,
      target: nodes[idx + 1].id,
    }));

  const transformedNodes = transformNodes(workflow.sequence);
  const transformedEdges = workflow.edges || generateEdges(workflow.sequence);

  return (
    <div className="h-full w-full p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {workflow.name || `Workflow #${workflow._id.slice(0, 6).toUpperCase()}`}
        <span className="text-sm font-normal text-gray-500 ml-2">
          ID: {workflow._id.slice(0, 6).toUpperCase()}
        </span>
      </h1>
      <div className="h-[85vh] w-full">
        <Reactflow 
          existingNodes={transformedNodes} 
          existingEdges={transformedEdges} 
          workflowId={workflow._id} 
        />
      </div>
    </div>
  );
};

export default WorkflowPage;
