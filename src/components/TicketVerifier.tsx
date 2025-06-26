import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ethers } from 'ethers';
import { CheckCircle, XCircle, AlertCircle, Camera, QrCode, Shield } from 'lucide-react';

interface BlockchainTicketData {
  ticketId: string;
  eventId: string;
  ticketNumber: string;
  attendeeName: string;
  attendeeEmail: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  paymentAmount?: number;
  paymentCurrency?: string;
  transactionHash?: string;
  timestamp: number;
  signature?: string;
  blockchainId?: string;
  verificationUrl?: string;
  blockchainExplorer?: string;
}

interface TicketVerifierProps {
  onClose?: () => void;
}

export const TicketVerifier: React.FC<TicketVerifierProps> = ({ onClose }) => {
  const [scannedData, setScannedData] = useState<BlockchainTicketData | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'valid' | 'invalid' | 'error'>('pending');
  const [verificationMessage, setVerificationMessage] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verify blockchain signature
  const verifyBlockchainSignature = async (ticketData: BlockchainTicketData): Promise<boolean> => {
    try {
      if (!ticketData.signature) return false;

      // Recreate the hash that was signed
      const dataString = JSON.stringify({
        ticketId: ticketData.ticketId,
        eventId: ticketData.eventId,
        ticketNumber: ticketData.ticketNumber,
        attendeeName: ticketData.attendeeName,
        eventTitle: ticketData.eventTitle,
        timestamp: ticketData.timestamp
      });
      
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes(dataString));
      
      // Recover the signer's address
      const privateKey = ethers.keccak256(ethers.toUtf8Bytes('cryptohub-event-organizer'));
      const expectedSigner = new ethers.Wallet(privateKey).address;
      
      // Verify the signature
      const recoveredAddress = ethers.verifyMessage(ethers.getBytes(dataHash), ticketData.signature);
      
      return recoveredAddress.toLowerCase() === expectedSigner.toLowerCase();
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  };

  // Verify ticket data integrity
  const verifyTicketIntegrity = (ticketData: BlockchainTicketData): boolean => {
    try {
      // Check if all required fields are present
      const requiredFields = ['ticketId', 'eventId', 'ticketNumber', 'attendeeName', 'eventTitle'];
      for (const field of requiredFields) {
        if (!ticketData[field as keyof BlockchainTicketData]) {
          return false;
        }
      }

      // Check if ticket is not expired (within 24 hours of event)
      const eventDate = new Date(ticketData.eventDate);
      const now = new Date();
      const timeDiff = eventDate.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 3600);
      
      // Ticket is valid if event is within 24 hours or hasn't passed
      return hoursDiff > -24;
    } catch (error) {
      console.error('Error verifying ticket integrity:', error);
      return false;
    }
  };

  // Handle QR code scan
  const handleQRScan = async (qrData: string) => {
    setIsScanning(true);
    setVerificationStatus('pending');
    setVerificationMessage('Verifying ticket...');

    try {
      const ticketData: BlockchainTicketData = JSON.parse(qrData);
      setScannedData(ticketData);

      // Verify blockchain signature
      const signatureValid = await verifyBlockchainSignature(ticketData);
      
      // Verify ticket integrity
      const integrityValid = verifyTicketIntegrity(ticketData);

      if (signatureValid && integrityValid) {
        setVerificationStatus('valid');
        setVerificationMessage('Ticket is valid and verified on blockchain!');
      } else if (!signatureValid) {
        setVerificationStatus('invalid');
        setVerificationMessage('Invalid blockchain signature - ticket may be counterfeit');
      } else {
        setVerificationStatus('invalid');
        setVerificationMessage('Ticket has expired or is invalid');
      }
    } catch (error) {
      setVerificationStatus('error');
      setVerificationMessage('Invalid QR code format or corrupted data');
    } finally {
      setIsScanning(false);
    }
  };

  // Handle file upload (for QR code images)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // In a real implementation, you would use a QR code reader library
    // For demo purposes, we'll simulate scanning
    const reader = new FileReader();
    reader.onload = () => {
      // Simulate QR code data extraction
      const mockQRData = JSON.stringify({
        ticketId: 'demo-ticket-123',
        eventId: 'demo-event-456',
        ticketNumber: 'TIX-001',
        attendeeName: 'John Doe',
        attendeeEmail: 'john@example.com',
        eventTitle: 'Demo Crypto Event',
        eventDate: '2024-12-25',
        eventTime: '18:00',
        eventLocation: 'Virtual Event',
        timestamp: Date.now(),
        signature: 'demo-signature',
        blockchainId: 'demo-bc-id'
      });
      
      handleQRScan(mockQRData);
    };
    reader.readAsDataURL(file);
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'valid':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'invalid':
        return <XCircle className="w-8 h-8 text-red-500" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-yellow-500" />;
      default:
        return <Shield className="w-8 h-8 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'valid':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'invalid':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'error':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-white/20">
        <CardHeader className="text-center border-b border-white/20">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Ticket Verifier
          </CardTitle>
          <p className="text-gray-300 text-sm">
            Scan QR code to verify blockchain ticket
          </p>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {!scannedData ? (
            // Scan Interface
            <div className="space-y-4">
              <div className="text-center">
                <div className="bg-white/5 rounded-xl p-8 border border-white/10 mb-4">
                  <QrCode className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <p className="text-gray-300 text-sm">
                    Point camera at QR code or upload image
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={() => setIsScanning(true)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={isScanning}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {isScanning ? 'Scanning...' : 'Scan QR Code'}
                </Button>
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Upload Image
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          ) : (
            // Verification Results
            <div className="space-y-4">
              <div className="text-center">
                {getStatusIcon()}
                <h3 className="text-xl font-bold text-white mt-2">
                  {verificationStatus === 'valid' ? 'Ticket Verified' : 'Verification Failed'}
                </h3>
                <Badge className={`mt-2 ${getStatusColor()}`}>
                  {verificationStatus === 'valid' ? 'Valid' : 
                   verificationStatus === 'invalid' ? 'Invalid' : 'Error'}
                </Badge>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="font-semibold text-white mb-3">Ticket Details</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div><span className="text-gray-400">Event:</span> {scannedData.eventTitle}</div>
                  <div><span className="text-gray-400">Attendee:</span> {scannedData.attendeeName}</div>
                  <div><span className="text-gray-400">Ticket:</span> {scannedData.ticketNumber}</div>
                  <div><span className="text-gray-400">Date:</span> {scannedData.eventDate}</div>
                  <div><span className="text-gray-400">Blockchain ID:</span> {scannedData.blockchainId}</div>
                </div>
              </div>
              
              <p className="text-sm text-gray-300 text-center">
                {verificationMessage}
              </p>
              
              <div className="flex space-x-3">
                <Button
                  onClick={() => {
                    setScannedData(null);
                    setVerificationStatus('pending');
                    setVerificationMessage('');
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Scan Another
                </Button>
                
                {onClose && (
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    Close
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 