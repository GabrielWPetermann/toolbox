import ToolLayout from '../../../components/ToolLayout';
import TextComparer from '../../../components/TextComparer';

export default function TextComparerPage() {
  return (
    <ToolLayout 
      title="📝 Text Comparer"
      description="Compare two texts and highlight differences line by line, word by word, or character by character"
    >
      <TextComparer />
    </ToolLayout>
  );
}
