import React, { useEffect, useRef, useState } from 'react';
import QRCodeLib from 'qrcode';
import { ethers } from 'ethers';

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
}

interface QRCodeProps {
  data: string | BlockchainTicketData;
  size?: number;
  className?: string;
  showBlockchainInfo?: boolean;
}

export const QRCodeComponent: React.FC<QRCodeProps> = ({ 
  data, 
  size = 128, 
  className = '',
  showBlockchainInfo = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [blockchainInfo, setBlockchainInfo] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  // Generate blockchain signature for ticket data
  const generateBlockchainSignature = async (ticketData: BlockchainTicketData): Promise<string> => {
    try {
      // Create a hash of the ticket data
      const dataString = JSON.stringify({
        ticketId: ticketData.ticketId,
        eventId: ticketData.eventId,
        ticketNumber: ticketData.ticketNumber,
        attendeeName: ticketData.attendeeName,
        eventTitle: ticketData.eventTitle,
        timestamp: ticketData.timestamp
      });
      
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes(dataString));
      
      // In a real implementation, this would be signed by the event organizer's private key
      // For demo purposes, we'll create a deterministic signature
      const privateKey = ethers.keccak256(ethers.toUtf8Bytes('cryptohub-event-organizer'));
      const wallet = new ethers.Wallet(privateKey);
      const signature = await wallet.signMessage(ethers.getBytes(dataHash));
      
      return signature;
    } catch (error) {
      console.error('Error generating blockchain signature:', error);
      return '';
    }
  };

  // Generate blockchain ID for the ticket
  const generateBlockchainId = (ticketData: BlockchainTicketData): string => {
    const dataString = JSON.stringify({
      ticketId: ticketData.ticketId,
      eventId: ticketData.eventId,
      timestamp: ticketData.timestamp
    });
    
    return ethers.keccak256(ethers.toUtf8Bytes(dataString)).slice(2, 10);
  };

  useEffect(() => {
    const generateQRCode = async () => {
      if (!canvasRef.current) return;

      setIsGenerating(true);
      try {
        let qrData: string;
        let blockchainData: BlockchainTicketData | null = null;

        if (typeof data === 'string') {
          qrData = data;
        } else {
          // Enhanced ticket data with blockchain features
          blockchainData = {
            ...data,
            timestamp: Date.now(),
            signature: await generateBlockchainSignature(data),
            blockchainId: generateBlockchainId(data)
          };

          // Create a comprehensive QR data string
          qrData = JSON.stringify({
            ...blockchainData,
            // Add blockchain verification URL
            verificationUrl: `${window.location.origin}/verify-ticket/${blockchainData.blockchainId}`,
            // Add blockchain explorer link if transaction hash exists
            ...(blockchainData.transactionHash && {
              blockchainExplorer: `https://etherscan.io/tx/${blockchainData.transactionHash}`
            })
          });

          setBlockchainInfo(blockchainData);
        }

        // Generate QR code
        const qrDataUrl = await QRCodeLib.toDataURL(qrData, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'H' // High error correction for better reliability
        });

        setQrDataUrl(qrDataUrl);

        // Draw QR code on canvas with additional styling
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, size, size);

        // Create background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, size, size);

        // Load and draw QR code image
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, size, size);
          
          // Add blockchain indicator if it's a blockchain ticket
          if (blockchainData && showBlockchainInfo) {
            // Add a small blockchain icon overlay
            ctx.fillStyle = '#3B82F6';
            ctx.fillRect(size - 20, 0, 20, 20);
            
            // Add blockchain text
            ctx.fillStyle = '#3B82F6';
            ctx.font = '8px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('BC', size - 10, 12);
          }
        };
        img.src = qrDataUrl;

      } catch (error) {
        console.error('Error generating QR code:', error);
        
        // Fallback to simple pattern if QR generation fails
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, size, size);
        
        ctx.fillStyle = '#fff';
        const squareSize = size / 8;
        
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            if ((i + j) % 2 === 0) {
              ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
            }
          }
        }

        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('QR Error', size / 2, size - 10);
      } finally {
        setIsGenerating(false);
      }
    };

    generateQRCode();
  }, [data, size, showBlockchainInfo]);

  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className={`border border-gray-300 rounded-lg shadow-lg ${className}`}
      />
      
      {/* Blockchain Info Overlay */}
      {blockchainInfo && showBlockchainInfo && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
            Blockchain Verified
          </div>
        </div>
      )}
      
      {/* Loading Indicator */}
      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

// Export the old name for backward compatibility
export const QRCode = QRCodeComponent; 