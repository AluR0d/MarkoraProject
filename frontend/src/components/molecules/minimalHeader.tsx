import LanguageSelector from '../atoms/LanguageSwitcher';

export default function MinimalHeader() {
  return (
    <div className="absolute top-0 right-0 w-full flex justify-end p-4">
      <LanguageSelector />
    </div>
  );
}
