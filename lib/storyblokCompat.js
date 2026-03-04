// No-op replacements for Storyblok SDK functions.
// storyblokEditable used to add data-attributes for the visual editor.
// Since we no longer use Storyblok, it returns an empty object.
export function storyblokEditable() {
  return {};
}
