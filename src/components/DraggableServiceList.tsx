
import React from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { ServiceItem } from "@/types/proposal";
import ProposalServiceRow from "./ProposalServiceRow";

interface DraggableServiceListProps {
  services: ServiceItem[];
  onServiceChange: (updatedService: ServiceItem) => void;
  onServiceDelete: (serviceId: string) => void;
  onServicesReorder: (reorderedServices: ServiceItem[]) => void;
  currencySymbol: string;
}

const DraggableServiceList = ({
  services,
  onServiceChange,
  onServiceDelete,
  onServicesReorder,
  currencySymbol,
}: DraggableServiceListProps) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    // Don't do anything if dropped in the same position
    if (result.destination.index === result.source.index) return;
    
    // Create a copy of services array
    const reorderedServices = Array.from(services);
    
    // Remove the dragged item from its source
    const [movedItem] = reorderedServices.splice(result.source.index, 1);
    
    // Insert the dragged item at its destination position
    reorderedServices.splice(result.destination.index, 0, movedItem);
    
    // Update parent component with the new order
    onServicesReorder(reorderedServices);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-1">
        <div className="grid grid-cols-12 gap-2 text-sm text-muted-foreground mb-2">
          <div className="col-span-1"></div>
          <div className="col-span-4">Service</div>
          <div className="col-span-2">Unit Price</div>
          <div className="col-span-2">Quantity</div>
          <div className="col-span-2 text-right">Total</div>
          <div className="col-span-1"></div>
        </div>
        
        <Droppable droppableId="services-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-1"
            >
              {services.map((service, index) => (
                <Draggable key={service.id} draggableId={service.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${snapshot.isDragging ? "opacity-70" : ""}`}
                    >
                      <div className="flex items-center">
                        <div className="mr-2 text-muted-foreground">
                          <span className="flex items-center justify-center w-6 h-6">
                            ⋮⋮
                          </span>
                        </div>
                        <div className="flex-1">
                          <ProposalServiceRow
                            key={service.id}
                            service={service}
                            onChange={onServiceChange}
                            onDelete={() => onServiceDelete(service.id)}
                            currencySymbol={currencySymbol}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default DraggableServiceList;
