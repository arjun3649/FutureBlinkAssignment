import { Handle, Position } from '@xyflow/react';
import { useState } from 'react';

export function SelectLead({ data }) {
  const [isHovering, setIsHovering] = useState(false);
  
  // Show delete button for all nodes except base nodes 2 and 3
  // Node 1 will have a delete button but will only clear the leads, not delete the node
  const showButtons = data.showActionButtons && isHovering && data.id !== '2' && data.id !== '3';

  return (
    <div 
      className={data.nodestyle || "p-4 rounded-md bg-white border border-gray-200 shadow-md w-64"}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={data.handleclick}
    >
      <Handle type="target" position={Position.Top} />
      
      <div className="flex flex-col gap-2 items-center justify-center">
        {data.header && <label className={data.headercss || "font-medium text-gray-700"}>{data.header}</label>}
        {data.bottom && <label className={data.bottomcss || "text-sm text-gray-500"}>{data.bottom}</label>}
      </div>

      {showButtons && (
        <div className="absolute top-2 right-2 flex space-x-2">
          <div 
            className="bg-red-100 p-1 rounded cursor-pointer hover:bg-red-200"
            onClick={(e) => {
              e.stopPropagation();
              // If it's the lead source node (node 1), only clear the leads, don't delete the node
              data.onDelete(data.id);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
}