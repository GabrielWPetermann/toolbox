import ToolLayout from '../../../components/ToolLayout';
import MarkdownToPdfSimple from '../../../components/MarkdownToPdfSimple';

export default function MarkdownToPdfPage() {
  return (
    <ToolLayout 
      title="📄 Markdown to PDF"
      description="Convert Markdown text to professionally formatted PDF documents"
    >
      <MarkdownToPdfSimple />
    </ToolLayout>
  );
}
