import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Paper } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import geoData from "../../assets/data/geodata.json";
import registry from "../../assets/data/registry.json";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleRegion } from "../../store/slices/statsSlice";
import { type GeorgiaGeoJSON, type RegistryDB } from "../../types/data";
import MapControls from './MapControls';
import { MAP_STYLES, MAP_CONFIG, TILE_LAYERS } from '../../constants/mapConstants';

const REGISTRY = registry as unknown as RegistryDB;

const RegionMap = () => {
  const dispatch = useAppDispatch();
  const { selectedRegionIds } = useAppSelector((state) => state.stats);

  const onEachFeature = (feature: any, layer: any) => {
    const regionId = feature.properties.ISO_1;
    const regionName = REGISTRY[regionId]?.name || feature.properties.NAME_1;

    // Simple tooltip with region name, tmp for now - can be enhanced with more info later
    layer.bindTooltip(regionName, { 
      sticky: true, 
      direction: 'top',
      className: 'custom-tooltip'
    });

    layer.on({
      click: () => dispatch(toggleRegion(regionId)),
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({ 
          fillOpacity: MAP_STYLES.OPACITY.HOVER, 
          weight: MAP_STYLES.WEIGHT.HOVER 
        });
      },
      mouseout: (e: any) => {
        const layer = e.target;
        const isSelected = selectedRegionIds.includes(regionId);
        layer.setStyle({ 
          fillOpacity: isSelected ? MAP_STYLES.OPACITY.SELECTED : MAP_STYLES.OPACITY.DEFAULT,
          weight: MAP_STYLES.WEIGHT.DEFAULT 
        });
      }
    });
  };

  const geojsonStyle = (feature: any) => {
    const isSelected = selectedRegionIds.includes(feature.properties.ISO_1);
    return {
      fillColor: isSelected ? MAP_STYLES.COLORS.SELECTED : MAP_STYLES.COLORS.DEFAULT,
      weight: MAP_STYLES.WEIGHT.DEFAULT,
      opacity: 1,
      color: MAP_STYLES.COLORS.STROKE,
      fillOpacity: isSelected ? MAP_STYLES.OPACITY.SELECTED : MAP_STYLES.OPACITY.DEFAULT,
    };
  };

  return (
    <Paper sx={{ 
      position: 'relative', 
      height: "80vh", 
      width: '100%', 
      borderRadius: 4, 
      overflow: 'hidden' 
    }}>
      <MapContainer 
        center={MAP_CONFIG.CENTER} 
        zoom={MAP_CONFIG.ZOOM}
        minZoom={MAP_CONFIG.MIN_ZOOM}
        maxZoom={MAP_CONFIG.MAX_ZOOM}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url={TILE_LAYERS.SATELLITE.URL}
          attribution={TILE_LAYERS.SATELLITE.ATTRIBUTION}
        />

        <GeoJSON 
          key={JSON.stringify(selectedRegionIds)} 
          data={geoData as GeorgiaGeoJSON } 
          style={geojsonStyle}
          onEachFeature={onEachFeature}
        />

        <MapControls />
      </MapContainer>
    </Paper>
  );
};

export default RegionMap;