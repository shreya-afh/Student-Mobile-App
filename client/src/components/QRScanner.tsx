import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const [error, setError] = useState<string>("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanning = useRef(false);

  useEffect(() => {
    const startScanner = async () => {
      if (isScanning.current) return;
      isScanning.current = true;

      try {
        const html5QrCode = new Html5Qrcode("qr-reader");
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            stopScanner();
            onScanSuccess(decodedText);
          },
          (errorMessage) => {
            console.log("QR scan error:", errorMessage);
          }
        );
      } catch (err) {
        console.error("Error starting QR scanner:", err);
        setError("Failed to access camera. Please check permissions.");
      }
    };

    const stopScanner = async () => {
      if (scannerRef.current?.isScanning) {
        try {
          await scannerRef.current.stop();
          scannerRef.current.clear();
        } catch (err) {
          console.error("Error stopping scanner:", err);
        }
      }
      isScanning.current = false;
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, [onScanSuccess]);

  const handleClose = async () => {
    if (scannerRef.current?.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="relative w-full h-full flex flex-col">
        <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 p-4 flex items-center justify-between">
          <h2 className="text-white font-['Inter',Helvetica] font-semibold text-lg">
            Scan QR Code
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-white hover:bg-white/20"
            data-testid="button-close-scanner"
          >
            <XIcon className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div id="qr-reader" className="w-full max-w-md" data-testid="qr-reader-container"></div>
        </div>

        {error && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white p-4 text-center">
            <p className="font-['Inter',Helvetica] font-medium">{error}</p>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
          <p className="text-white text-center font-['Inter',Helvetica] font-normal text-sm">
            Position the QR code within the frame
          </p>
        </div>
      </div>
    </div>
  );
}
