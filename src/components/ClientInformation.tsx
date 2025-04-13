
import React from 'react';
import { Proposal } from '@/types/proposal';
import { Mail, Phone, FileText } from 'lucide-react';

interface ClientInformationProps {
  proposal: Partial<Proposal>;
  styles: {
    accentColor: string;
    accentBg: string;
    borderColor: string;
  };
}

const ClientInformation: React.FC<ClientInformationProps> = ({ proposal, styles }) => {
  return (
    <div className="mb-8">
      <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${styles.accentColor}`}>
        <FileText className="h-5 w-5" />
        Client Information
      </h2>
      <div className={`${styles.accentBg} p-4 rounded-md border ${styles.borderColor}`}>
        <p className="font-semibold text-lg">{proposal.clientName}</p>
        <div className="mt-2 flex flex-col gap-2">
          {proposal.clientEmail && (
            <p className="client-email flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${proposal.clientEmail}`} className="text-primary hover:underline">
                {proposal.clientEmail}
              </a>
            </p>
          )}
          {proposal.clientPhone ? (
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{proposal.clientPhone}</span>
            </p>
          ) : (
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Not provided</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientInformation;
