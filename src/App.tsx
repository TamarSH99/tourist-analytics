import registryData from './assets/data/registry.json';
import statisticsData from './assets/data/statistics.json';
import type { StatisticsDB } from './types/data';
import type { RegistryDB } from './types/data';

function App() {
  const registry = registryData as unknown as RegistryDB;
  const statistics = statisticsData as unknown as StatisticsDB;
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Foundation Phase: Success</h1>
      <p>Testing Registry Data Load:</p>
      <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '8px' }}>
        <strong>Region:</strong> {registry["GE-IM"].name} <br />
        <strong>Monuments:</strong> {registry["GE-IM"].monuments.join(", ")} <br />
        <strong>Statistics of 2025: </strong> {statistics["2025"]["GE-IM"].total_visitors} visitors <br/>
      </div>
    </div>
  );
}

export default App;