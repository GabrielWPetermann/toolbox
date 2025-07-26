import ToolLayout from '../../../components/ToolLayout';
import UrlShortener from '../../../components/UrlShortener';

export default function UrlShortenerPage() {
  return (
    <ToolLayout 
      title="🔗 URL Shortener"
      description="Create short links using TinyURL for easy sharing"
    >
      <UrlShortener />
    </ToolLayout>
  );
}
