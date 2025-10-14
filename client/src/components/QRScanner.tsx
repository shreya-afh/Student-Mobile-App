import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { XIcon, RefreshCwIcon } from "lucide-react";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const [error, setError] = useState<string>("");
  const [isRetrying, setIsRetrying] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanning = useRef(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    startScanner();

    return () => {
      isMounted.current = false;
      stopScanner();
    };
  }, []);

  const stopScanner = async () => {
    if (scannerRef.current?.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    scannerRef.current = null;
    isScanning.current = false;
  };

  const startScanner = async () => {
    if (isScanning.current || !isMounted.current) return;
    
    await stopScanner();
    
    isScanning.current = true;
    setError("");
    setIsRetrying(false);

    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          await stopScanner();
          if (isMounted.current) {
            onScanSuccess(decodedText);
          }
        },
        (errorMessage) => {
          console.log("QR scan error:", errorMessage);
        }
      );
    } catch (err: any) {
      console.error("Error starting QR scanner:", err);
      if (isMounted.current) {
        setError(
          err?.message?.includes("Permission") || err?.message?.includes("NotAllowedError")
            ? "Camera permission denied. Please allow camera access and try again."
            : "Failed to access camera. Please check permissions and try again."
        );
      }
      isScanning.current = false;
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    await startScanner();
  };

  const handleClose = async () => {
    await stopScanner();
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

        {error ? (
          <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white p-4">
            <p className="font-['Inter',Helvetica] font-medium text-center mb-3">{error}</p>
            <Button
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full bg-white text-red-500 hover:bg-gray-100"
              data-testid="button-retry-scanner"
            >
              <RefreshCwIcon className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Retry Camera Access'}
            </Button>
          </div>
        ) : (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
            <p className="text-white text-center font-['Inter',Helvetica] font-normal text-sm">
              Position the QR code within the frame
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
