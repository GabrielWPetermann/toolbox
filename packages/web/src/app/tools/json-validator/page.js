import ToolLayout from '../../../components/ToolLayout';
import JsonValidator from '../../../components/JsonValidator';

export default function JsonValidatorPage() {
  return (
    <ToolLayout 
      title="🔍 JSON Validator"
      description="Validate and format JSON data with detailed error reporting"
    >
      <JsonValidator />
    </ToolLayout>
  );
}
