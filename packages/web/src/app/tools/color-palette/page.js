import ToolLayout from '../../../components/ToolLayout';
import ColorPaletteGenerator from '../../../components/ColorPaletteGenerator';

export default function ColorPalettePage() {
  return (
    <ToolLayout 
      title="🎨 Color Palette Generator"
      description="Generate beautiful color palettes from a base color using various color harmony rules"
    >
      <ColorPaletteGenerator />
    </ToolLayout>
  );
}
