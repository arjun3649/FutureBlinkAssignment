import {
  addEdge,
  Background,
  Controls,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import EmailTemplateForm from './EmailTemplateForm';
import LeadsForm from './LeadsForm';

import { useQuery } from '@tanstack/react-query';
import '@xyflow/react/dist/style.css';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiMutation } from '../hooks/useApiMutation';
import ColdEmailCard from './ColdEmailCard';
import ColdEmaildata from './ColdEmaildata';
import { SelectLead } from './CustomNode';
import LeadsChoiceCard from './LeadsChoiceCard';
import ListSubmitCard from './ListSourceSubmit';
import PortalModal from './PortalModal';
import SequenceSettings from './SequenceSettings';
import WaitTimeSelect from './WaitTimeSelect';
import { BASE_URL } from '../../../server/utils/BaseUrl';

const nodeTypes = { selectLead: SelectLead };

export default function Reactflow({ existingNodes, existingEdges, workflowId }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [isLeadChoiceCardOpen, setIsLeadChoiceCardOpen] = useState(false);
  const [isListSourceSubmitOpen, setIsListSourceSubmitOpen] = useState(false);
  const [isPlusChoiceCardOpen, setIsPlusChoiceCardOpen] = useState(false);
  const [isColdEmailTemplateOpen, setIsColdEmailTemplateOpen] = useState(false);
  const [isWaitTimeSelectOpen, setIsWaitTimeSelectOpen] = useState(false);
  const [isEmailTemplateFormOpen, setIsEmailTemplateFormOpen] = useState(false);
  const [isLeadsFormOpen, setIsLeadsFormOpen] = useState(false);
  const [isSequenceSettingsOpen, setIsSequenceSettingsOpen] = useState(false);


  const [editLead, setEditLead] = useState(null);
  const [editEmail, setEditEmail] = useState(null);

  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);

  const navigate = useNavigate();
  const [saveStatus, setSaveStatus] = useState(null); 

  useEffect(() => {
    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, [nodes, edges]);

  useEffect(() => {
    if (existingNodes && existingEdges && existingNodes.length > 0) {
      
      let processedNodes = [...existingNodes];
      
     
      processedNodes = processedNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          id: node.id, 
          onDelete: onDeleteNode,
          handleclick: () => handleNodeClick(node)
        }
      }));
      
      const hasNode1 = processedNodes.some(node => node.id === '1');
      const hasNode2 = processedNodes.some(node => node.id === '2');
      
      
      if (!hasNode1) {
        const node1 = {
          ...baseNodes[0],
          data: {
            ...baseNodes[0].data,
            id: '1',
            onDelete: onDeleteNode,
            handleclick: () => handleNodeClick({id: '1'})
          }
        };
        processedNodes.unshift(node1);
      }
      
      if (!hasNode2) {
        const insertIndex = hasNode1 ? 1 : 0;
        const node2 = {
          ...baseNodes[1],
          data: {
            ...baseNodes[1].data,
            id: '2',
            onDelete: onDeleteNode,
            handleclick: () => handleNodeClick({id: '2'})
          }
        };
        processedNodes.splice(insertIndex, 0, node2);
      }
      
      const plusNodeIndex = processedNodes.findIndex(node => node.id === '3');
      
      
      if (plusNodeIndex === -1) {
        const lastNode = processedNodes[processedNodes.length - 1];
        const plusNode = {
          ...baseNodes[2],
          position: {
            x: lastNode ? lastNode.position.x : 0,
            y: lastNode ? lastNode.position.y + 100 : 200
          },
          data: {
            ...baseNodes[2].data,
            id: '3',
            onDelete: onDeleteNode,
            handleclick: () => handleNodeClick({id: '3'})
          }
        };
        processedNodes.push(plusNode);
      } else {
        const plusNode = processedNodes.splice(plusNodeIndex, 1)[0];
        processedNodes.push(plusNode);
      }
      
      
      if (processedNodes.length > 1) {
        const lastNode = processedNodes[processedNodes.length - 2];
        const plusNode = processedNodes[processedNodes.length - 1];
        
        if (plusNode && plusNode.id === '3') {
          plusNode.position = {
            x: lastNode.position.x,
            y: lastNode.position.y + 100
          };
        }
      }
      
      
      let processedEdges = [...existingEdges];
      
      
      if (hasNode1 && hasNode2 && !processedEdges.some(edge => edge.id === 'e1-2')) {
        processedEdges.push({
          id: 'e1-2',
          source: '1',
          target: '2'
        });
      }
      
      
      if (processedNodes.length > 1) {
        const lastNode = processedNodes[processedNodes.length - 2];
        const hasConnectionToPlus = processedEdges.some(edge => edge.target === '3');
        
        if (!hasConnectionToPlus) {
          processedEdges.push({
            id: `e${lastNode.id}-3`,
            source: lastNode.id,
            target: '3'
          });
        }
      }
      
      setNodes(processedNodes);
      setEdges(processedEdges);
    } else if (nodes.length === 0) {
      
      const initialNodes = baseNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          id: node.id,
          onDelete: onDeleteNode,
          handleclick: () => handleNodeClick({id: node.id})
        }
      }));
      
      setNodes(initialNodes);
      setEdges([{ id: 'e2-3', source: '2', target: '3' }]);
    }
  }, [existingNodes, existingEdges]);

 
 const getUserId = () => {
  try {
  
    const userStr = localStorage.getItem('user');
   
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

  const { data: leadSources = [] } = useQuery({
    queryKey: ['leadSources'],
    queryFn: () => axios.get(`${BASE_URL}/api/lead-sources`).then(res => res.data),
  });

  const { data: emailTemplates = [] } = useQuery({
    queryKey: ['emailTemplates'],
    queryFn: () => axios.get(`${BASE_URL}/api/email-templates`).then(res => res.data),
  });

  const { mutate: createWorkflow } = useApiMutation({
     url: userId ? `${BASE_URL}/api/users/${userId}/workflows` : null,
    queryKey: ['workflows'],
  });

  const { data: existingWorkflow, isLoading } = useQuery({
  queryKey: ['workflow', workflowId],
  queryFn: () => axios.get(`${BASE_URL}/api/users/${userId}/workflows/${workflowId}`).then(res => res.data),
  enabled: !!workflowId && !!userId,
});


  
  const updateExistingWorkflow = async (workflowId, userId, data) => {
    setSaveStatus('saving');
    try {
      await axios.put(`${BASE_URL}/api/users/${userId}/workflows/${workflowId}`, data);
      console.log(' Workflow updated successfully');
      setSaveStatus('success');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error(' Workflow update failed:', error?.response?.data?.message || error.message);
      setSaveStatus('error');
    }
  };

  
  const scheduleEmails = async (workflow) => {
    try {
      const userId = getUserId();
      if (!userId) return;
      
     
      console.log('Email sending has been scheduled based on the sequence settings');
      
    } catch (error) {
      console.error('Error scheduling emails:', error);
    }
  };

  const baseNodes = [
    {
      id: '1',
      position: { x: 0, y: -50 },
      type: 'selectLead',
      data: {
        header: 'Add Lead Source',
        bottom: 'Click to add leads from List or CRM',
        showActionButtons: true,
      },
    },
    {
      id: '2',
      position: { x: 0, y: 100 },
      type: 'selectLead',
      data: {
        header: 'Sequence Start Point',
        showActionButtons: false,
      },
    },
    {
      id: '3',
      position: { x: 0, y: 200 },
      type: 'selectLead',
      data: {
        header: '+',
        showActionButtons: false,
      },
    },
  ];

  const handleNodeClick = (node) => {
    if (node.id === '1') setIsLeadChoiceCardOpen(true);
    else if (node.id === '3') setIsPlusChoiceCardOpen(true);
    else if (node.data.emailTemplateId) {
      setEditEmail(node);
      setIsColdEmailTemplateOpen(true);
    }
  };

  const handleInsertLead = (selectedLead) => {
    setNodes(prevNodes => prevNodes.map(node => node.id === '1' ? {
      ...node,
      data: { ...node.data, header: 'Leads From', bottom: selectedLead.name, leadSourceId: selectedLead._id }
    } : node));

    if (!edges.find(e => e.id === 'e1-2')) {
      setEdges(prev => [...prev, { id: 'e1-2', source: '1', target: '2' }]);
    }

    setIsLeadChoiceCardOpen(false);
    setIsListSourceSubmitOpen(false);
  };

  const handleInsertTemplate = (selectedTemplate) => {
  if (editEmail) {
    setNodes(prev => prev.map(node => node.id === editEmail.id ? {
      ...node,
      data: { 
        ...node.data, 
        header: `Email Template: ${selectedTemplate.name}`, 
        emailTemplateId: selectedTemplate._id,
        emailType: selectedTemplate.emailType,  // <-- this was missing
      }
    } : node));
    setEditEmail(null);
  } else {
    createNewNode(`Email Template: ${selectedTemplate.name}`, { 
      emailTemplateId: selectedTemplate._id,
      emailType: selectedTemplate.emailType,  // <-- this was missing
    });
    
    setIsPlusChoiceCardOpen(false);
  }
  setIsColdEmailTemplateOpen(false);
  };
  
  const handleInsertDelay = (waitFor, waitType) => {
    createNewNode(`Wait ${waitFor} ${waitType}`, { waitFor, waitType });
    setIsWaitTimeSelectOpen(false);
    
    setIsPlusChoiceCardOpen(false);
  };

  const createNewNode = (text, extraData) => {
    const plusNode = nodes.find(n => n.id === '3');
    const previousEdge = edges.find(e => e.target === '3');
    const newNodeId = `node-${Date.now()}`;

    const newNode = {
      id: newNodeId,
      position: { x: plusNode.position.x, y: plusNode.position.y + 100 },
      type: 'selectLead',
      data: { 
        id: newNodeId,
        header: text, 
        showActionButtons: true, 
        onDelete: onDeleteNode,
        ...extraData 
      },
    };
    
   
    newNode.data.handleclick = () => handleNodeClick(newNode);

    setNodes(prev => [...prev.filter(n => n.id !== '3'), newNode, { ...plusNode, position: { x: plusNode.position.x, y: plusNode.position.y + 200 } }]);

    setEdges([...edges.filter(e => e.target !== '3'), { id: `e${previousEdge?.source}-${newNodeId}`, source: previousEdge?.source || '2', target: newNodeId }, { id: `e${newNodeId}-3`, source: newNodeId, target: '3' }]);
  };


 const handleSequenceSettingsSave = async (sequenceSettingsData) => {
  const userId = getUserId();
  if (!userId) {
    console.error('User not found → Cannot save workflow');
    setSaveStatus('error');
    return;
  }

  setSaveStatus('saving');

  
  const formattedNodes = nodes.map((node) => ({
    id: node.id,
    type:
      node.id === '1'
        ? 'loadSourceNode'
        : node.data?.emailTemplateId
          ? 'coldEmailNode'
          : node.data?.waitFor
            ? 'delayNode'
            : 'addButton',
    position: node.position,
    data: {
      label: node.data.header || 'No Label',
      leadSourceId: node.data?.leadSourceId,
      emailTemplateId: node.data?.emailTemplateId,
      emailType: node.data?.emailType,
      waitFor: node.data?.waitFor,
      waitType: node.data?.waitType,
    },
  }));

  
  const formattedEdges = edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
  }));

  
  const sequenceSettings = {
    launchDate: new Date(sequenceSettingsData.launchDate),
    launchTime: sequenceSettingsData.launchTime,
    timezone: sequenceSettingsData.timezone,
    sendingMode: 'batch', 
    randomDelays: {
      enabled: sequenceSettingsData.addRandomDelays,
      fromMinutes: parseInt(sequenceSettingsData.delayFrom, 10),
      toMinutes: parseInt(sequenceSettingsData.delayTo, 10),
    },
    sendingHours: sequenceSettingsData.sendingHours.map((day) => ({
      day: day.day,
      enabled: day.enabled,
      fromTime: day.from,
      toTime: day.till,
     sendsPerDay: isNaN(day.sendsPerDay) ? 0 : parseInt(day.sendsPerDay, 10),


    })),
  };

  
  const payload = {
    user: userId,
    name: sequenceSettingsData.workflowName || 'Untitled Campaign',
    nodes: formattedNodes,
    edges: formattedEdges,
    sequenceSettings,
  };

  try {
    let savedWorkflowId;
    
    if (workflowId) {
     
      const response = await axios.put(
        `${BASE_URL}/api/users/${userId}/workflows/${workflowId}`, 
        payload
      );
      savedWorkflowId = workflowId;
      console.log('Workflow updated successfully.');
    } else {
    
      const response = await axios.post(
        `${BASE_URL}/api/users/${userId}/workflows`, 
        payload
      );
      savedWorkflowId = response.data._id;
      console.log('Workflow created successfully.');
    }
    
    setSaveStatus('success');
    
    
    console.log(`Emails scheduled for workflow ID: ${savedWorkflowId}`);
    
   
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  } catch (error) {
    console.error('Error saving workflow:', error);
    setSaveStatus('error');
  } finally {
    setIsSequenceSettingsOpen(false);
  }
};


  

  const onDeleteNode = (nodeId) => {
    
    if (nodeId === '1') {
      setNodes(prev => prev.map(n => n.id === '1' ? { 
        ...n, 
        data: { 
          ...n.data, 
          header: 'Add Lead Source', 
          bottom: 'Click to add leads from List or CRM', 
          leadSourceId: undefined 
        } 
      } : n));
      
    
      setEdges(prev => prev.filter(e => !(e.source === '1' && e.target === '2')));
      
      console.log('Lead source data cleared');
    } else {
      
      const nodeToDelete = nodesRef.current.find(n => n.id === nodeId);
      if (!nodeToDelete) return;
      
      const incomers = getIncomers(nodeToDelete, nodesRef.current, edgesRef.current);
      const outgoers = getOutgoers(nodeToDelete, nodesRef.current, edgesRef.current);
      const connectedEdges = getConnectedEdges([nodeToDelete], edgesRef.current);
      const remainingEdges = edgesRef.current.filter(e => !connectedEdges.includes(e));
      const newEdges = incomers.flatMap(inNode => outgoers.map(outNode => ({ id: `${inNode.id}->${outNode.id}`, source: inNode.id, target: outNode.id })));

      setEdges([...remainingEdges, ...newEdges]);
      setNodes(prev => prev.filter(n => n.id !== nodeId));
    }
  };

  const onNodesDelete = useCallback((deleted) => { deleted.forEach(node => onDeleteNode(node.id)); }, [nodes, edges]);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  return (
    <div className="flex flex-col w-full h-full bg-[#f5f5f5]">
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-1"
          >
            <span>←</span> Back to Dashboard
          </button>
          <span className="text-xs font-semibold text-gray-800 flex items-center gap-2 border-l  ml-2">
            {existingNodes && existingNodes.length > 0 ? (
              "Edit Workflow"
            ) : (
              "New Workflow 🔥"
            )}
          </span>
        </div>
       <button 
  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 ml-1  md:px-8 md:py-3 rounded-md font-bold flex items-center gap-2 text-xs md:text-lg w-full md:w-auto shadow-md"
  onClick={() => setIsSequenceSettingsOpen(true)}
  disabled={saveStatus === 'saving'}
>
  <span>{saveStatus === 'saving' ? '⏳' : '🚀'}</span>
  {saveStatus === 'saving' ? 'Saving...' : 'Save & Schedule'}
</button>

      </div>

      <div className="flex flex-col w-full h-screen overflow-hidden bg-[#f5f5f5]">
  <div className="flex-1 overflow-hidden p-2 md:p-4">
    <div className="w-full h-full bg-white rounded-md shadow-sm overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
      >
        <MiniMap />
        <Controls />
        <Background color="#f3f4a8" variant="cross" />
      </ReactFlow>
    </div>
  </div>
</div>


      <PortalModal isOpen={isLeadChoiceCardOpen}>
        <LeadsChoiceCard 
          onClose={() => setIsLeadChoiceCardOpen(false)} 
          onSelect={{ 
            lists: () => {
              setIsListSourceSubmitOpen(true);
              setIsLeadChoiceCardOpen(false);
            } 
          }} 
        />
      </PortalModal>
      <PortalModal isOpen={isListSourceSubmitOpen}><ListSubmitCard onClose={() => setIsListSourceSubmitOpen(false)} onInsertLead={handleInsertLead} leadSources={leadSources} buttonText={"New Lead"} onButtonClick={()=>setIsLeadsFormOpen(true)} /></PortalModal>
      <PortalModal isOpen={isPlusChoiceCardOpen}>
        <ColdEmailCard 
          onClose={() => setIsPlusChoiceCardOpen(false)} 
          onSelect={{ 
            coldemail: () => {
              setIsColdEmailTemplateOpen(true);
              setIsPlusChoiceCardOpen(false);
            }, 
            wait: () => {
              setIsWaitTimeSelectOpen(true);
              setIsPlusChoiceCardOpen(false);
            } 
          }} 
        />
      </PortalModal>
      <PortalModal isOpen={isColdEmailTemplateOpen}><ColdEmaildata onClose={() => setIsColdEmailTemplateOpen(false)} onInsertTemplate={handleInsertTemplate} emailTemplates={emailTemplates} editEmail={editEmail}  buttonText={"New Template"} onButtonClick={()=>setIsEmailTemplateFormOpen(true)}/></PortalModal>
      <PortalModal isOpen={isWaitTimeSelectOpen}><WaitTimeSelect onClose={() => setIsWaitTimeSelectOpen(false)} onUpdate={handleInsertDelay} /></PortalModal>
      <PortalModal isOpen={isEmailTemplateFormOpen}>
      <EmailTemplateForm onClose={() => setIsEmailTemplateFormOpen(false)} />
      </PortalModal>

      <PortalModal isOpen={isLeadsFormOpen}>
        <LeadsForm onClose={() => setIsLeadsFormOpen(false)} />
      </PortalModal>
     <PortalModal isOpen={isSequenceSettingsOpen}>
  <SequenceSettings
    workflowId={workflowId}
    nodes={nodes}
    edges={edges}
    onSave={handleSequenceSettingsSave}
    onClose={() => setIsSequenceSettingsOpen(false)}
    existingSettings={existingWorkflow?.sequenceSettings}
    existingName={existingWorkflow?.name}
  />
</PortalModal>
    </div>
  );
}