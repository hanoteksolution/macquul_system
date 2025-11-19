import { useSettings } from '../contexts/SettingsContext';

export default function SettingsDemo() {
  const { settings, loading, refreshSettings, forceRefresh } = useSettings();

  if (loading) {
    return <div className="p-4 bg-gray-100 rounded-lg">Loading settings...</div>;
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border max-w-sm z-50">
      <h3 className="font-bold mb-2">Current Settings:</h3>
      <div className="text-sm space-y-1 mb-3">
        <div><strong>Site Name:</strong> {settings.siteName}</div>
        <div><strong>Email:</strong> {settings.contactEmail}</div>
        <div><strong>Phone:</strong> {settings.contactPhone}</div>
        <div className="flex items-center gap-2">
          <strong>Colors:</strong>
          <div 
            className="w-4 h-4 rounded border"
            style={{ backgroundColor: settings.primaryColor }}
            title="Primary"
          ></div>
          <div 
            className="w-4 h-4 rounded border"
            style={{ backgroundColor: settings.secondaryColor }}
            title="Secondary"
          ></div>
          <div 
            className="w-4 h-4 rounded border"
            style={{ backgroundColor: settings.accentColor }}
            title="Accent"
          ></div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={refreshSettings}
          className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Refresh
        </button>
        <button
          onClick={forceRefresh}
          className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
        >
          Force Reload
        </button>
      </div>
    </div>
  );
}
