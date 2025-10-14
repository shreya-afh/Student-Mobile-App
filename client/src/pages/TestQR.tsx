import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ChevronLeft } from 'lucide-react';

export default function TestQR() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, setLocation] = useLocation();

  const sampleData = {
    sessionId: "SES001",
    courseId: "CRS001",
    session: "Introduction to Web Development",
    course: "Full Stack Development",
    date: new Date().toISOString().split('T')[0],
    timestamp: Date.now()
  };

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        JSON.stringify(sampleData),
        {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        },
        (error) => {
          if (error) console.error('QR Code generation error:', error);
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/dashboard')}
            className="h-10 w-10"
            data-testid="button-back"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Test QR Code</h1>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Sample Attendance QR</h2>
          
          <div className="flex justify-center mb-6">
            <canvas ref={canvasRef} className="border-2 border-gray-200 rounded-lg" />
          </div>

          <div className="text-left space-y-2 mb-6 bg-gray-50 p-4 rounded-lg">
            <p className="text-sm"><strong>Session ID:</strong> {sampleData.sessionId}</p>
            <p className="text-sm"><strong>Course ID:</strong> {sampleData.courseId}</p>
            <p className="text-sm"><strong>Session:</strong> {sampleData.session}</p>
            <p className="text-sm"><strong>Course:</strong> {sampleData.course}</p>
            <p className="text-sm"><strong>Date:</strong> {sampleData.date}</p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => setLocation('/attendance')}
              className="w-full bg-[#6d10b0] hover:bg-[#5a0d92]"
              data-testid="button-scan-attendance"
            >
              Go to Attendance Scanner
            </Button>
            
            <Button 
              onClick={() => setLocation('/dashboard')}
              variant="outline"
              className="w-full"
              data-testid="button-back-dashboard"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>How to test:</strong> Open this page on one device, then use another device (or the same device in split screen) to scan this QR code from the attendance page.
          </p>
        </div>
      </div>
    </div>
  );
}
