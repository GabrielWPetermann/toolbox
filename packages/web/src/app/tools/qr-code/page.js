import ToolLayout from '../../../components/ToolLayout';
import QRCodeGenerator from '../../../components/QRCodeGenerator';

export default function QRCodePage() {
  return (
    <ToolLayout 
      title="📱 QR Code Generator"
      description="Generate QR codes from any text or URL"
    >
      <QRCodeGenerator />
    </ToolLayout>
  );
}
