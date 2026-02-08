import registryData from './assets/data/registry.json';
import statisticsData from './assets/data/statistics.json';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setYear, clearAllSelections, toggleRegion } from './store/slices/statsSlice';
import type { StatisticsDB } from './types/data';
import type { RegistryDB } from './types/data';

function App() {
  const registry = registryData as unknown as RegistryDB;
  const statistics = statisticsData as unknown as StatisticsDB;
  const { selectedYear, selectedRegionIds } = useAppSelector(state => state.stats);
  const dispatch = useAppDispatch();

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Foundation Phase: Success</h1>
      <p>Testing Registry Data Load:</p>
      <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '8px' }}>
        <strong>Region:</strong> {registry["GE-IM"].name} <br />
        <strong>Monuments:</strong> {registry["GE-IM"].monuments.join(", ")} <br />
        <strong>Statistics of 2025: </strong> {statistics["2025"]["GE-IM"].total_visitors} visitors <br />
      </div>
      <div>
        <h1>Current Year: {selectedYear}</h1>
        <button onClick={() => dispatch(setYear(2025))}>Change to 2025</button>
      </div>
      <div>
        <button onClick={() => dispatch(toggleRegion('GE-IM'))}>select imereti</button><br />
        <button
          onClick={() => dispatch(clearAllSelections())}
          disabled={selectedRegionIds.length === 0}
        >
          Clear All Selections
        </button>
      </div>
    </div >
  );
}

export default App;